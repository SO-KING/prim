import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import { useWishlistStore } from '../store/wishlistStore';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: 'sm' | 'md';
}

export default function WishlistButton({ productId, className = '', size = 'md' }: WishlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist, fetchWishlist } = useWishlistStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    setWishlisted(isWishlisted(productId));
  }, [productId, isWishlisted(productId)]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAnimating(true);
      const nowWishlisted = await toggleWishlist(productId);
      setWishlisted(nowWishlisted);
      toast.success(nowWishlisted ? 'Added to wishlist!' : 'Removed from wishlist');
      setTimeout(() => setAnimating(false), 300);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ${
        animating ? 'scale-125' : ''
      } ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${sizeClass} transition-all duration-200 ${
          wishlisted
            ? 'fill-red-500 text-red-500'
            : 'text-slate-400 hover:text-red-400'
        }`}
      />
    </button>
  );
}
