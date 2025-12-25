import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const CustomerLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-heading tracking-tight group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300">
                Premium Auto
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="relative z-10">Home</span>
                {isActive('/') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse"></div>
                )}
              </Link>
              <Link
                to="/wishlist"
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                  isActive('/wishlist')
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="relative z-10">Wishlist</span>
                {isActive('/wishlist') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse"></div>
                )}
              </Link>
              <Link
                to="/admin/login"
                className="px-5 py-2.5 bg-gray-800/50 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                Admin Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 animate-fade-in">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/wishlist') 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                Wishlist
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 hover:text-white transition-all"
              >
                Admin Login
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-gray-700/50 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-50"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Premium Auto</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner for premium vehicles. Quality cars, exceptional service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-cyan-400 transition-colors duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-cyan-400 transition-colors duration-200">Wishlist</Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-cyan-400 transition-colors duration-200">Admin Portal</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+92-300-1234567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@premiumauto.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Premium Auto Showroom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
