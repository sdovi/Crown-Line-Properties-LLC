'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                src="/logo.jpg"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gold-500/20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-white hover:text-gold-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contacts"
              className="block mt-4 bg-gold-500 text-dark px-6 py-3 rounded-lg font-semibold text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Консультация
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

