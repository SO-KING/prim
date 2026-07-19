import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Package, Check, Minus, Plus, Truck, Shield, RefreshCw, Maximize2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../App';
import type { Product, Review } from '../types';
import ImageLightbox from '../components/ImageLightbox';
import WishlistButton from '../components/WishlistButton';

export default function ProductDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (slug) {
      setLoading(true);
      api.getProduct(slug)
        .then((data) => {
          setProduct(data.product);
          setReviews(data.reviews);
          setRelated(data.related);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      toast.success('Added to cart!');
      setTimeout(() => setAddingToCart(false), 1200);
    } catch {
      toast.error('Please sign in first');
      setAddingToCart(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      const data = await api.addReview({ product_id: product.id, rating: reviewRating, comment: reviewComment });
      setReviews([data.review, ...reviews]);
      setReviewComment('');
      toast.success('Review submitted!');
    } catch {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product not found</h2>
        <Link to="/products" className="text-accent-600 hover:text-accent-700 mt-2 inline-block">Back to products</Link>
      </div>
    );
  }

  const images = JSON.parse(product.images || '[]');
  const specifications = JSON.parse(product.specifications || '{}');
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-accent-500">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-accent-500">Products</Link>
        <span>/</span>
        {product.category_name && (
          <>
            <Link to={`/products?category=${product.category_slug}`} className="hover:text-accent-500">{product.category_name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 group cursor-pointer" onClick={() => images[selectedImage] && setLightboxOpen(true)}>
            {images[selectedImage] ? (
              <>
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-3 backdrop-blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full"><Package className="h-24 w-24 text-slate-300" /></div>
            )}
          </div>
          {lightboxOpen && images[selectedImage] && (
            <ImageLightbox images={images} index={selectedImage} onClose={() => setLightboxOpen(false)} />
          )}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-accent-500' : 'border-transparent hover:border-slate-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-accent-600 font-medium mb-1">{product.category_name}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <WishlistButton productId={product.id} />
              {product.featured === 1 && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-semibold rounded-lg">Featured</span>
              )}
            </div>
          </div>

          <div className="flex items-center mt-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
              ))}
            </div>
            <span className="text-sm text-slate-500 ml-2">{product.rating} ({product.reviews_count} reviews)</span>
          </div>

          <div className="flex items-baseline space-x-3 mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <>
                <span className="text-xl text-slate-400 line-through">${product.compare_price.toFixed(2)}</span>
                <span className="text-sm font-semibold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">-{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="flex items-center text-green-600"><Check className="h-4 w-4 mr-1" /> In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Minus className="h-4 w-4" /></button>
              <span className="px-4 font-medium text-slate-900 dark:text-white min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                addingToCart
                  ? 'bg-green-500 text-white shadow-green-500/25 scale-105'
                  : 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-accent-500/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addingToCart ? (
                <><Check className="h-5 w-5 mr-2 animate-bounce-in" /> Added!</>
              ) : (
                <><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Truck className="h-5 w-5 text-accent-500" />
              <span className="text-sm font-medium">Free shipping over $200</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Shield className="h-5 w-5 text-accent-500" />
              <span className="text-sm font-medium">Secure checkout</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <RefreshCw className="h-5 w-5 text-accent-500" />
              <span className="text-sm font-medium">30-day returns</span>
            </div>
          </div>

          {/* Specifications */}
          {Object.keys(specifications).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Specifications</h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl divide-y divide-slate-200 dark:divide-slate-700">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-slate-500">{key}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-sm font-medium text-accent-600">
                        {review.user_name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{review.user_name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  {review.comment && <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>}
                </div>
              ))
            )}
          </div>

          {user && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-fit">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Write a Review</h3>
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)}>
                        <Star className={`h-6 w-6 cursor-pointer transition-colors ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Comment</label>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:ring-2 focus:ring-accent-500 outline-none resize-none" placeholder="Share your thoughts..." />
                </div>
                <button type="submit" className="w-full px-4 py-2.5 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all text-sm shadow-lg hover:shadow-accent-500/25">
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => {
              const imgs = JSON.parse(p.images || '[]');
              return (
                <Link key={p.id} to={`/products/${p.slug}`} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {imgs[0] ? <img src={imgs[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full"><Package className="h-8 w-8 text-slate-300" /></div>}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${p.price.toFixed(2)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
