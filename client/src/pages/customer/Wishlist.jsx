import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showDeleteConfirm, showError, showSuccess } from '../../utils/swal';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchWishlist = async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/public/wishlist/${email}`);
      setWishlist(response.data.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (carId) => {
    const result = await showDeleteConfirm(
      'This car will be removed from your wishlist.',
      'Remove from Wishlist?'
    );

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/public/wishlist/${carId}?email=${email}`);
        await showSuccess('Car removed from wishlist successfully!', 'Removed');
        fetchWishlist();
      } catch (error) {
        showError(error.response?.data?.message || 'Failed to remove from wishlist. Please try again.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWishlist();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-20 w-20 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
          <p className="text-gray-300 text-lg font-medium mt-6">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-cyan-900/30 to-purple-900/30 border-b border-gray-700/50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center animate-fade-in">
          <div className="inline-block p-5 bg-gray-900/50 backdrop-blur-sm rounded-full mb-6 border border-cyan-500/30">
            <svg className="w-14 h-14 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-heading tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Wishlist
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-body font-medium">Your favorite cars in one place</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Email Form */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-12 max-w-lg mx-auto animate-scale-in border border-gray-700/50">
          <form onSubmit={handleSubmit}>
            <label className="block text-lg font-semibold text-gray-200 mb-4">
              Enter your email to view your wishlist
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 group"
              >
                <span className="relative z-10">View Wishlist</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Results Count */}
        {submitted && wishlist.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <p className="text-gray-300 text-lg">
              You have <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{wishlist.length}</span> {wishlist.length === 1 ? 'car' : 'cars'} in your wishlist
            </p>
          </div>
        )}

        {/* Empty State */}
        {submitted && wishlist.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full mb-4 border border-gray-700">
              <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-300 text-xl font-medium mb-2">Your wishlist is empty</p>
            <p className="text-gray-500 mb-6">Start adding cars to your wishlist to see them here</p>
            <Link
              to="/"
              className="inline-block relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 group"
            >
              <span className="relative z-10">Browse Cars</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-gray-800/50 backdrop-blur-xl rounded-3xl overflow-hidden hover-lift animate-fade-in border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {item.car.images && item.car.images.length > 0 ? (
                    <>
                      <img
                        src={item.car.images[0].imageUrl}
                        alt={item.car.model}
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
                  <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-red-600 transition-colors border border-red-400/30 z-10"
                    onClick={() => handleRemove(item.car.id)}
                    title="Remove from wishlist"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors duration-300 font-heading tracking-tight">
                    {item.car.year} {item.car.make} {item.car.model}
                  </h3>
                  {item.car.variant && (
                    <p className="text-gray-400 text-sm mb-4">{item.car.variant}</p>
                  )}
                  <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 rounded-lg">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {item.car.fuelType}
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 rounded-lg">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.car.transmission}
                    </span>
                  </div>
                  <div className="mb-6">
                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      PKR {item.car.price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/car/${item.car.id}`}
                    className="block w-full text-center relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 group"
                  >
                    <span className="relative z-10">View Details</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
