'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, Settings } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' }
  ];

  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-2 h-2 bg-black rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 500,
          mass: 0.1
        }}
      />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-md bg-white/80 border-b border-gray-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="relative group">
              <motion.div
                className="text-lg font-light tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                DAEHYEON
                <motion.div
                  className="absolute -bottom-1 left-0 h-[1px] bg-black"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </motion.div>
            </Link>

            {/* Menu Items */}
            <div className="flex items-center gap-8">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative"
                  >
                    <motion.span
                      className={`text-sm tracking-wide transition-colors ${
                        isActive 
                          ? 'text-black font-medium' 
                          : 'text-gray-500 hover:text-black'
                      }`}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                    
                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-2 left-0 right-0 h-[1px] bg-black"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}

              {/* Admin Link */}
              {session?.user?.isAdmin && (
                <Link href="/admin" className="relative">
                  <motion.span
                    className={`text-sm tracking-wide transition-colors flex items-center gap-1 ${
                      pathname.startsWith('/admin')
                        ? 'text-black font-medium' 
                        : 'text-gray-500 hover:text-black'
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings size={16} />
                    Admin
                  </motion.span>
                  
                  <AnimatePresence>
                    {pathname.startsWith('/admin') && (
                      <motion.div
                        className="absolute -bottom-2 left-0 right-0 h-[1px] bg-black"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* Auth Button */}
              <div className="ml-4">
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : session ? (
                  <motion.button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={16} />
                    Logout
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => signIn('github')}
                    className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogIn size={16} />
                    Login
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}