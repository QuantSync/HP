'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Photo } from '@/types/gallery';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
  priority?: boolean;
}

export default function PhotoCard({ photo, index, onClick, priority = false }: PhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-4 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`View photo ${index + 1}`}
    >
      <Image
        src={photo.src}
        alt={`Memory ${index + 1}`}
        width={photo.width}
        height={photo.height}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        placeholder="blur"
        blurDataURL={photo.blur}
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-blush-400/30 transition-all duration-300 shadow-none group-hover:shadow-glow-rose" />
    </motion.div>
  );
}
