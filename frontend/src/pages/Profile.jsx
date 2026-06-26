import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'
import axios from 'axios'
import { Camera, Lock, Trash2, Upload, Plus, ChevronDown } from 'lucide-react'
import { storage } from '../appwrite'
import { ID } from 'appwrite'


const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'

export default function Profile() {
  const { user, updateProfile, deleteAccount, isLoading, error } = useAuthStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [message, setMessage] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showListings, setShowListings] = useState(false)
  const [listings, setListings] = useState([])
  const [isLoadingListings, setIsLoadingListings] = useState(false)
  const [listingsError, setListingsError] = useState('')
  const [listingsFetched, setListingsFetched] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setAvatarPreview(user.profilePicture || '')
    }
  }, [user])

  useEffect(() => {
    if (showListings) {
      // always fetch when toggling open to avoid stale/empty listings
      fetchMyListings()
    }
  }, [showListings])

  const fetchMyListings = async () => {
    setIsLoadingListings(true)
    setListingsError('')
    try {
      axios.defaults.withCredentials = true
      const response = await axios.get('/api/properties/propertycontroller/my-listings')
      setListings(response.data || [])
      setListingsFetched(true)
    } catch (err) {
      setListingsError(err?.response?.data?.message || 'Unable to load your listings.')
    } finally {
      setIsLoadingListings(false)
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      const imageData = reader.result
      setAvatarPreview(imageData)
    }
    reader.readAsDataURL(file)
  }

  const uploadAvatarToBackend = async () => {
    if (!avatarFile || !avatarPreview) return null
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

    if (!bucketId || !endpoint || !projectId) {
      throw new Error('Appwrite storage configuration is missing. Please set VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, and VITE_APPWRITE_BUCKET_ID.')
    }

    const file = await storage.createFile(bucketId, ID.unique(), avatarFile)
    return `${endpoint}/storage/buckets/${bucketId}/files/${file.$id}/view?project=${projectId}`
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsSaving(true)
    try {
      const profilePicture = avatarFile ? await uploadAvatarToBackend() : user.profilePicture
      const response = await updateProfile({
        name,
        email,
        currentPassword: currentPassword.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
        profilePicture: profilePicture || undefined,
      })
      setMessage('Profile updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setAvatarFile(null)
      const updatedUrl = response?.user?.profilePicture || profilePicture || user.profilePicture
      if (updatedUrl) {
        setAvatarPreview(updatedUrl)
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Unable to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    if (!deletePassword) {
      setMessage('Please enter your password to delete your account.')
      return
    }
    setMessage('')
    setIsDeleting(true)
    try {
      await deleteAccount(deletePassword)
      navigate('/login')
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Unable to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-4xl bg-slate-900/95 border border-slate-800 shadow-2xl shadow-black/40 p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-100">Your Profile</h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your avatar, email, and password from one place.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-emerald-500 bg-slate-800">
              <img
                src={avatarPreview || defaultAvatar}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 transition hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-right lg:text-left">
              <p className="text-sm text-slate-400">Signed in as</p>
              <p className="text-base font-medium text-slate-100">{user.email}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[min-content_min-content]">
              <button
                type="button"
                onClick={() => navigate('/create-property')}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-emerald-500/70 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
              >
                <Plus className="h-4 w-4" />
                Add property
              </button>
              <button
                type="button"
                onClick={() => setShowListings((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-emerald-500 hover:bg-slate-900"
              >
                <span>Show listings</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showListings ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {showListings ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
            <h2 className="text-lg font-semibold text-slate-100">Your published listings</h2>
            <p className="mt-2 text-sm text-slate-400">Click a listing to edit it.</p>
            <div className="mt-4 space-y-3">
              {isLoadingListings ? (
                <div className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-400">Loading listings...</div>
              ) : listingsError ? (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 px-4 py-3 text-sm text-rose-300">{listingsError}</div>
              ) : listings.length === 0 ? (
                <div className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-400">You have no published listings yet.</div>
              ) : (
                <div className="grid gap-3">
                  {listings.map((listing) => (
                    <button
                      key={listing._id}
                      type="button"
                      onClick={() => navigate(`/update-property/${listing._id}`)}
                      className="w-full text-left rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 transition hover:border-emerald-500 hover:bg-slate-900"
                    >
                      <div className="font-semibold text-slate-100">{listing.name}</div>
                      <div className="mt-1 text-sm text-slate-400">{listing.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
        <form onSubmit={handleUpdate} className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Avatar</label>
            <div className="flex items-center gap-4 rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                <img
                  src={avatarPreview || defaultAvatar}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <label className="cursor-pointer rounded-3xl border border-emerald-500/70 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/15 transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload image
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <div className="mt-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <div className="mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Current password</label>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent text-slate-100 outline-none"
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">New password</label>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent text-slate-100 outline-none"
                  placeholder="Leave blank if not changing"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h2 className="text-lg font-semibold text-slate-100">Preview</h2>
              <p className="mt-2 text-sm text-slate-400">
                Update your profile data and save changes when ready.
              </p>
              {message || error ? (
                <div className="mt-4 rounded-3xl bg-slate-800/80 px-4 py-3 text-sm text-emerald-200">
                  {message || error}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isSaving || isLoading}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving || isLoading ? 'Saving...' : 'Save profile'}
              </button>
            </div>
            <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Delete account</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    This action is permanent. Enter your password to delete your account.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3">
                  <Trash2 className="h-4 w-4 text-rose-400" />
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full bg-transparent text-slate-100 outline-none"
                    placeholder="Confirm password"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-rose-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDeleting ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
