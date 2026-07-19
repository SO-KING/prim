import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Package, ChevronRight, Zap, ShieldCheck, Headphones, RotateCcw, Truck, Box, CreditCard, MessageCircle, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import type { Product, Category } from '../types';
import TiltCard from '../components/TiltCard';
import AnimatedSection from '../components/AnimatedSection';
import { useLang } from '../context/LanguageContext';
import WishlistButton from '../components/WishlistButton';

const brands = [
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
  { name: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg' },
  { name: 'Pepsi', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Pepsi_logo_2014.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
  { name: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg' },
  { name: 'Pepsi', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Pepsi_logo_2014.svg' },
];

function ProductCard({ product }: { product: Product }) {
  const images = JSON.parse(product.images || '[]');
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0;

  return (
    <TiltCard maxTilt={6} glare={true}>
      <Link to={`/products/${product.slug}`} className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700 img-zoom">
          {images[0] ? (
            <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400"><Package className="h-12 w-12" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">-{discount}% OFF</span>
          )}
          {product.featured === 1 && (
            <span className="absolute top-12 left-3 bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center">
              <Star className="h-3 w-3 mr-1 fill-white" /> Featured
            </span>
          )}
          <WishlistButton productId={product.id} className="absolute top-3 right-3" />
          <div className="absolute bottom-3 right-3 bg-slate-900/90 dark:bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <span className="text-sm font-bold text-white dark:text-slate-900">View Details</span>
          </div>
        </div>
        <div className="p-4" style={{ transform: 'translateZ(30px)' }}>
          <p className="text-xs text-accent-600 font-medium mb-1 uppercase tracking-wider">{product.category_name}</p>
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-accent-500 transition-colors line-clamp-1">{product.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-3 w-3 ${star <= Math.round(product.rating) ? 'text-accent-400 fill-accent-400' : 'text-slate-300 dark:text-slate-600'}`} />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">({product.reviews_count})</span>
          </div>
          <div className="flex items-center mt-2 space-x-2 rtl:space-x-reverse">
            <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-sm text-slate-400 line-through">${product.compare_price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

const featuresData = [
  {
    icon: Truck,
    titleKey: 'feature.shipping',
    descKey: 'feature.shipping_desc',
    gradient: 'from-slate-700 to-slate-900 dark:from-slate-300 dark:to-white',
    bgLight: 'bg-slate-100 dark:bg-slate-700',
    iconColor: 'text-slate-800 dark:text-white',
    border: 'border-slate-300 dark:border-slate-600',
    shape: 'rounded-xl',
    bgPattern: 'bg-[radial-gradient(circle_at_top_right,_transparent_0%,_#e2e8f0_100%)] dark:bg-[radial-gradient(circle_at_top_right,_transparent_0%,_#1e293b_100%)]',
  },
  {
    icon: ShieldCheck,
    titleKey: 'feature.payment',
    descKey: 'feature.payment_desc',
    gradient: 'from-emerald-500 to-emerald-700',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-300 dark:border-emerald-700',
    shape: 'rounded-3xl',
    bgPattern: 'bg-[conic-gradient(at_bottom_left,_#ecfdf5_0deg,_#d1fae5_360deg)] dark:bg-[conic-gradient(at_bottom_left,_#064e3b_0deg,_#022c22_360deg)]',
  },
  {
    icon: Headphones,
    titleKey: 'feature.support',
    descKey: 'feature.support_desc',
    gradient: 'from-violet-500 to-purple-700',
    bgLight: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-300 dark:border-violet-700',
    shape: 'rounded-[18px]',
    bgPattern: 'bg-[radial-gradient(ellipse_at_center,_#f5f3ff_0%,_#ede9fe_100%)] dark:bg-[radial-gradient(ellipse_at_center,_#3b0764_0%,_#1e1b4b_100%)]',
  },
  {
    icon: RotateCcw,
    titleKey: 'feature.returns',
    descKey: 'feature.returns_desc',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-300 dark:border-amber-700',
    shape: 'rounded-[8px]',
    bgPattern: 'bg-[radial-gradient(circle_at_bottom_right,_#fffbeb_0%,_#fef3c7_100%)] dark:bg-[radial-gradient(circle_at_bottom_right,_#78350f_0%,_#451a03_100%)]',
  },
];

export default function Home() {
  const { locale, dir, t } = useLang();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getFeaturedProducts(),
      api.getCategories(),
    ]).then(([productsData, categoriesData]) => {
      setFeatured(productsData.products);
      setCategories(categoriesData.categories);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div dir={dir}>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 dark:bg-slate-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-accent-500/20 to-amber-500/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-gradient-to-r from-slate-600/20 to-transparent rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-20 right-1/3 w-32 h-32 border border-white/10 rounded-full animate-spin-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-accent-500/20 rounded-full animate-float" style={{ animationDuration: '7s' }} />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white mb-6 group hover:bg-white/10 transition-all">
                  <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                  <span className="text-sm font-medium">{t('hero.badge')}</span>
                  <Star className="h-3 w-3 text-accent-400 fill-accent-400 group-hover:rotate-180 transition-transform duration-500" />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <h1 className="relative text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
                  <span className="text-white">{t('hero.title1')}</span><br />
                  <span className="bg-gradient-to-r from-accent-400 via-amber-400 to-accent-300 bg-clip-text text-transparent bg-[length:200%] animate-gradient">{t('hero.title2')}</span><br />
                  <span className="text-white/90">{t('hero.title3')}</span>
                  <span className="absolute -top-6 -right-6 text-6xl text-accent-500/20 select-none pointer-events-none animate-float-slow">✦</span>
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <p className="text-lg md:text-xl text-white/50 mb-8 leading-relaxed max-w-lg">
                  {t('hero.desc')}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="flex flex-wrap gap-4">
                  <Link to="/products" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-amber-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-amber-700 transition-all duration-300 shadow-2xl shadow-accent-500/25 hover:shadow-accent-500/40 active:scale-[0.98] overflow-hidden">
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative">{t('hero.cta')}</span>
                    <ArrowRight className={`relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Link>
                  <Link to="/about" className="relative inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 active:scale-[0.98] overflow-hidden group">
                    <span className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative">{t('hero.learn')}</span>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={400}>
                <div className="flex items-center gap-6 rtl:space-x-reverse mt-10">
                  {[
                    { icon: Star, num: '10K+', label: t('hero.customers') },
                    { icon: Package, num: '500+', label: 'Products' },
                    { icon: ShieldCheck, num: '99%', label: 'Satisfaction' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {i > 0 && <div className="w-px h-8 bg-white/10" />}
                      <div className="h-10 w-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-accent-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{item.num}</p>
                        <p className="text-white/50 text-xs">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection direction={dir === 'rtl' ? 'left' : 'right'} delay={200} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-accent-500/20 via-transparent to-white/5 rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800" alt="Shopping" className="w-full h-full object-cover aspect-[4/3]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-6 -left-6 rtl:left-auto rtl:-right-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl animate-float border border-slate-200 dark:border-slate-700" style={{ animationDuration: '5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-500 to-amber-600 flex items-center justify-center shadow-lg">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free Shipping</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Orders $200+</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 rtl:right-auto rtl:-left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl animate-float border border-slate-200 dark:border-slate-700" style={{ animationDelay: '1.5s', animationDuration: '6s' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Secure</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">100% Protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-slate-900 via-white/50 dark:via-slate-900/50 to-transparent" />
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative -mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {featuresData.map((feature, i) => (
            <AnimatedSection key={feature.titleKey} delay={i * 100}>
              <div className={`relative bg-white dark:bg-slate-800 ${feature.shape} p-6 shadow-xl border ${feature.border} hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden ${feature.bgPattern}`}>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 rounded-full blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className={`relative h-14 w-14 flex-shrink-0 ${feature.shape} bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${i % 2 === 0 ? 'rotate-3 group-hover:rotate-6' : '-rotate-3 group-hover:-rotate-6'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.shape}`} />
                    <div className={`absolute inset-0 ${feature.shape} ring-1 ring-inset ring-black/5 dark:ring-white/10`} />
                    <feature.icon className={`h-6 w-6 ${feature.iconColor} relative z-10 group-hover:text-white transition-colors duration-500`} />
                  </div>
                  <div className="pt-1">
                    <div className={`h-1 w-8 rounded-full mb-2 bg-gradient-to-r ${feature.gradient}`} />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t(feature.titleKey)}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t(feature.descKey)}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection className={`flex items-center justify-between mb-10 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div>
            <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">Categories</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1">{t('categories.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('categories.subtitle')}</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-accent-500 dark:hover:text-accent-400 group">
            {t('categories.viewall')} <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'mr-1 rotate-180' : 'ml-1'}`} />
          </Link>
        </AnimatedSection>

        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.id} delay={i * 80}>
              <TiltCard maxTilt={8} glare={true} perspective={800}>
                <Link to={`/products?category=${cat.slug}`}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden block">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="w-full h-full">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                        onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none'; t.parentElement!.querySelector('.cat-fallback')?.classList.remove('hidden'); }} />
                      <div className="cat-fallback hidden w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center absolute inset-0">
                        <Package className="h-8 w-8 text-slate-400 group-hover:scale-125 transition-transform duration-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-semibold text-sm md:text-base text-white">{cat.name}</h3>
                      <p className="text-xs text-white/70 mt-0.5">{cat.products_count} {t('items')}</p>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>

        <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {categories.concat(categories).map((cat, i) => (
            <Link key={`${cat.id}-${i}`} to={`/products?category=${cat.slug}`}
              className="flex-shrink-0 w-40 snap-center group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                    <Package className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{cat.name}</h3>
                <p className="text-xs text-slate-500">{cat.products_count} {t('items')}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className={`flex items-center justify-between mb-10 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div>
              <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">{t('featured.subtitle')}</span>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1">{t('featured.title')}</h2>
            </div>
            <Link to="/products?featured=true" className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-accent-500 hover:text-accent-500 transition-all shadow-sm group">
              {t('categories.viewall')} <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="aspect-square shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 rounded w-1/3 shimmer" />
                    <div className="h-4 rounded w-2/3 shimmer" />
                    <div className="h-4 rounded w-1/4 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-fade">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <AnimatedSection className="text-center mb-10">
          <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">{t('brands.title')}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">{t('brands.subtitle')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Global brands that trust our platform</p>
        </AnimatedSection>

        <div className="relative overflow-hidden py-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-white dark:before:from-slate-900 before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-white dark:after:from-slate-900 after:to-transparent after:z-10">
          <div className="flex gap-16 rtl:space-x-reverse animate-marquee items-center">
            {brands.map((brand, i) => (
              <div key={i} className="flex-shrink-0 h-20 w-44 flex items-center justify-center group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100" />
                <div className="relative px-6 py-4 rounded-2xl border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all duration-500">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-10 max-w-full object-contain opacity-25 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    style={{ filter: 'brightness(0) invert(0.6) grayscale(1)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection>
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-black rounded-3xl p-8 md:p-16 text-white overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border border-white/10 rounded-full animate-spin-slow" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-500/20 text-accent-300 mb-4 border border-accent-500/30">
                  ✦ {t('cta.title')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title')}</h2>
                <p className="text-white/60 mb-8 max-w-md leading-relaxed">
                  {t('cta.desc')}
                </p>
                <Link to="/register"
                  className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-amber-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-amber-700 transition-all duration-300 shadow-2xl shadow-accent-500/25 active:scale-[0.98] overflow-hidden group">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative">{t('cta.button')}</span>
                  <ArrowRight className={`relative h-5 w-5 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform duration-300`} />
                </Link>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {[
                  { icon: Truck, text: t('cta.free') },
                  { icon: Star, text: t('cta.prices') },
                  { icon: Headphones, text: t('cta.support') },
                  { icon: RefreshCw, text: t('cta.returns') },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5 text-accent-400" />
                    </div>
                    <p className="text-sm font-medium text-white/80">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
