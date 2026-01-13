'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MapPin, Bed, Square } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const properties = [
  {
    id: 1,
    title: 'Пентхаус с видом на Burj Khalifa',
    location: 'Downtown Dubai',
    price: 'AED 15,000,000',
    area: '450 м²',
    bedrooms: 4,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
    type: 'sale',
  },
  {
    id: 2,
    title: 'Вилла на Palm Jumeirah',
    location: 'Palm Jumeirah',
    price: 'AED 25,000/мес',
    area: '800 м²',
    bedrooms: 6,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
    type: 'rental',
  },
  {
    id: 3,
    title: 'Апартаменты в Dubai Marina',
    location: 'Dubai Marina',
    price: 'AED 8,500,000',
    area: '180 м²',
    bedrooms: 2,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2027',
    type: 'sale',
  },
  {
    id: 4,
    title: 'Офис в Business Bay',
    location: 'Business Bay',
    price: 'AED 120,000/мес',
    area: '500 м²',
    bedrooms: 0,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
    type: 'rental',
  },
  {
    id: 5,
    title: 'Таунхаус в Arabian Ranches',
    location: 'Arabian Ranches',
    price: 'AED 4,200,000',
    area: '320 м²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
    type: 'sale',
  },
  {
    id: 6,
    title: 'Пентхаус в Jumeirah',
    location: 'Jumeirah',
    price: 'AED 18,000/мес',
    area: '280 м²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070',
    type: 'rental',
  },
]

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sale' | 'rental'>('all')
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([])

  const filteredProperties =
    activeFilter === 'all'
      ? properties
      : properties.filter((p) => p.type === activeFilter)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
              once: true,
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
          })
        }
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger && sectionRef.current?.contains(trigger.vars.trigger as Element)) {
          trigger.kill()
        }
      })
    }
  }, [filteredProperties])

  return (
    <section ref={sectionRef} className="luxury-spacing bg-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
            Рекомендуемые объекты
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Премиальная недвижимость в лучших районах Дубая
          </p>

          {/* Filters */}
          <div className="flex justify-center gap-4">
            {(['all', 'sale', 'rental'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gold-500 text-dark'
                    : 'bg-dark-lighter text-white hover:bg-dark-light'
                }`}
              >
                {filter === 'all'
                  ? 'Все'
                  : filter === 'sale'
                  ? 'Продажа'
                  : 'Аренда'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <Link
              key={property.id}
              href={`/property/${property.id}`}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="group bg-dark-lighter rounded-2xl overflow-hidden hover:bg-dark-light transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${property.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      property.type === 'sale'
                        ? 'bg-gold-500 text-dark'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    {property.type === 'sale' ? 'Продажа' : 'Аренда'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold-500 transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center text-white/60 text-sm mb-4">
                  <MapPin size={16} className="mr-1" />
                  {property.location}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-serif text-gold-500">
                    {property.price}
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="flex items-center text-white/70">
                      <Bed size={18} className="mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-white/60 text-sm">
                  <Square size={16} className="mr-1" />
                  {property.area}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/catalog"
            className="inline-flex items-center text-gold-500 font-semibold text-lg hover:text-gold-400 transition-colors"
          >
            Смотреть все объекты
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

