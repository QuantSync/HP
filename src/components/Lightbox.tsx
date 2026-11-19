'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { Photo } from '@/types/gallery';

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, onClose]);

  // Focus trap
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && dy < 80) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const photo = photos[current];
  const prevPhoto = photos[(current - 1 + photos.length) % photos.length];
  const nextPhoto = photos[(current + 1) % photos.length];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 glass rounded-full px-4 py-1.5 text-sm text-white/70">
        {current + 1} / {photos.length}
      </div>

      {/* Prev button */}
      {photos.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          className="absolute left-4 z-10 p-3 rounded-full glass hover:bg-white/10 transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Next button */}
      {photos.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          className="absolute right-4 z-10 p-3 rounded-full glass hover:bg-white/10 transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center px-16 py-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center"
          >
            <div className="relative" style={{ maxWidth: '90vw', maxHeight: '80vh' }}>
              <Image
                src={photo.src}
                alt={`Photo ${current + 1}`}
                width={photo.width}
                height={photo.height}
                className="rounded-2xl object-contain max-h-[80vh] shadow-2xl"
                placeholder="blur"
                blurDataURL={photo.blur}
                priority
                style={{ maxWidth: '90vw', height: 'auto' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Preload adjacent images */}
      <div className="sr-only" aria-hidden="true">
        <Image src={prevPhoto.src} alt="" width={prevPhoto.width} height={prevPhoto.height} />
        <Image src={nextPhoto.src} alt="" width={nextPhoto.width} height={nextPhoto.height} />
      </div>

      {/* Dot indicators */}
      {photos.length > 1 && photos.length <= 20 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === current ? 'w-4 bg-blush-400' : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
