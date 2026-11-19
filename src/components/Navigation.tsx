'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Camera, Image, Cake, LogOut, Heart } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/birthday', label: 'Birthday 🎂', icon: Cake },
  { href: '/gallery', label: 'Gallery', icon: Image },
  { href: '/album', label: 'Albums', icon: Camera },
];

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  }, [router]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Heart className="w-5 h-5 text-blush-400 group-hover:scale-125 transition-transform" fill="currentColor" />
              <span className="font-serif text-lg gradient-text font-semibold tracking-wide">
                For Mum
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? 'bg-blush-500/20 text-blush-300 shadow-glow-rose'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop logout + Mobile hamburger */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={closeDrawer}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 glass-dark border-r border-white/10 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blush-400" fill="currentColor" />
                  <span className="font-serif text-lg gradient-text font-semibold">For Mum</span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 p-4 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={href}
                      onClick={closeDrawer}
                      className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-medium transition-all duration-200 ${
                        isActive(href)
                          ? 'bg-blush-500/20 text-blush-300'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
