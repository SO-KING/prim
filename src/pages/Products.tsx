import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, Package, SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { api } from '../lib/api';
import type { Product, Category, Pagination } from '../types';
import TiltCard from '../components/TiltCard';
import AnimatedSection from '../components/AnimatedSection';
import { useLang } from '../context/LanguageContext';
import WishlistButton from '../components/WishlistButton';

function ProductCard({ product, index }: { product: Product; index: number }) {
  const images = JSON.parse(product.images || '[]');
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0;

  return (
    <AnimatedSection delay={index * 60}>
      <TiltCard maxTilt={6} glare={true}>
        <Link to={`/products/${product.slug}`} className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700 img-zoom">
            {images[0] ? (
              <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400"><Package className="h-12 w-12" /></div>
            )}
            {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">-{discount}%</span>}
            <WishlistButton productId={product.id} className="absolute top-3 right-3" />
            <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-sm font-bold text-accent-500">View</span>
            </div>
          </div>
          <div className="p-4" style={{ transform: 'translateZ(30px)' }}>
            <p className="text-xs text-accent-600 font-medium mb-1">{product.category_name}</p>
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-accent-500 transition-colors line-clamp-1">{product.name}</h3>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-3 w-3 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                ))}
              </div>
              <span className="text-xs text-slate-500 ml-1.5">({product.reviews_count})</span>
            </div>
            <div className="flex items-center mt-2 space-x-2 rtl:space-x-reverse">
              <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.compare_price && <span className="text-sm text-slate-400 line-through">${product.compare_price.toFixed(2)}</span>}
            </div>
          </div>
        </Link>
      </TiltCard>
    </AnimatedSection>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, dir } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentFeatured = searchParams.get('featured') || '';

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const params: Record<string, string> = { page: String(currentPage) };
    if (currentCategory) params.category = currentCategory;
    if (currentSearch) params.search = currentSearch;
    if (currentSort) params.sort = currentSort;
    if (currentFeatured) params.featured = currentFeatured;

    api.getProducts(params)
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [currentCategory, currentSearch, currentSort, currentPage, currentFeatured]);

  const updateParams = (key: string, value: string) => {
    if (key === 'page' && value === '1') value = '';
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const pageTitle = currentSearch
    ? `"${currentSearch}"`
    : currentCategory
      ? categories.find(c => c.slug === currentCategory)?.name || 'Products'
      : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={dir}>
      {/* Hero Header */}
      <AnimatedSection className="mb-8 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-black p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '1s' }} />
          <div className="relative">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white/80 mb-3">
              <Package className="h-3 w-3 mr-1" /> {pagination.total} {t('items')}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{pageTitle}</h1>
            <p className="text-white/60 max-w-xl">
              {currentSearch
                ? `Search results for "${currentSearch}"`
                : 'Discover our curated collection of premium products'}
            </p>
            {currentSearch && (
              <button onClick={() => updateParams('search', '')} className="mt-3 inline-flex items-center text-sm text-accent-400 hover:text-accent-300 transition-colors">
                <X className="h-3 w-3 mr-1" /> Clear search
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse flex-wrap gap-2">
          <button onClick={() => updateParams('category', '')} className={`px-4 py-1.5 text-sm rounded-xl font-medium transition-all ${!currentCategory ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => updateParams('category', cat.slug)} className={`px-4 py-1.5 text-sm rounded-xl font-medium transition-all ${currentCategory === cat.slug ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              {cat.name}
            </button>
          ))}
        </div>
        <select
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 focus:ring-2 focus:ring-accent-500 outline-none shadow-sm"
        >
          <option value="">Sort: Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="flex gap-8">
        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-2xl animate-slide-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Categories</p>
                <div className="space-y-1">
                  <button onClick={() => { updateParams('category', ''); setShowFilters(false); }} className={`block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors ${!currentCategory ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => { updateParams('category', cat.slug); setShowFilters(false); }} className={`block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors ${currentCategory === cat.slug ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1" ref={gridRef}>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              <button onClick={() => { setSearchParams({}); }} className="mt-4 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 stagger-fade">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mt-10">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => updateParams('page', String(page))}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === currentPage ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30 scale-110' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
