'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Устанавливаем начальные стили
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 0, y: 50 })
    }
    if (buttonsRef.current) {
      const buttons = Array.from(buttonsRef.current.children) as HTMLElement[]
      buttons.forEach(btn => gsap.set(btn, { opacity: 0, y: 30 }))
    }

    const ctx = gsap.context(() => {
      // Анимация заголовка
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.out',
        })
      }

      // Анимация кнопок
      if (buttonsRef.current) {
        const buttons = Array.from(buttonsRef.current.children) as HTMLElement[]
        gsap.to(buttons, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
        })
      }
    }, contentRef)

    // Fallback: если через 2 секунды элементы не появились, делаем их видимыми
    const fallbackTimer = setTimeout(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 1, y: 0 })
      }
      if (buttonsRef.current) {
        const buttons = Array.from(buttonsRef.current.children) as HTMLElement[]
        buttons.forEach(btn => gsap.set(btn, { opacity: 1, y: 0 }))
      }
    }, 2000)

    return () => {
      ctx.revert()
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-dark">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/90" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-20 container mx-auto px-4 lg:px-8 text-center">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white mb-8 drop-shadow-2xl"
          style={{ opacity: 0, textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}
        >
          Эксклюзивный портфель
          <br />
          <span className="text-gold-500">предложений</span>
        </h1>
        <div 
          ref={buttonsRef} 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/catalog"
            className="bg-gold-500 text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-400 transition-all duration-300 flex items-center justify-center space-x-2 group glow-gold opacity-0 shadow-2xl"
          >
            <span>Недвижимости</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
          <Link
            href="/contacts"
            className="border-2 border-gold-500 text-gold-500 bg-dark/30 backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-500/20 transition-all duration-300 opacity-0 shadow-2xl"
          >
            Подробности по заявке
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold-500 rounded-full mt-2" />
        </div>
      </div>
    </section>
  )
}
