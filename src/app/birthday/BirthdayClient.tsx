'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Heart, Gift } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { siteConfig } from '@/config/site';
import type { Photo } from '@/types/gallery';

// Canvas confetti loaded lazily
async function fireConfetti() {
  const { default: confetti } = await import('canvas-confetti');
  const colors = ['#f9a8d4', '#ec4899', '#c99a6b', '#d4a853', '#fbcfe8', '#fce7f3'];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors, disableForReducedMotion: true });
  setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.2 }, colors, disableForReducedMotion: true }), 300);
  setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.8 }, colors, disableForReducedMotion: true }), 500);
}

function Balloon({ color, delay, left }: { color: string; delay: number; left: string }) {
  return (
    <motion.div
      className="absolute bottom-0 select-none pointer-events-none"
      style={{ left }}
      initial={{ y: '110%', opacity: 0 }}
      animate={{ y: '-110vh', opacity: [0, 1, 1, 0] }}
      transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="text-5xl animate-sway"
        style={{ animationDuration: `${3 + Math.random() * 2}s`, color }}
      >
        🎈
      </div>
    </motion.div>
  );
}

function FloatingHeart({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute bottom-0 text-2xl select-none pointer-events-none"
      style={{ left }}
      initial={{ y: '110%', opacity: 0 }}
      animate={{ y: '-110vh', opacity: [0, 1, 1, 0] }}
      transition={{ duration: 6 + Math.random() * 3, delay, repeat: Infinity }}
    >
      💕
    </motion.div>
  );
}

