'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: 'rental-residential',
    title: 'Аренда жилой недвижимости',
    subtitle: 'Квартиры, Виллы, Таунхаусы',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
    href: '/catalog?type=rental&category=residential',
    count: 124,
  },
  {
    id: 'rental-commercial',
    title: 'Аренда коммерческой недвижимости',
    subtitle: 'Офисы, Торговые площади, Склады',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
    href: '/catalog?type=rental&category=commercial',
    count: 87,
  },
  {
    id: 'sale-residential',
    title: 'Продажа жилой недвижимости',
    subtitle: 'Новостройки, Вторичный рынок',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
    href: '/catalog?type=sale&category=residential',
    count: 156,
  },
  {
    id: 'sale-commercial',
    title: 'Продажа коммерческой недвижимости',
    subtitle: 'Офисы, Торговые центры, Промышленные объекты',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070',
    href: '/catalog?type=sale&category=commercial',
    count: 92,
  },
]

export default function PropertyCategories() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([])

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
  }, [])

  return (
    <section ref={sectionRef} className="luxury-spacing bg-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
            Категории недвижимости
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Выберите тип недвижимости, который вас интересует
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
                <div className="relative z-10">
                  <div className="text-gold-500 text-sm font-semibold mb-2">
                    {category.count} объектов
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-serif text-white mb-3 group-hover:text-gold-500 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-white/80 mb-6">{category.subtitle}</p>
                  <div className="flex items-center text-gold-500 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span>Подробнее</span>
                    <ArrowRight className="ml-2" size={20} />
                  </div>
                </div>
              </div>

              {/* Border on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 rounded-2xl transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

