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

  const skills = [
    "Python", "Machine Learning", "Optimization", "Data Analysis",
    "React", "Next.js", "PHP", "MySQL",
    "Figma", "UX Research", "Project Management", "Branding"
  ];

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
            {['D', 'A', 'E', 'H', 'Y', 'E', 'O', 'N'].map((letter, index) => (
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
            <p className="text-gray-500 tracking-[0.3em] text-sm uppercase">
              Full-Stack PM & Consultant
            </p>
            <p className="text-gray-400 text-xs">
              Industrial & Management Systems Engineering
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
              작은 기업들의 조력자가 되고자 하는 비전을 가진 학생입니다.
              원석 같은 기업과 프로젝트를 찾아 브랜딩과 컨설팅으로
              온전한 형태를 갖추게 하는 것을 목표로 합니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              프로젝트를 처음부터 끝까지 책임질 수 있는 Full-stack PM이 되기 위해
              인공지능, 개발, 최적화, 기획, 디자인 등의 역량을 균형 있게 쌓고 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              경희대학교 산업경영공학과 3학년 재학 중이며,
              데이터 기반 의사결정과 체계적 연구 방법론을 학습하고 있습니다.
            </p>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6">
              Skills & Tools
            </h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <motion.div
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-gray-700">{skill}</span>
                    <motion.div
                      className="w-2 h-2 bg-black rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    />
                  </motion.div>
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
            Let's Connect
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