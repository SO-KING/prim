import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t, dir } = useLang();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-500 dark:from-slate-500 dark:via-slate-400 dark:to-slate-300" />

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <button onClick={scrollToTop} className="flex items-center space-x-2 group">
              <Package className="h-8 w-8 text-slate-400 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold text-white">
                ShopPro
              </span>
            </button>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-2">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'Youtube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-accent-500 transition-all duration-200 hover:scale-110 active:scale-95 group"
                >
                  <Icon className="h-4 w-4 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.quicklinks')}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/cart', label: 'Cart' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-400 hover:text-accent-400 transition-colors inline-flex items-center group">
                    {label}
                    <ArrowUpRight className="h-3 w-3 ml-0.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2.5">
              {[
                { slug: 'electronics', name: 'Electronics' },
                { slug: 'fashion', name: 'Fashion' },
                { slug: 'home-living', name: 'Home & Living' },
                { slug: 'sports', name: 'Sports' },
                { slug: 'books', name: 'Books' },
              ].map(({ slug, name }) => (
                <li key={slug}>
                  <Link to={`/products?category=${slug}`} className="text-sm text-slate-400 hover:text-accent-400 transition-colors inline-flex items-center group">
                    {name}
                    <ArrowUpRight className="h-3 w-3 ml-0.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">123 Commerce St, Cairo, Egypt</span>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Mail className="h-4 w-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:support@shoppro.com" className="text-slate-400 hover:text-accent-400 transition-colors">support@shoppro.com</a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Phone className="h-4 w-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+201234567890" className="text-slate-400 hover:text-accent-400 transition-colors">+20 123 456 7890</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ShopPro. {t('footer.rights')}
          </p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-slate-500">
            <a href="#" className="hover:text-slate-400 transition-colors">{t('footer.privacy')}</a>
            <span className="w-px h-3 bg-slate-700" />
            <a href="#" className="hover:text-slate-400 transition-colors">{t('footer.terms')}</a>
            <span className="w-px h-3 bg-slate-700" />
            <a href="#" className="hover:text-slate-400 transition-colors">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
