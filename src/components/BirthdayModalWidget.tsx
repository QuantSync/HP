'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Sparkles, Heart, Crown, X, ArrowRight } from 'lucide-react';

async function fireBirthdayConfetti() {
  const { default: confetti } = await import('canvas-confetti');
  const colors = ['#f9a8d4', '#ec4899', '#c99a6b', '#d4a853', '#fbcfe8', '#fce7f3'];
  confetti({
    particleCount: 100,
    spread: 75,
    origin: { y: 0.5 },
    colors,
    disableForReducedMotion: true,
  });
}

export default function BirthdayModalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user just logged in or has ?welcome=true or hasn't seen the widget yet in this session
    const hasSeen = sessionStorage.getItem('mum_birthday_widget_seen');
    const isWelcome = new URLSearchParams(window.location.search).get('welcome') === 'true';
    const justLoggedIn = sessionStorage.getItem('just_logged_in') === 'true';

    if (isWelcome || justLoggedIn || !hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        fireBirthdayConfetti();
        sessionStorage.setItem('mum_birthday_widget_seen', 'true');
        sessionStorage.removeItem('just_logged_in');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
    fireBirthdayConfetti();
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasInteracted(true);
  };

  return (
    <>
      {/* Floating Mini Celebration Widget Button (always available at bottom-right) */}
      <motion.button
        onClick={handleOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full glass border border-blush-400/40 bg-midnight/80 shadow-glow-rose backdrop-blur-xl group cursor-pointer"
        aria-label="Mum's Birthday Widget"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-champagne-400 shadow-sm relative">
            <Image
              src="/gallery/mum-1.webp"
              alt="Mum"
              fill
              className="object-cover object-top"
            />
          </div>
          <span className="absolute -top-1.5 -right-1.5 text-xs">👑</span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[11px] font-semibold text-champagne-400 uppercase tracking-wider flex items-center gap-1">
            <span>Special Day</span>
            <Sparkles className="w-2.5 h-2.5 text-champagne-400 animate-twinkle" />
          </p>
          <p className="text-xs font-serif text-white font-medium">Mum&apos;s Birthday 🎂</p>
        </div>
      </motion.button>

      {/* Main Full Celebration Modal Widget */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-blush-400/30 shadow-2xl shadow-rose-950/50 z-10 overflow-hidden"
            >
              {/* Decorative Glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blush-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-champagne-400/20 blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Close Birthday Wish"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Crown & Mum's Portrait with Celebratory Ring */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative mb-5"
                >
                  {/* Floating Crown */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-gradient-to-r from-champagne-400 via-rosegold-400 to-blush-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-glow-gold">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Birthday Queen</span>
                  </div>

                  {/* Ornate Photo Frame */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-tr from-blush-500 via-rosegold-400 to-champagne-400 shadow-glow-rose">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image
                        src="/gallery/mum-1.webp"
                        alt="Mum"
                        fill
                        priority
                        className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Floating heart sticker */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-blush-500 to-pink-600 flex items-center justify-center text-white border-2 border-midnight shadow-md">
                    <Heart className="w-4 h-4 fill-current text-white" />
                  </div>
                </motion.div>

                {/* Celebratory Title */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-champagne-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HAPPY BIRTHDAY, MUM!</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold gradient-text mb-3">
                  Today is All About You, Mum! 🌸
                </h2>

                <p className="text-white/80 text-sm leading-relaxed mb-6 font-serif italic max-w-md">
                  &ldquo;To the world you may be one person, but to us you are the whole world. Thank you for your endless love, your gentle guidance, and your beautiful laughter that lights up our lives every day.&rdquo;
                </p>

                <p className="text-blush-300 text-xs font-medium mb-6 flex items-center justify-center gap-1">
                  <span>With all our love — Sweetu &amp; Cutu 💕</span>
                </p>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    href="/birthday"
                    onClick={handleClose}
                    className="btn-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-glow-rose"
                  >
                    <Cake className="w-4 h-4" />
                    <span>Open Birthday Surprise</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleClose}
                    className="glass px-5 py-3 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all font-medium"
                  >
                    Explore Gallery 📸
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
