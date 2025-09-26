'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Smooth spring animation
  const springConfig = { damping: 15, stiffness: 100 };
  const y1Spring = useSpring(y1, springConfig);
  const y2Spring = useSpring(y2, springConfig);

  // Mount check and real-time clock
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const skills = {
    "Data": ["Python", "R", "Pandas", "PyTorch", "Scikit-learn"],
    "Development": ["JavaScript", "TypeScript", "C++", "React", "MongoDB", "Node.js", "NestJS"],
    "Design": ["Figma", "Adobe Illustrator"]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #000 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #000 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #000 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <div className="relative z-10 text-center px-6">
          {/* Main Title with stagger animation */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {['D', 'A', 'E', 'H', 'Y', 'E', 'O', 'N', ' ', 'K', 'I', 'M'].map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block text-6xl md:text-8xl lg:text-9xl font-thin tracking-widest"
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -90 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.6, 0.01, 0.05, 0.95],
                    },
                  },
                }}
                whileHover={{
                  scale: 1.2,
                  color: '#666',
                  transition: { duration: 0.2 },
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{ y: y1Spring }}
            className="space-y-2"
          >
            <p className="text-gray-500 tracking-[0.2em] text-sm">
              Department of Industrial & Management Systems Engineering
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Kyung Hee University
            </p>
            {mounted && time && (
              <p className="text-gray-300 text-xs font-mono mt-4">
                {formatTime(time)} KST
              </p>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ opacity }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="min-h-screen flex items-center px-6 lg:px-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ y: y2Spring }}
          >
            <h2 className="text-4xl lg:text-5xl font-thin mb-8">
              About
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Currently pursuing undergraduate studies at the Department of Industrial & Management Systems Engineering, Kyung Hee University.
              Aiming to become a generalist capable of leading projects, I am broadly studying various fields including
              planning, UX, UI, HCI, development, optimization, artificial intelligence, machine learning,
              data analysis, technology management, and marketing to become a Full-Stack PM.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex">
                <span className="text-gray-400 w-24">Born</span>
                <span className="text-gray-600">April 11, 2002</span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">University</span>
                <span className="text-gray-600">Kyung Hee University, South Korea</span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">Major</span>
                <span className="text-gray-600">Department of Industrial & Management Systems Engineering</span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">Lab</span>
                <span className="text-gray-600">UXC Lab, Department of Software Convergence</span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">Email</span>
                <a href="mailto:ahfxh@khu.ac.kr" className="text-gray-600 hover:text-black transition-colors">
                  ahfxh@khu.ac.kr
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6">
              Skills & Learning
            </h3>
            <div className="space-y-6">
              {Object.entries(skills).map(([category, items], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: categoryIndex * 0.2 + index * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700 transition-all"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-thin mb-8">
            Let&apos;s Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.a
              href="https://github.com/daehyeonxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
            <motion.a
              href="mailto:daehyeon.xyz@gmail.com"
              className="group flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Email</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/portfolio"
                className="group flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                <span>View Portfolio</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}