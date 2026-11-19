'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, ChevronDown, Camera, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import InfiniteSlideshow from '@/components/InfiniteSlideshow';
import BirthdayModalWidget from '@/components/BirthdayModalWidget';
import { siteConfig } from '@/config/site';
import type { Album, Photo } from '@/types/gallery';

interface HomeClientProps {
  allPhotos: Photo[];
  slideshowPhotos: Photo[];
  individualAlbums: Album[];
  combinationAlbums: Album[];
}

function AnimatedLetter({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const headline = 'For the best Mum in the world';

  return (
    <div ref={ref} className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 aurora-bg" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blush-500/10 via-transparent to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blush-500/8 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-champagne-400/6 blur-3xl animate-float-slow" />
      <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-rosegold-400/8 blur-3xl animate-float-fast" />

      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blush-300/60 select-none pointer-events-none"
          style={{ left: `${5 + i * 8}%`, top: `${10 + (i % 5) * 18}%`, fontSize: `${8 + (i % 3) * 4}px` }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        >✦</motion.div>
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-blush-300"
        >
          <Heart className="w-3.5 h-3.5" fill="currentColor" />
          <span>Happy Birthday, Mum! 🎂</span>
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>

        {/* Main headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {headline.split('').map((char, i) => (
            <AnimatedLetter key={i} char={char} delay={0.4 + i * 0.03} />
          ))}
        </h1>
        <div className="gradient-text font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold -mt-2 mb-8">✦</div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {siteConfig.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/birthday" className="btn-primary text-base">
            🎂 See Birthday Surprise
          </Link>
          <Link href="/gallery" className="glass rounded-full px-8 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium">
            View Gallery 📸
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function PersonCard({ album, caption }: { album: Album; caption: string }) {
  const coverPhoto = album.photos[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/album/${album.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-3xl aspect-[3/4]">
          <Image
            src={coverPhoto.src}
            alt={album.title}
            width={coverPhoto.width}
            height={coverPhoto.height}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={coverPhoto.blur}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-2xl font-bold text-white mb-1">{album.title}</h3>
            <p className="text-white/60 text-sm">{caption}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-blush-300 text-sm font-medium">
              <Camera className="w-3.5 h-3.5" />
              <span>{album.photos.length} photos</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function AlbumCard({ album }: { album: Album }) {
  const coverPhoto = album.photos[0];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/album/${album.slug}`} className="block group">
        <div className="glass rounded-2xl overflow-hidden hover:shadow-glow-rose transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={coverPhoto.src}
              alt={album.title}
              width={coverPhoto.width}
              height={coverPhoto.height}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={coverPhoto.blur}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-4">
            <h4 className="font-serif text-lg font-semibold text-white mb-1">{album.title}</h4>
            <p className="text-white/40 text-sm">{album.photos.length} photos</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomeClient({
  slideshowPhotos,
  individualAlbums,
  combinationAlbums,
}: HomeClientProps) {
  const personCaptions: Record<string, string> = {
    mum: siteConfig.people.mum.caption,
    sweetu: siteConfig.people.sweetu.caption,
    cutu: siteConfig.people.cutu.caption,
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <BirthdayModalWidget />

      {/* Hero */}
      <HeroSection />

      {/* Infinite slideshow */}
      {slideshowPhotos.length > 0 && (
        <section className="py-16 overflow-hidden">
          <InfiniteSlideshow photos={slideshowPhotos} height={280} speed={40} />
        </section>
      )}

      {/* Individual portraits section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blush-400 text-sm font-medium tracking-widest uppercase mb-3 block">The People We Love</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Faces of our <span className="gradient-text">world</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {individualAlbums.map((album) => (
            <PersonCard
              key={album.slug}
              album={album}
              caption={personCaptions[album.people[0]] ?? ''}
            />
          ))}
        </div>
      </section>

      {/* Combination albums */}
      {combinationAlbums.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-champagne-400 text-sm font-medium tracking-widest uppercase mb-3 block">Together</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Our <span className="gradient-text">moments</span> together
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {combinationAlbums.map((album) => (
              <AlbumCard key={album.slug} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* Birthday CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass rounded-3xl p-10 sm:p-14 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blush-500/10 to-champagne-400/5 pointer-events-none" />
          <div className="text-5xl mb-4 animate-bounce-soft">🎂</div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            It&apos;s your <span className="gradient-text">special day!</span>
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            We have a little birthday surprise waiting for you...
          </p>
          <Link href="/birthday" className="btn-primary text-lg px-10 py-4">
            See Your Surprise 🎉
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 text-white/40 text-sm"
        >
          <span>{siteConfig.footerMessage}</span>
        </motion.div>
      </footer>
    </main>
  );
}
