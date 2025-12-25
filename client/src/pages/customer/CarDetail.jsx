import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { showSuccess, showError, showInfo } from '../../utils/swal';

// Keyboard navigation for lightbox
const useKeyboardNavigation = (isOpen, onClose, onNext, onPrev, hasNext, hasPrev) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);
};

const PublicCarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showInquiry, setShowInquiry] = useState(false);
  const [wishlistEmail, setWishlistEmail] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  useEffect(() => {
    fetchCar();
  }, [id]);

  // Keyboard navigation for lightbox
  useKeyboardNavigation(
    isLightboxOpen,
    () => setIsLightboxOpen(false),
    () => setLightboxImageIndex((prev) => (prev < car?.images?.length - 1 ? prev + 1 : 0)),
    () => setLightboxImageIndex((prev) => (prev > 0 ? prev - 1 : (car?.images?.length || 1) - 1)),
    car?.images && lightboxImageIndex < car.images.length - 1,
    car?.images && lightboxImageIndex > 0
  );

  const fetchCar = async () => {
    try {
      const response = await axios.get(`/api/public/cars/${id}`);
      setCar(response.data.data);
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/public/inquiry', {
        ...inquiryForm,
        carId: id
      });
      await showSuccess('Your inquiry has been submitted successfully! We will contact you soon.', 'Inquiry Submitted');
      setShowInquiry(false);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    }
  };

  const handleAddToWishlist = async () => {
    if (!wishlistEmail) {
      showInfo('Please enter your email address to add this car to your wishlist.');
      return;
    }

    try {
      await axios.post('/api/public/wishlist', {
        carId: id,
        customerEmail: wishlistEmail
      });
      await showSuccess('Car added to your wishlist!', 'Added to Wishlist');
      setWishlistEmail('');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to add to wishlist. Please try again.');
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
          <p className="text-gray-300 text-lg font-medium mt-6">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <p className="text-gray-300 text-xl font-medium">Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        {/* Images Gallery */}
        <div>
          {car.images && car.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-800 group cursor-pointer border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500"
                onClick={() => {
                  setLightboxImageIndex(selectedImageIndex);
                  setIsLightboxOpen(true);
                }}
              >
                <img
                  src={`http://localhost:5000${car.images[selectedImageIndex].imageUrl}`}
                  alt={car.model}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 backdrop-blur-sm rounded-full p-4 border border-cyan-500/50">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900 text-white p-3 rounded-full shadow-lg border border-gray-700 hover:border-cyan-500 transition-all z-10"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900 text-white p-3 rounded-full shadow-lg border border-gray-700 hover:border-cyan-500 transition-all z-10"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm border border-gray-700">
                  {selectedImageIndex + 1} / {car.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {car.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setLightboxImageIndex(index);
                        setIsLightboxOpen(true);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                        selectedImageIndex === index
                          ? 'border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/30'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={`http://localhost:5000${image.imageUrl}`}
                        alt={`${car.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-1 right-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                          Primary
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="animate-slide-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-heading tracking-tight">
              {car.year} {car.make} {car.model}
            </h1>
            {car.variant && (
              <p className="text-xl text-gray-400 mb-6 font-medium">{car.variant}</p>
            )}
            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                PKR {car.price.toLocaleString()}
              </p>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                car.status === 'AVAILABLE' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : car.status === 'SOLD'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}>
                {car.status}
              </span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 font-heading tracking-tight">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Specifications</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Year</p>
                <p className="text-xl font-bold text-gray-100">{car.year}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Fuel Type</p>
                <p className="text-xl font-bold text-gray-100">{car.fuelType}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Transmission</p>
                <p className="text-xl font-bold text-gray-100">{car.transmission}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Mileage</p>
                <p className="text-xl font-bold text-gray-100">{car.mileage?.toLocaleString()} km</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Engine Capacity</p>
                <p className="text-xl font-bold text-gray-100">{car.engineCapacity} CC</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Color</p>
                <p className="text-xl font-bold text-gray-100">{car.color}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Condition</p>
                <p className="text-xl font-bold text-gray-100">{car.condition}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all">
                <p className="text-sm text-gray-400 mb-2">Status</p>
                <p className="text-xl font-bold text-gray-100">{car.status}</p>
              </div>
            </div>
          </div>

          {car.description && (
            <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Description</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">{car.description}</p>
            </div>
          )}

          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setShowInquiry(!showInquiry)}
              className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center gap-2 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {showInquiry ? 'Hide Inquiry Form' : 'Make an Inquiry'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Your email for wishlist"
                  value={wishlistEmail}
                  onChange={(e) => setWishlistEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <button
                onClick={handleAddToWishlist}
                className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center gap-2 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Wishlist
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {showInquiry && (
            <form onSubmit={handleInquiry} className="mt-4 bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 animate-scale-in">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Inquiry Form</span>
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  className="w-full bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  className="w-full bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
                <input
                  type="tel"
                  placeholder="Your Phone *"
                  required
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  className="w-full bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
                <textarea
                  placeholder="Your Message *"
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  rows="4"
                  className="w-full bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                />
                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 group"
                >
                  <span className="relative z-10">Submit Inquiry</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>

      {/* Full Screen Lightbox */}
      {isLightboxOpen && car.images && car.images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          {car.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Full Screen Image */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:5000${car.images[lightboxImageIndex].imageUrl}`}
              alt={`${car.model} - Image ${lightboxImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {lightboxImageIndex + 1} / {car.images.length}
          </div>

          {/* Thumbnail Strip */}
          {car.images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4">
              {car.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImageIndex(index);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    lightboxImageIndex === index
                      ? 'border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/30'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={`http://localhost:5000${image.imageUrl}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard Navigation Hint */}
          <div className="absolute top-4 left-4 text-white/60 text-sm">
            Press ESC to close
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCarDetail;


