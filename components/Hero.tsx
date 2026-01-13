'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      })
      gsap.from(buttonsRef.current?.children || [], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
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
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-gold-500 mb-6"
        >
          Элитная недвижимость
          <br />
          <span className="text-white">Дубая</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-3xl mx-auto"
        >
          Откройте для себя мир премиального образа жизни
        </p>
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="bg-gold-500 text-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-400 transition-all duration-300 flex items-center justify-center space-x-2 group glow-gold"
          >
            <span>Исследовать объекты</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contacts"
            className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-500/10 transition-all duration-300"
          >
            Получить консультацию
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

