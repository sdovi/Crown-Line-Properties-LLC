'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let ctx: gsap.Context | null = null

    // Небольшая задержка для обеспечения загрузки DOM
    const timer = setTimeout(() => {
      // Устанавливаем начальные стили для плавной анимации
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 50 })
      }
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      }
      if (buttonsRef.current) {
        const buttons = Array.from(buttonsRef.current.children) as HTMLElement[]
        buttons.forEach(btn => {
          gsap.set(btn, { opacity: 0, y: 30 })
        })
      }

      ctx = gsap.context(() => {
        // Анимация заголовка
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
          })
        }
        
        // Анимация подзаголовка
        if (subtitleRef.current) {
          gsap.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out',
          })
        }
        
        // Анимация кнопок
        if (buttonsRef.current && buttonsRef.current.children.length > 0) {
          const buttons = Array.from(buttonsRef.current.children) as HTMLElement[]
          gsap.to(buttons, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            onComplete: () => {
              setIsLoaded(true)
            }
          })
        } else {
          setIsLoaded(true)
        }
      }, heroRef)
    }, 100)

    // Фолбэк: если через 2 секунды кнопки не появились, делаем их видимыми
    const fallbackTimer = setTimeout(() => {
      if (buttonsRef.current && buttonsRef.current.children.length > 0) {
        const buttons = Array.from(buttonsRef.current.children) as HTMLElement[]
        buttons.forEach(btn => {
          gsap.set(btn, { opacity: 1, y: 0 })
        })
        setIsLoaded(true)
      }
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
      if (ctx) {
        ctx.revert()
      }
    }
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
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-gold-500 mb-6"
          style={{ opacity: 0 }}
        >
          Элитная недвижимость
          <br />
          <span className="text-white">Дубая</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-3xl mx-auto font-bold"
          style={{ opacity: 0 }}
        >
          Откройте для себя мир премиального образа жизни
        </p>
        <div 
          ref={buttonsRef} 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ visibility: 'visible', opacity: 1 }}
        >
          <Link
            href="/catalog"
            className="bg-gold-500 text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-400 transition-all duration-300 flex items-center justify-center space-x-2 group glow-gold"
          >
            <span>Исследовать объекты</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contacts"
            className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-500/10 transition-all duration-300"
          >
            Получить
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

