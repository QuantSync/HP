'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Heart, Sparkles, Lock } from 'lucide-react';

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
        router.push('/');
      } else {
        setShake(true);
        setError("That's not quite right, love ♥");
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
      {/* Floating orbs */}
      {[
        { size: 320, top: '5%', left: '-5%', color: 'rgba(236,72,153,0.15)', delay: 0 },
        { size: 240, top: '60%', right: '-8%', color: 'rgba(201,154,107,0.12)', delay: 1.5 },
        { size: 180, bottom: '10%', left: '15%', color: 'rgba(212,168,83,0.10)', delay: 0.8 },
        { size: 200, top: '20%', right: '10%', color: 'rgba(249,168,212,0.12)', delay: 2 },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none animate-float"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: (orb as { left?: string }).left,
            right: (orb as { right?: string }).right,
            bottom: (orb as { bottom?: string }).bottom,
            background: orb.color,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}

      {/* Sparkle particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-blush-300 pointer-events-none select-none"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 4) * 20}%`,
            fontSize: `${10 + (i % 3) * 6}px`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blush-500/5 to-champagne-400/5 pointer-events-none" />

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blush-500/30 to-champagne-400/20 flex items-center justify-center backdrop-blur-sm border border-blush-400/20">
                  <Heart className="w-7 h-7 text-blush-400" fill="currentColor" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-champagne-400 animate-twinkle" />
              </motion.div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold gradient-text mb-3">
                Welcome, Mum 💕
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                A little something made with love,<br />just for you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-blush-400/50 focus:bg-white/8 transition-all duration-200"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-blush-300 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="btn-primary w-full py-4 text-base relative disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Opening the door...
                  </span>
                ) : (
                  'Enter with Love ✨'
                )}
              </button>
            </form>

            {/* Footer hint */}
            <p className="text-center text-white/20 text-xs mt-6">
              Made with 💕 by Sweetu & Cutu
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
