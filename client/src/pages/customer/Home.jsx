import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PublicHome = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      params.append('status', 'AVAILABLE');

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/public/cars?${params}`);
      setCars(response.data.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-20 w-20 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
          <p className="text-gray-300 text-lg font-medium mt-6">Loading amazing cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-cyan-900/30 to-purple-900/30 border-b border-gray-700/50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 font-heading tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Discover Your Dream Car
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-body font-medium">
              Premium vehicles at unbeatable prices
            </p>
            <div className="flex justify-center gap-4">
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-12 animate-slide-in border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-heading tracking-tight">Search & Filter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Make (e.g., Toyota)"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <input
              type="text"
              placeholder="Model (e.g., Corolla)"
              value={filters.model}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <select
              value={filters.fuelType}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            >
              <option value="">All Fuel Types</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ELECTRIC">Electric</option>
              <option value="CNG">CNG</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            >
              <option value="createdAt">Latest</option>
              <option value="price">Price</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
              className="bg-gray-900/50 border-2 border-gray-700 text-gray-200 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 animate-fade-in">
          <p className="text-gray-300 text-lg">
            Found <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{cars.length}</span> amazing {cars.length === 1 ? 'car' : 'cars'}
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div
              key={car.id}
              className="group relative bg-gray-800/50 backdrop-blur-xl rounded-3xl overflow-hidden hover-lift animate-fade-in border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:5000${car.images[0].imageUrl}`}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <svg className="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-cyan-400 border border-cyan-500/30">
                  {car.status}
                </div>
                {car.images && car.images.length > 1 && (
                  <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border border-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {car.images.length} Photos
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 relative z-10">
                <h3 className="text-2xl font-bold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors duration-300 font-heading tracking-tight">
                  {car.year} {car.make} {car.model}
                </h3>
                {car.variant && (
                  <p className="text-gray-400 text-sm mb-3">{car.variant}</p>
                )}
                <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 rounded-lg">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {car.fuelType}
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 rounded-lg">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.transmission}
                  </span>
                  {car.mileage && (
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 rounded-lg">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {car.mileage.toLocaleString()} km
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      PKR {car.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/car/${car.id}`}
                  className="block w-full text-center relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 group"
                >
                  <span className="relative z-10">View Details</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full mb-4 border border-gray-700">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-300 text-xl font-medium mb-2">No cars found</p>
            <p className="text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicHome;