function InteractiveCake({ onBlow }: { onBlow: () => void }) {
  const [lit, setLit] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const [showWish, setShowWish] = useState(false);

  const blowCandle = useCallback((i: number) => {
    if (!lit[i]) return;
    const newLit = [...lit];
    newLit[i] = false;
    setLit(newLit);
    if (newLit.every((l) => !l)) {
      setAllBlown(true);
      setShowWish(true);
      fireConfetti();
      setTimeout(() => fireConfetti(), 1200);
    }
  }, [lit]);

  const reset = () => {
    setLit([true, true, true, true, true]);
    setAllBlown(false);
    setShowWish(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Cake SVG with interactive candles */}
      <div className="relative select-none">
        {/* Candles row */}
        <div className="flex gap-4 justify-center mb-2">
          {lit.map((isLit, i) => (
            <button
              key={i}
              onClick={() => blowCandle(i)}
              className="flex flex-col items-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label={isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} blown out`}
              title={isLit ? 'Tap to blow out!' : 'Blown out ✓'}
            >
              {/* Flame */}
              <AnimatePresence>
                {isLit && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 0.9, 1], opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ scale: { duration: 0.8, repeat: Infinity } }}
                    className="text-xl mb-0.5"
                  >
                    🔥
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLit && <div className="w-5 h-5 mb-0.5 opacity-30">💨</div>}
              {/* Candle body */}
              <div
                className="w-3 h-10 rounded-sm transition-opacity duration-300"
                style={{
                  background: ['#f9a8d4', '#c99a6b', '#d4a853', '#a78bfa', '#60a5fa'][i],
                  opacity: isLit ? 1 : 0.4,
                }}
              />
            </button>
          ))}
        </div>

        {/* Cake body */}
        <div className="text-8xl sm:text-9xl text-center leading-none">🎂</div>
      </div>

      {!allBlown && (
        <p className="text-white/50 text-sm mt-4 text-center">
          Tap each candle to blow it out! 🕯️
        </p>
      )}

      {/* Make a Wish overlay */}
      <AnimatePresence>
        {showWish && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowWish(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              className="glass rounded-3xl p-10 max-w-sm text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="font-serif text-3xl font-bold gradient-text mb-4">Make a Wish!</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Close your eyes, hold your wish in your heart... and know that we love you more than you&apos;ll ever know. 💕
              </p>
              <button onClick={() => { setShowWish(false); reset(); }} className="btn-primary">
                Thank you, my loves ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypewriterMessage({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, 28);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className="text-white/80 text-base sm:text-lg leading-relaxed font-serif italic max-w-2xl mx-auto text-center">
      &ldquo;{displayed}
      {!done && <span className="animate-pulse">|</span>}&rdquo;
    </p>
  );
}

interface BirthdayClientProps {
  mumPhotos?: Photo[];
  collagePhotos: Photo[];
}

export default function BirthdayClient({ mumPhotos = [], collagePhotos }: BirthdayClientProps) {
  const hasConfettiFired = useRef(false);
  const [selectedMumPhotoIndex, setSelectedMumPhotoIndex] = useState(0);

  useEffect(() => {
    if (!hasConfettiFired.current) {
      hasConfettiFired.current = true;
      const timer = setTimeout(() => fireConfetti(), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const headline = 'Happy Birthday, Mum!';

  // Default mum photo fallback if none passed
  const activeMumPhoto =
    mumPhotos.length > 0
      ? mumPhotos[selectedMumPhotoIndex % mumPhotos.length]
      : collagePhotos[0] || {
          src: '/gallery/mum-1.webp',
          width: 900,
          height: 1600,
          blur: '',
        };

  const whyCards = [
    { emoji: '🌸', text: 'Your smile makes every room brighter' },
    { emoji: '🤗', text: 'Your hugs feel like coming home' },
    { emoji: '💪', text: 'Your strength inspires us every day' },
    { emoji: '🍳', text: 'Your cooking is the taste of love' },
    { emoji: '📖', text: 'Your wisdom guides our every step' },
    { emoji: '✨', text: 'Your love makes us who we are' },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navigation />

      {/* Aurora background */}
      <div className="fixed inset-0 aurora-bg -z-10" />
      <div className="fixed inset-0 bg-gradient-radial from-blush-500/8 via-transparent to-transparent -z-10" />

      {/* Floating balloons */}
      <Balloon color="#f9a8d4" delay={0} left="8%" />
      <Balloon color="#c99a6b" delay={2} left="22%" />
      <Balloon color="#d4a853" delay={4} left="75%" />
      <Balloon color="#f472b6" delay={1} left="88%" />
      <FloatingHeart delay={0.5} left="15%" />
      <FloatingHeart delay={3} left="85%" />
      <FloatingHeart delay={6} left="50%" />

      {/* Hero headline */}
      <section className="pt-10 pb-6 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-6xl sm:text-7xl mb-4 inline-block animate-bounce-soft"
        >
          🎂
        </motion.div>

        <h1 className="font-serif font-bold text-shadow-glow overflow-hidden">
          {headline.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl ${char === ' ' ? 'mr-3' : ''}`}
              style={{ color: i % 3 === 0 ? '#f9a8d4' : i % 3 === 1 ? '#c99a6b' : '#d4a853' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-champagne-400 font-medium text-sm sm:text-base mt-4 tracking-wider"
        >
          ✨ Today, 19 November — A celebration of the most extraordinary Mum ✨
        </motion.p>
      </section>

      {/* MUM'S PHOTO SPOTLIGHT SECTION */}
      <section className="py-8 px-4 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass rounded-3xl p-6 sm:p-10 border border-blush-400/30 shadow-2xl shadow-rose-950/60 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blush-500/10 via-transparent to-champagne-400/10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative z-10">
            {/* Mum's Photo in Royal Frame */}
            <div className="relative flex-shrink-0">
              {/* Crown badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-gradient-to-r from-champagne-400 via-rosegold-400 to-blush-400 text-black text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full shadow-glow-gold">
                <Crown className="w-3.5 h-3.5" />
                <span>Birthday Queen</span>
              </div>

              {/* Glowing Photo Card */}
              <div
                onClick={fireConfetti}
                className="w-56 sm:w-64 md:w-72 aspect-[3/4] rounded-2xl p-2 bg-gradient-to-tr from-blush-500 via-rosegold-400 to-champagne-400 shadow-glow-rose cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                title="Tap for celebration confetti! 🎉"
              >
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <Image
                    src={activeMumPhoto.src}
                    alt="Mum's Birthday Portrait"
                    fill
                    priority
                    placeholder={activeMumPhoto.blur ? 'blur' : 'empty'}
                    blurDataURL={activeMumPhoto.blur || undefined}
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <span className="text-xs text-white/90 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-champagne-400" /> Tap for Confetti
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-photo switcher if Mum has multiple portraits */}
              {mumPhotos.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {mumPhotos.map((photo, idx) => (
                    <button
                      key={photo.src}
                      onClick={() => setSelectedMumPhotoIndex(idx)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        selectedMumPhotoIndex === idx
                          ? 'border-blush-400 scale-110 shadow-glow-rose'
                          : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <Image
                        src={photo.src}
                        alt={`Mum thumbnail ${idx + 1}`}
                        fill
                        className="object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Touching Dedication Copy */}
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-blush-300 mb-3">
                <Heart className="w-3.5 h-3.5 text-blush-400 fill-current" />
                <span>The Center of Our Universe</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
                To Our Dearest <span className="gradient-text">Mum</span> 🌸
              </h2>

              <p className="text-white/80 leading-relaxed text-sm sm:text-base font-serif italic mb-5">
                &ldquo;You are the grace that holds us together, the warmth that makes every house a home, and the purest kind of love we have ever known.&rdquo;
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-champagne-400">✨</span>
                  <span>Sweetu &amp; Cutu dedicate this special day to you</span>
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-blush-400">💖</span>
                  <span>May your year ahead be as radiant as your heart</span>
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                <button
                  onClick={fireConfetti}
                  className="btn-primary text-xs sm:text-sm py-2 px-5 flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Shower Love &amp; Confetti 🎉</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Birthday message typewriter */}
      <section className="py-8 px-4 max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blush-500/5 to-champagne-400/5 pointer-events-none" />
          <div className="text-3xl text-center mb-6">💌</div>
          <TypewriterMessage text={siteConfig.birthdayMessage} />
        </motion.div>
      </section>

      {/* Interactive cake */}
      <section className="py-10 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2 gradient-text">
            Blow Out Your Candles! 🕯️
          </h2>
          <p className="text-white/40 text-sm mb-8">Tap each flame to blow it out</p>
          <InteractiveCake onBlow={fireConfetti} />
        </motion.div>
      </section>

      {/* Photo collage */}
      {collagePhotos.length > 0 && (
        <section className="py-16 px-4 max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold gradient-text">
              Our favourite moments with you 📸
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {collagePhotos.slice(0, 9).map((photo, i) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                className={`relative overflow-hidden rounded-2xl ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <Image
                  src={photo.src}
                  alt={`Memory ${i + 1}`}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-full object-cover aspect-square"
                  placeholder={photo.blur ? 'blur' : 'empty'}
                  blurDataURL={photo.blur || undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Why you're our everything cards */}
      <section className="py-16 px-4 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Why you&apos;re our <span className="gradient-text">everything</span> 💕
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-6 text-center hover:shadow-glow-rose transition-all duration-300"
            >
              <div className="text-4xl mb-3">{card.emoji}</div>
              <p className="text-white/80 text-sm leading-relaxed font-serif italic">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final love note */}
      <section className="py-16 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="text-5xl mb-4 animate-pulse-soft">💕</div>
          <p className="font-serif text-2xl sm:text-3xl gradient-text font-bold">
            We love you to infinity and beyond.
          </p>
          <p className="text-white/40 text-sm mt-4">— Sweetu &amp; Cutu 🌸</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-white/5 relative z-10">
        <p className="text-white/30 text-sm">{siteConfig.footerMessage}</p>
      </footer>
    </main>
  );
}
