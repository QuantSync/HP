'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import type { Album, Photo } from '@/types/gallery';

interface GalleryClientProps {
  albums: Album[];
}

type FilterKey = 'all' | string;

export default function GalleryClient({ albums }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Build filter chips
  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All ✨' },
    ...albums.map((a) => ({ key: a.slug, label: a.title })),
  ];

  const displayPhotos = useMemo<Photo[]>(() => {
    if (activeFilter === 'all') {
      return albums.flatMap((a) => a.photos);
    }
    const album = albums.find((a) => a.slug === activeFilter);
    return album?.photos ?? [];
  }, [activeFilter, albums]);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Page hero */}
      <section className="pt-8 pb-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-50" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blush-400 text-sm font-medium tracking-widest uppercase block mb-3">Our Gallery</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              Every <span className="gradient-text">memory</span> matters
            </h1>
            <p className="text-white/50 leading-relaxed">
              {albums.reduce((s, a) => s + a.photos.length, 0)} photos across {albums.length} albums
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="px-4 pb-6 max-w-7xl mx-auto">
        <div className="flex gap-2 flex-wrap justify-center">
          {filters.map((f, i) => (
            <motion.button
              key={f.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? 'bg-gradient-to-r from-blush-500 to-rosegold-400 text-white shadow-glow-rose'
                  : 'glass text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section className="px-3 sm:px-4 pb-20 max-w-7xl mx-auto">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MasonryGrid photos={displayPhotos} priority />
        </motion.div>
      </section>
    </main>
  );
}
