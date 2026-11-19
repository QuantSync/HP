'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import type { Photo } from '@/types/gallery';

interface MasonryGridProps {
  photos: Photo[];
  priority?: boolean;
}

export default function MasonryGrid({ photos, priority = false }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-white/40">
        <p className="text-lg">No photos here yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
        {photos.map((photo, i) => (
          <PhotoCard
            key={photo.src}
            photo={photo}
            index={i}
            onClick={() => setLightboxIndex(i)}
            priority={priority && i < 4}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
