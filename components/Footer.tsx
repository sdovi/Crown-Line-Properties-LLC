'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-gold-500/20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-gold-500 font-serif text-2xl font-bold mb-2">
              CROWN LINE
            </div>
            <div className="text-gold-500 text-sm mb-4">PROPERTY</div>
            <p className="text-white/60 text-sm mb-4">
              Real Estate of Distinction
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/60 hover:text-gold-500 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-white/60 hover:text-gold-500 transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 hover:text-gold-500 transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-white/60 hover:text-gold-500 transition-colors">
                  Инвесторам
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-white/60 hover:text-gold-500 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?type=rental" className="text-white/60 hover:text-gold-500 transition-colors">
                  Аренда
                </Link>
              </li>
              <li>
                <Link href="/catalog?type=sale" className="text-white/60 hover:text-gold-500 transition-colors">
                  Продажа
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-white/60 hover:text-gold-500 transition-colors">
                  Инвестиции
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 hover:text-gold-500 transition-colors">
                  Консультации
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-gold-500 mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="text-white/60 text-sm">
                  Dubai, UAE
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-gold-500 mr-2 flex-shrink-0" size={18} />
                <a
                  href="tel:+971501234567"
                  className="text-white/60 hover:text-gold-500 transition-colors text-sm"
                >
                  +971 50 123 45 67
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-gold-500 mr-2 flex-shrink-0" size={18} />
                <a
                  href="mailto:info@crownlineproperty.com"
                  className="text-white/60 hover:text-gold-500 transition-colors text-sm"
                >
                  info@crownlineproperty.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-500/20 pt-8 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} CROWN LINE PROPERTY. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

