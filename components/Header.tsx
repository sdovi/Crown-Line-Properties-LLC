'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { gsap } from 'gsap'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Небольшая задержка для обновления DOM
      const timer = setTimeout(() => {
        if (menuRef.current && overlayRef.current) {
          // Устанавливаем начальное состояние
          gsap.set(menuRef.current, { x: '-100%' })
          gsap.set(overlayRef.current, { opacity: 0 })
          
          // Анимация появления меню слева
          gsap.to(menuRef.current, {
            x: 0,
            duration: 0.4,
            ease: 'power3.out'
          })
          gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.3
          })
          document.body.style.overflow = 'hidden'
        }
      }, 10)

      return () => clearTimeout(timer)
    } else {
      // Анимация скрытия меню
      if (menuRef.current && overlayRef.current) {
        gsap.to(menuRef.current, {
          x: '-100%',
          duration: 0.3,
          ease: 'power3.in'
        })
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2
        })
        document.body.style.overflow = ''
      }
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/about', label: 'О компании' },
    { href: '/investors', label: 'Инвесторам' },
    { href: '/contacts', label: 'Контакты' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="CROWN LINE PROPERTY"
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-gold-500 font-serif text-xl font-bold leading-tight">
                CROWN LINE
              </div>
              <div className="text-gold-500 text-xs font-sans leading-tight">PROPERTY</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-gold-500 transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/contacts"
              className="bg-gold-500 text-dark px-6 py-2 rounded-lg font-semibold hover:bg-gold-400 transition-colors duration-300 flex items-center space-x-2"
            >
              <Phone size={18} />
              <span>Консультация</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-gold-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              ref={overlayRef}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ opacity: 0 }}
            />
            
            {/* Side Menu */}
            <div
              ref={menuRef}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:hidden"
              style={{
                background: 'linear-gradient(180deg, #020202 0%, #2b2f38 100%)',
                transform: 'translateX(-100%)',
              }}
            >
              <div className="flex flex-col h-full p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:text-gold-500 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col space-y-4 flex-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-white hover:text-gold-500 transition-colors py-3 text-lg font-bold border-b border-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Contact Button */}
                <Link
                  href="/contacts"
                  className="mt-auto bg-gold-500 text-dark px-6 py-4 rounded-lg font-bold text-center flex items-center justify-center space-x-2 hover:bg-gold-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone size={20} />
                  <span>Консультация</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}

