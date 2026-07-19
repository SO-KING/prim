import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, index, onClose }: Props) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent((i) => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-fade-in" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <X className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10">
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
            <ChevronRight className="h-10 w-10" />
          </button>
        </>
      )}

      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[current]}
          alt=""
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-scale-in"
          key={current}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}
