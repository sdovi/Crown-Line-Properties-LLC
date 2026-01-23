'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { gsap } from 'gsap'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Устанавливаем начальное состояние меню
  useEffect(() => {
    if (menuRef.current) {
      const isMobile = window.innerWidth < 1024
      if (isMobile) {
        gsap.set(menuRef.current, { x: '-100%' })
      } else {
        gsap.set(menuRef.current, { opacity: 0, y: -10, x: 0 })
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && overlayRef.current) {
        const isMobile = window.innerWidth < 1024
        if (!isMobile) {
          // На десктопе закрываем меню при клике вне его
          const target = event.target as Node
          if (menuRef.current && !menuRef.current.contains(target)) {
            setIsMenuOpen(false)
          }
        }
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (logoRef.current) {
      if (isScrolled) {
        // Плавное появление логотипа при скролле
        gsap.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        })
      } else {
        // Плавное скрытие логотипа при возврате наверх
        gsap.to(logoRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
        })
      }
    }
  }, [isScrolled])

  useEffect(() => {
    if (isMenuOpen) {
      // Небольшая задержка для обновления DOM
      const timer = setTimeout(() => {
        if (menuRef.current && overlayRef.current) {
          const isMobile = window.innerWidth < 1024
          
          if (isMobile) {
            // Мобильная версия: меню слева
            gsap.set(menuRef.current, { x: '-100%', clearProps: 'opacity,y' })
            gsap.set(overlayRef.current, { opacity: 0 })
            
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
          } else {
            // Десктоп версия: выпадающее меню справа
            gsap.set(menuRef.current, { opacity: 0, y: -10, x: 0, clearProps: '' })
            gsap.set(overlayRef.current, { opacity: 0 })
            
            gsap.to(menuRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power3.out'
            })
          }
        }
      }, 10)

      return () => clearTimeout(timer)
    } else {
      // Анимация скрытия меню
      if (menuRef.current && overlayRef.current) {
        const isMobile = window.innerWidth < 1024
        
        if (isMobile) {
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
        } else {
          gsap.to(menuRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power3.in'
          })
        }
      }
    }
  }, [isMenuOpen])

  const navItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Коллекция' },
    { href: '/investors', label: 'Инвестиции' },
    { href: '/contacts', label: 'Контакты' },
    { href: '/catalog?type=exclusives', label: 'Эксклюзив' },
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
        <div className="relative flex items-center justify-between h-20">
          {/* Empty left side for balance */}
          <div className="flex-1"></div>

          {/* Center Logo - появляется при скролле */}
          <Link 
            href="/" 
            className="absolute left-1/2 flex items-center justify-center" 
            style={{ transform: 'translate(-50%, 0.5px)' }}
          >
            <div 
              ref={logoRef}
              className="relative h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 flex-shrink-0"
              style={{ opacity: 0, transform: 'scale(0.8)' }}
            >
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
          </Link>

          {/* Right Menu Button - Visible on all screens */}
          <div className="flex-1 flex justify-end">
            <button
              className="text-white hover:text-gold-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Overlay - Works on all screens */}
        {isMenuOpen && (
          <>
            {/* Overlay - только на мобильных */}
            <div
              ref={overlayRef}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsMenuOpen(false)}
              style={{ opacity: 0 }}
            />
            
            {/* Side Menu - Mobile / Dropdown - Desktop */}
            <div
              ref={menuRef}
              className="lg:absolute lg:top-full lg:right-0 lg:mt-2 lg:w-80 lg:max-w-none lg:h-auto fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:rounded-lg lg:shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, #020202 0%, #2b2f38 100%)',
              }}
            >
              <div className="flex flex-col h-full lg:h-auto p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-gold-500 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col space-y-4 flex-1 lg:flex-none">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-white hover:text-gold-500 transition-colors py-3 text-lg font-bold border-b border-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Contact Button */}
                <Link
                  href="/contacts"
                  className="mt-auto lg:mt-4 bg-gold-500 text-dark px-6 py-4 rounded-lg font-bold text-center flex items-center justify-center space-x-2 hover:bg-gold-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone size={20} />
                  <span>Связаться</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}

