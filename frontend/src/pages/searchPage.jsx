import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const term = urlParams.get('searchTerm');
    if (term) setSearchTerm(term);
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search${urlParams.toString()}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-semibold mb-6 text-slate-200">Search Properties</h1>
          <form onSubmit={handleSubmit} className="mb-8">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 rounded-full border border-slate-800 bg-slate-900/90 py-2.5 pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" className="mt-2 rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white">
              Search
            </button>
          </form>
          <div className="space-y-4">
            {/* Search results will be rendered here */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;