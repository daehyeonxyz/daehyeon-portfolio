'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  
  const words = ['개발자', '문제 해결사', '창의적인 코더']

  useEffect(() => {
    const handleType = () => {
      const current = loopNum % words.length
      const fullText = words[current]

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 30 : 150)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed, words])

  return (
    <section className="h-screen flex flex-col justify-center items-center relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="z-10 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          안녕하세요! 👋
        </h1>
        <div className="text-xl md:text-2xl mb-4 text-white">
          저는 <span className="text-blue-400 font-bold">대현</span>입니다
        </div>
        <div className="text-2xl md:text-3xl h-12 text-white">
          <span className="text-blue-400">{text}</span>
          <span className="animate-pulse">|</span>
        </div>
        <div className="mt-12 flex gap-4 justify-center">
          <Link 
            href="/portfolio" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-all transform hover:scale-105 text-white font-medium"
          >
            포트폴리오 보기
          </Link>
          <Link 
            href="/contact" 
            className="px-8 py-3 border-2 border-white/30 hover:border-white/60 rounded-full transition-all text-white font-medium"
          >
            연락하기
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 animate-bounce">
        <ChevronDown size={32} className="text-white" />
      </div>
    </section>
  )
}
