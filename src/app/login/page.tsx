'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Heart, Sparkles, Lock, Crown } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Mark that user just logged in so the birthday celebration widget pops up!
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('just_logged_in', 'true');
        }
        router.push('/?welcome=true');
      } else {
        setShake(true);
        setError("That&apos;s not quite right, love ♥ (Password: MUM193746)");
        setPassword('');
        setTimeout(() => setShake(false), 600);
        inputRef.current?.focus();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, password, router]);

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-5 w-72 h-72 rounded-full bg-blush-500/15 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-10 right-5 w-80 h-80 rounded-full bg-champagne-400/12 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/2 right-1/4 w-60 h-60 rounded-full bg-rosegold-400/10 blur-3xl pointer-events-none animate-float-fast" />

      {/* Floating sparkles */}
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-blush-300 pointer-events-none select-none"
          style={{
            left: `${8 + i * 10}%`,
            top: `${12 + (i % 5) * 18}%`,
            fontSize: `${10 + (i % 3) * 6}px`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 2.2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.35,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative overflow-hidden border border-white/10">
            {/* Soft inner gradient accent */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blush-500/8 via-transparent to-champagne-400/6 pointer-events-none" />

            {/* Mum's Avatar & Birthday Crown */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                {/* Crown badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-gradient-to-r from-champagne-400 via-rosegold-400 to-blush-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-black shadow-glow-gold">
                  <Crown className="w-3 h-3" />
                  <span>Birthday Queen</span>
                </div>

                {/* Avatar with glowing ring */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-blush-400 via-rosegold-400 to-champagne-400 shadow-glow-rose">
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

                {/* Little heart badge */}
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blush-500 flex items-center justify-center text-white border-2 border-midnight shadow-md">
                  <Heart className="w-4 h-4 fill-current text-white" />
                </div>
              </motion.div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center mb-7">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold gradient-text mb-2">
                Welcome, Mum 💕
              </h1>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                A private gallery of love & memories, made just for you by Sweetu & Cutu.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret password (MUM193746)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-blush-400/60 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error notification */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-blush-300 text-xs sm:text-sm text-center font-medium"
                  >
                    That&apos;s not quite right, love ♥ (Try: MUM193746)
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="btn-primary w-full py-3.5 text-base relative disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Unlocking memories...</span>
                  </>
                ) : (
                  <>
                    <span>Enter with Love ✨</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Friendly hint */}
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-white/40 text-xs flex items-center justify-center gap-1.5">
                <span>Password hint:</span>
                <span className="font-mono text-champagne-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  MUM193746
                </span>
              </p>
              <p className="text-white/30 text-xs mt-2">
                Today is your birthday, Mum! 🎂 19 November
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
