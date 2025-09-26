'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D component to avoid SSR issues
const Hero3D = dynamic(() => import('@/components/hero/Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
  ),
});

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
        {/* 3D Background */}
        <Hero3D />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] z-10" />

        <div className="relative z-20 text-center px-6">
          {/* Main Title */}
          <motion.h1
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-6xl md:text-8xl lg:text-9xl font-thin tracking-[0.3em] text-white">
              DAEHYEON
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-2"
          >
            <p className="text-gray-300 tracking-[0.2em] text-sm uppercase">
              Product Management
            </p>
            {mounted && time && (
              <p className="text-gray-400 text-xs font-mono mt-4">
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
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="w-5 h-5 text-gray-300" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-thin">
              About
            </h2>
          </motion.div>

          {/* Profile & Info Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 md:gap-16 mb-20 pl-0 md:pl-12"
          >
            {/* Profile Image - with subtle effects */}
            <motion.div 
              className="flex-shrink-0 relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <Image
                src="/profile.jpeg"
                alt="Daehyeon Kim"
                width={200}
                height={200}
                className="rounded-xl relative z-10"
                priority
              />
            </motion.div>
            
            {/* Info List - Vertical with highlights */}
            <div className="flex-grow">
              <div className="space-y-4">
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">Name</span>
                  <span className="text-gray-700 text-sm">Daehyeon Kim</span>
                </div>
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">University</span>
                  <span className="text-gray-700 text-sm">Kyung Hee University</span>
                </div>
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">Major</span>
                  <span className="text-gray-700 text-sm">Industrial & Management Systems Engineering</span>
                </div>
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">Lab</span>
                  <span className="text-gray-700 text-sm">UXC Lab, Software Convergence</span>
                </div>
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">Born</span>
                  <span className="text-gray-700 text-sm">April 11, 2002</span>
                </div>
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">Location</span>
                  <span className="text-gray-700 text-sm">Yongin, South Korea</span>
                </div>
                <div className="flex group">
                  <span className="text-gray-400 text-sm w-24 transition-colors group-hover:text-gray-600">Email</span>
                  <a href="mailto:ahfxh@khu.ac.kr" className="text-gray-700 text-sm hover:text-black transition-all relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all">
                    ahfxh@khu.ac.kr
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24 pl-0 md:pl-12"
          >
            <h3 className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-6 font-medium flex items-center gap-3">
              <span className="block w-8 h-[1px] bg-gradient-to-r from-gray-300 to-transparent"></span>
              Introduction
            </h3>
            <p className="text-gray-600 leading-relaxed text-base max-w-4xl">
              Currently pursuing undergraduate studies at the Department of Industrial & Management Systems Engineering, Kyung Hee University.
              Aiming to become a <span className="text-gray-900 font-medium">generalist capable of leading projects</span>, I am broadly studying various fields including
              planning, UX, UI, HCI, development, optimization, artificial intelligence, machine learning,
              data analysis, technology management, and marketing to become a <span className="text-gray-900 font-medium">Full-Stack PM</span>.
            </p>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="pl-0 md:pl-12"
          >
            <h3 className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-8 font-medium flex items-center gap-3">
              <span className="block w-8 h-[1px] bg-gradient-to-r from-gray-300 to-transparent"></span>
              Skills & Learning
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, items], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      category === 'Data' ? 'bg-blue-400' :
                      category === 'Development' ? 'bg-green-400' :
                      'bg-purple-400'
                    }`}></span>
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: categoryIndex * 0.1 + index * 0.03 + 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`px-4 py-2 bg-white border rounded-lg text-sm text-gray-700 transition-all ${
                          category === 'Data' ? 'border-gray-200 hover:border-blue-200 hover:shadow-blue-50 hover:shadow-md' :
                          category === 'Development' ? 'border-gray-200 hover:border-green-200 hover:shadow-green-50 hover:shadow-md' :
                          'border-gray-200 hover:border-purple-200 hover:shadow-purple-50 hover:shadow-md'
                        }`}
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