import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Moon, Sun, Package, Search, LogOut, ChevronDown, Info, Mail, Globe, Heart } from 'lucide-react';
import { useAuth } from '../App';
import { useCartStore } from '../store/cartStore';
import { useLang } from '../context/LanguageContext';
import { api } from '../lib/api';

function ProfileDropdown({ user, logout, navigate }: { user: any; logout: () => void; navigate: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent-500 to-amber-600 flex items-center justify-center text-white text-sm font-medium shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-scale-in">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 mt-1">Admin</span>
            )}
          </div>
          <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setOpen(false)}>
            <User className="h-4 w-4 mr-2" /> Profile
          </Link>
          <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setOpen(false)}>
            <Package className="h-4 w-4 mr-2" /> Orders
          </Link>
          <div className="border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl transition-colors">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageToggle() {
  const { locale, setLocale, locales } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [open]);

  const current = locales.find((l) => l.code === locale)!;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse">
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase hidden sm:inline">{current.code}</span>
      </button>
      {open && (
        <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-scale-in max-h-72 overflow-y-auto">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`flex items-center w-full px-3 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${l.code === locale ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
            >
              <span className="text-base mr-2 rtl:ml-2 rtl:mr-0">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const { user, logout } = useAuth();
  const { itemCount, fetchCart } = useCartStore();
  const { t } = useLang();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          setScrolled(currentScroll > 20);
          setVisible(currentScroll < prevScroll || currentScroll < 80);
          setPrevScroll(currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScroll]);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const data = await api.getProducts({ search: searchQuery.trim(), limit: '5' });
          setSearchSuggestions(data.products);
          setShowSuggestions(true);
        } catch {
          setSearchSuggestions([]);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    navigate(`/products/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50'
          : 'bg-transparent'
      } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Package className="h-8 w-8 text-accent-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-10deg]" />
              <div className="absolute -inset-1 bg-accent-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
              ShopPro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: '/', label: t('nav.home') },
              { to: '/products', label: t('nav.products') },
              { to: '/about', label: t('nav.about') },
              { to: '/contact', label: t('nav.contact') },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-500 rounded-full group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}
            {user?.role === 'admin' && (
              <div className="relative group">
                <button className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  {t('nav.admin')} <ChevronDown className="ml-1 rtl:mr-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                  <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-xl transition-colors">
                    <Package className="h-4 w-4 mr-2" /> Dashboard
                  </Link>
                  <Link to="/admin/products" className="flex items-center px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Package className="h-4 w-4 mr-2" /> Products
                  </Link>
                  <Link to="/admin/orders" className="flex items-center px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Package className="h-4 w-4 mr-2" /> Orders
                  </Link>
                  <Link to="/admin/users" className="flex items-center px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-b-xl transition-colors">
                    <User className="h-4 w-4 mr-2" /> Users
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className={`h-5 w-5 transition-colors ${searchOpen ? 'text-accent-500' : 'text-slate-600 dark:text-slate-300'}`} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              <div className="relative h-5 w-5">
                <Sun className={`h-5 w-5 text-yellow-500 transition-all duration-300 absolute inset-0 ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                <Moon className={`h-5 w-5 text-slate-600 transition-all duration-300 absolute inset-0 ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              </div>
            </button>

            <LanguageToggle />

            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              {itemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-in shadow-lg shadow-accent-500/30">
                  {itemCount()}
                </span>
              )}
            </Link>

            {user ? (
              <ProfileDropdown user={user} logout={logout} navigate={navigate} />
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-500 to-amber-600 rounded-xl hover:from-accent-600 hover:to-amber-700 transition-all duration-200 hover:shadow-lg hover:shadow-accent-500/25"
              >
                {t('nav.signin')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Menu"
            >
              <div className="relative w-5 h-5">
                <Menu className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-3xl mx-auto px-4 py-3" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, brands..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none text-sm transition-all"
                autoFocus
              />
              {/* Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden animate-scale-in">
                  {searchSuggestions.map((product: any) => {
                    const imgs = JSON.parse(product.images || '[]');
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSuggestionClick(product.slug)}
                        className="flex items-center w-full px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 mr-3">
                          {imgs[0] ? <img src={imgs[0]} alt="" className="w-full h-full object-cover" /> : <Package className="h-4 w-4 m-2 text-slate-400" />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                          <p className="text-xs text-slate-500">${product.price.toFixed(2)}</p>
                        </div>
                      </button>
                    );
                  })}
                  <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2">
                    <button
                      type="submit"
                      className="w-full text-center text-sm text-accent-600 hover:text-accent-700 font-medium"
                      onClick={() => setShowSuggestions(false)}
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="px-4 py-3 space-y-1">
            {[
              { to: '/', label: t('nav.home'), icon: Package },
              { to: '/products', label: t('nav.products'), icon: Search },
              { to: '/about', label: t('nav.about'), icon: Info },
              { to: '/contact', label: t('nav.contact'), icon: Mail },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <item.icon className="h-4 w-4 mr-3 text-slate-400" />
                {item.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-1 mt-1" />
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors">
                  <Package className="h-4 w-4 mr-3" /> Admin Dashboard
                </Link>
                <Link to="/admin/products" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-7">
                  Manage Products
                </Link>
                <Link to="/admin/orders" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-7">
                  Manage Orders
                </Link>
              </>
            )}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-1 mt-1" />
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="h-4 w-4 mr-3" /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors">
                <User className="h-4 w-4 mr-3" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
