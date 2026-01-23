'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ArrowRight, ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const mainCategories = [
  {
    id: 'exclusives',
    title: 'Эксклюзив',
    subtitle: 'Закрытая коллекция объектов\n(доступ по индивидуальному запросу)',
    image: '/photo_2026-01-23_09-41-33.jpg',
    href: '/catalog?type=exclusives',
    count: 45,
  },
  {
    id: 'land',
    title: 'Земельные участки',
    subtitle: 'Инвестиционные земельные активы\n(под застройку и развитие)',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2059',
    href: '/catalog?type=land',
    count: 67,
  },
  {
    id: 'off-plan',
    title: 'На стадии застройки',
    subtitle: 'Проекты на этапе девелопмента\n(off-plan residences)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
    href: '/catalog?type=off-plan',
    count: 89,
  },
  {
    id: 'sale-residential',
    title: 'Готовая жилая недвижимость',
    subtitle: 'Завершённые жилые резиденции\n(готовые к заселению объекты)',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
    href: '/catalog?type=sale&category=residential',
    count: 156,
  },
]

const additionalCategories = [
  {
    id: 'sale-commercial',
    title: 'Коммерческая недвижимость',
    subtitle: 'Коммерческие активы\n(retail · offices · mixed-use)',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070',
    href: '/catalog?type=sale&category=commercial',
    count: 92,
  },
  {
    id: 'rental-residential',
    title: 'Аренда жилой недвижимости',
    subtitle: 'Аренда частных резиденций\n(long & short term)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
    href: '/catalog?type=rental&category=residential',
    count: 124,
  },
  {
    id: 'rental-commercial',
    title: 'Аренда коммерции',
    subtitle: 'Аренда коммерческих пространств\n(premium business locations)',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
    href: '/catalog?type=rental&category=commercial',
    count: 87,
  },
]

export default function PropertyCategories() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const additionalCardsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const [showMore, setShowMore] = useState(false)
  const additionalContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (showMore && additionalContainerRef.current) {
      const cards = additionalCardsRef.current.filter(Boolean)
      if (cards.length === 0) return

      const ctx = gsap.context(() => {
        cards.forEach((card, index) => {
          if (card) {
            gsap.from(card, {
              opacity: 0,
              y: 50,
              duration: 0.8,
              delay: index * 0.1,
              ease: 'power3.out',
            })
          }
        })
      }, additionalContainerRef)

      return () => {
        ctx.revert()
      }
    }
  }, [showMore])

  return (
    <section ref={sectionRef} className="luxury-spacing bg-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
            Категории недвижимости
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {mainCategories.map((category, index) => (
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
                  <h3 className="text-3xl lg:text-4xl font-serif text-white mb-3 group-hover:text-gold-500 transition-colors">
                    {category.title}
                  </h3>
                  {category.subtitle && <p className="text-white/80 mb-6 whitespace-pre-line">{category.subtitle}</p>}
                  <div className="flex items-center text-gold-500 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>

              {/* Border on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 rounded-2xl transition-colors duration-300" />
            </Link>
          ))}
        </div>

        {/* Additional Categories - Hidden by default */}
        {showMore && (
          <div ref={additionalContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-8 lg:mt-12">
            {additionalCategories.map((category, index) => (
              <Link
                key={category.id}
                href={category.href}
                ref={(el) => {
                  if (el) additionalCardsRef.current[index] = el
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
                    <h3 className="text-3xl lg:text-4xl font-serif text-white mb-3 group-hover:text-gold-500 transition-colors">
                      {category.title}
                    </h3>
                    {category.subtitle && <p className="text-white/80 mb-6 whitespace-pre-line">{category.subtitle}</p>}
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
        )}

        {/* Show More Button */}
        {!showMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowMore(true)}
              className="bg-gold-500 text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-400 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto group"
            >
              <span>Больше</span>
              <ChevronDown className="group-hover:translate-y-1 transition-transform" size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

