'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Photo } from '@/types/gallery';

interface InfiniteSlideshowProps {
  photos: Photo[];
  height?: number;
  speed?: number;
}

export default function InfiniteSlideshow({
  photos,
  height = 320,
  speed = 35,
}: InfiniteSlideshowProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate photos for seamless loop
  const displayPhotos = [...photos, ...photos, ...photos];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let animId: number;
    let position = 0;
    const totalWidth = track.scrollWidth / 3; // one third is one set

    const animate = () => {
      position += speed / 60; // pixels per frame at 60fps
      if (position >= totalWidth) {
        position -= totalWidth;
      }
      track.style.transform = `translateX(-${position}px)`;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Pause on hover/touch
    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(animate); };

    track.parentElement?.addEventListener('mouseenter', pause);
    track.parentElement?.addEventListener('mouseleave', resume);
    track.parentElement?.addEventListener('touchstart', pause, { passive: true });
    track.parentElement?.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(animId);
      track.parentElement?.removeEventListener('mouseenter', pause);
      track.parentElement?.removeEventListener('mouseleave', resume);
      track.parentElement?.removeEventListener('touchstart', pause);
      track.parentElement?.removeEventListener('touchend', resume);
    };
  }, [speed]);

  if (photos.length === 0) return null;

  return (
    <div className="overflow-hidden relative" style={{ height }}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-midnight to-transparent pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-midnight to-transparent pointer-events-none" />

      <div
        ref={trackRef}
        className="flex gap-3 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {displayPhotos.map((photo, i) => {
          const aspectRatio = photo.width / photo.height;
          const w = Math.round(height * aspectRatio);
          return (
            <div
              key={`${photo.src}-${i}`}
              className="relative flex-shrink-0 overflow-hidden rounded-2xl"
              style={{ width: w, height }}
            >
              <Image
                src={photo.src}
                alt={`Slideshow photo ${(i % photos.length) + 1}`}
                width={photo.width}
                height={photo.height}
                className="object-cover w-full h-full"
                placeholder="blur"
                blurDataURL={photo.blur}
                priority={i < 6}
                sizes={`${w}px`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
