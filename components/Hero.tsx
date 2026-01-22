'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Устанавливаем начальные стили
    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 })
    }
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 30 })
    }
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { opacity: 0, y: 30 })
    }

    const ctx = gsap.context(() => {
      // Анимация логотипа
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.out',
        })
      }

      // Анимация теглайна
      if (taglineRef.current) {
        gsap.to(taglineRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.8,
          ease: 'power3.out',
        })
      }

      // Анимация кнопки
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 1.1,
          ease: 'power3.out',
        })
      }
    }, contentRef)

    // Fallback: если через 2 секунды элементы не появились, делаем их видимыми
    const fallbackTimer = setTimeout(() => {
      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 1, scale: 1 })
      }
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 1, y: 0 })
      }
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { opacity: 1, y: 0 })
      }
    }, 2000)

    return () => {
      ctx.revert()
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-dark">

      {/* Content */}
      <div ref={contentRef} className="relative z-20 container mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
        {/* Logo */}
        <div 
          ref={logoRef}
          className="relative mb-8"
          style={{ opacity: 0 }}
        >
          <div className="relative h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="CROWN LINE PROPERTY"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-white font-serif text-lg md:text-xl lg:text-2xl tracking-widest mb-12 uppercase"
          style={{ opacity: 0 }}
        >
          REAL ESTATE OF DISTINCTION
        </p>

        {/* Button */}
        <div ref={buttonRef} style={{ opacity: 0 }}>
          <Link
            href="/contacts"
            className="inline-block border border-gold-500/50 bg-dark/40 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-serif text-sm md:text-base lg:text-lg tracking-widest uppercase hover:bg-gold-500/10 hover:border-gold-500 transition-all duration-300"
          >
            PRIVATE INQUIRY
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
