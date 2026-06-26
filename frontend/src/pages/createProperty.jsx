// src/pages/CreateProperty.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, MapPin, DollarSign, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { storage } from '../appwrite';
import { ID } from 'appwrite';


const inputClass =
  'w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:border-[#FF385C] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100';
const errorInputClass = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20';

export default function CreateProperty() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    name: '',
    description: '',
    address: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    type: 'rent',
    offer: false,
    discountPrice: '',
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [listingsFetched, setListingsFetched] = useState(false);
  const [listingsError, setListingsError] = useState('');

  useEffect(() => {
    if (showListings) {
      // always fetch when toggling open to avoid stale/empty listings
      fetchMyListings();
    }
  }, [showListings]);

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const nextFiles = selectedFiles.slice(0, 6 - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...nextFiles]);
    setErrors((prev) => ({ ...prev, images: null }));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const validation = {};

    if (!fields.name.trim()) validation.name = 'Property name is required.';
    if (!fields.description.trim()) validation.description = 'Description is required.';
    if (!fields.address.trim()) validation.address = 'Address is required.';
    if (!fields.price || Number(fields.price) <= 0) validation.price = 'Price must be greater than 0.';
    if (!images.length) validation.images = 'Upload at least one photo.';
    if (fields.offer && (!fields.discountPrice || Number(fields.discountPrice) <= 0)) {
      validation.discountPrice = 'Discount price must be greater than 0.';
    }

    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const fetchMyListings = async () => {
    setIsLoadingListings(true);
    setListingsError('');

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('/api/properties/my-listings');
      setListings(response.data || []);
      setListingsFetched(true);
    } catch (error) {
      setListingsError(error?.response?.data?.message || 'Unable to load your listings.');
    } finally {
      setIsLoadingListings(false);
    }
  };

  const uploadImages = async () => {
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

    if (!bucketId || !endpoint || !projectId) {
      throw new Error('Appwrite storage configuration is missing. Set VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, and VITE_APPWRITE_BUCKET_ID.');
    }

    const urls = await Promise.all(
      images.map(async ({ file }) => {
        const uploadedFile = await storage.createFile(bucketId, ID.unique(), file);
        return `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${projectId}`;
      })
    );

    return urls;
  };

  const handleSubmit = async () => {
    setStatus({ type: '', message: '' });

    if (!validate()) {
      setStatus({ type: 'error', message: 'Please fix the errors before submitting.' });
      return;
    }

    setIsSubmitting(true);

    try {
      axios.defaults.withCredentials = true;
      const imageUrls = await uploadImages();

      await axios.post('/api/properties/create-property', {
        name: fields.name,
        description: fields.description,
        address: fields.address,
        regularPrice: Number(fields.price),
        discountPrice: fields.offer ? Number(fields.discountPrice) : 0,
        bathrooms: Number(fields.bathrooms),
        bedrooms: Number(fields.bedrooms),
        parking: fields.parking,
        furnished: fields.furnished,
        type: fields.type,
        offer: fields.offer,
        imageUrls,
      });

      setStatus({ type: 'success', message: 'Property created successfully.' });
      navigate('/profile');
    } catch (error) {
      setStatus({ type: 'error', message: error?.response?.data?.message || error?.message || 'Unable to create property.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 dark:bg-neutral-950">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-4">
          <Home className="h-5 w-5 text-[#FF385C]" />
          <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">List a new property</h1>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-6">
        {status.message ? (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${status.type === 'success' ? 'border-emerald-300 bg-emerald-500/10 text-emerald-200' : 'border-rose-300 bg-rose-500/10 text-rose-200'}`}>
            {status.message}
          </div>
        ) : null}

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setShowListings((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-left text-sm font-medium text-neutral-900 transition hover:border-[#FF385C] hover:bg-[#FFF1F4] dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          >
            <span>Show my published listings</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showListings ? 'rotate-180' : ''}`} />
          </button>

          {showListings ? (
            <div className="mt-4 space-y-2">
              {isLoadingListings ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
                  Loading listings...
                </div>
              ) : listingsError ? (
                <div className="rounded-2xl border border-rose-300 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                  {listingsError}
                </div>
              ) : listings.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
                  You have no published listings yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {listings.map((listing) => (
                    <button
                      key={listing._id}
                      type="button"
                      onClick={() => navigate(`/update-property/${listing._id}`)}
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm text-neutral-900 transition hover:border-[#FF385C] hover:bg-[#FFF1F4] dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                    >
                      <div className="font-medium">{listing.name}</div>
                      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{listing.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Photos</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Upload property images. The first photo becomes the cover.</p>
          <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-sm text-neutral-600 transition hover:border-[#FF385C] hover:bg-[#FFF1F4] dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
            <span>Select photos</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />
          </label>
          {errors.images ? <p className="mt-3 text-sm text-rose-400">{errors.images}</p> : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
                <img src={image.preview} alt={`preview-${index}`} className="h-32 w-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Basics</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Property name</label>
              <input className={`${inputClass} ${errors.name ? errorInputClass : ''} mt-2`} value={fields.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="Sunny loft near downtown" />
              {errors.name ? <p className="mt-2 text-sm text-rose-400">{errors.name}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Description</label>
              <textarea className={`${inputClass} mt-2 min-h-30 resize-y ${errors.description ? errorInputClass : ''}`} value={fields.description} onChange={(e) => handleFieldChange('description', e.target.value)} placeholder="Describe what makes this place special..." />
              {errors.description ? <p className="mt-2 text-sm text-rose-400">{errors.description}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Address</label>
              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input className={`${inputClass} pl-10 ${errors.address ? errorInputClass : ''}`} value={fields.address} onChange={(e) => handleFieldChange('address', e.target.value)} placeholder="123 Market St, San Francisco, CA" />
              </div>
              {errors.address ? <p className="mt-2 text-sm text-rose-400">{errors.address}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Price per night (USD)</label>
              <div className="relative mt-2">
                <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="number" min={0} className={`${inputClass} pl-10 ${errors.price ? errorInputClass : ''}`} value={fields.price} onChange={(e) => handleFieldChange('price', e.target.value)} />
              </div>
              {errors.price ? <p className="mt-2 text-sm text-rose-400">{errors.price}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Type</label>
                <select className={`${inputClass} mt-2`} value={fields.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input id="offer" type="checkbox" checked={fields.offer} onChange={(e) => handleFieldChange('offer', e.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-[#FF385C] focus:ring-[#FF385C]" />
                <label htmlFor="offer" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Offer available</label>
              </div>
            </div>
            {fields.offer ? (
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Discount price</label>
                <input type="number" min={0} className={`${inputClass} mt-2 ${errors.discountPrice ? errorInputClass : ''}`} value={fields.discountPrice} onChange={(e) => handleFieldChange('discountPrice', e.target.value)} />
                {errors.discountPrice ? <p className="mt-2 text-sm text-rose-400">{errors.discountPrice}</p> : null}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Bedrooms</label>
                <input type="number" min={1} className={inputClass} value={fields.bedrooms} onChange={(e) => handleFieldChange('bedrooms', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Bathrooms</label>
                <input type="number" min={1} className={inputClass} value={fields.bathrooms} onChange={(e) => handleFieldChange('bathrooms', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Parking</label>
                <select className={inputClass} value={fields.parking ? 'yes' : 'no'} onChange={(e) => handleFieldChange('parking', e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">Furnished</label>
              <select className={inputClass} value={fields.furnished ? 'yes' : 'no'} onChange={(e) => handleFieldChange('furnished', e.target.value === 'yes')}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3 px-4 py-3">
          <button type="button" onClick={() => navigate(-1)} className="rounded-full px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 rounded-full bg-[#FF385C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#E31C5F] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Publishing...' : 'Publish property'}
          </button>
        </div>
         
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}