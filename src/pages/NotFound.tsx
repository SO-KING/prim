import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Animated 404 */}
        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-6">
          <span className="text-[8rem] md:text-[10rem] font-black text-slate-200 dark:text-slate-800 leading-none select-none animate-float" style={{ animationDelay: '0s' }}>
            4
          </span>
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-accent-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-accent-500/30 animate-pulse-glow">
              <span className="text-5xl md:text-6xl font-black text-white">0</span>
            </div>
            <div className="absolute -inset-4 rounded-full border border-accent-500/20 animate-spin-slow" />
          </div>
          <span className="text-[8rem] md:text-[10rem] font-black text-slate-200 dark:text-slate-800 leading-none select-none animate-float" style={{ animationDelay: '0.5s' }}>
            4
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]"
          >
            <Home className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
          >
            <Search className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Browse Products
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-400 mb-4">Popular pages</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
              { to: '/cart', label: 'Cart' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/20 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
              >
                <ArrowLeft className="h-3 w-3 mr-1 rtl:rotate-180" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
