'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const districts = [
  { name: 'Downtown Dubai', count: 45, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070' },
  { name: 'Palm Jumeirah', count: 32, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075' },
  { name: 'Dubai Marina', count: 67, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053' },
  { name: 'Business Bay', count: 28, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069' },
  { name: 'Jumeirah', count: 41, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070' },
  { name: 'Arabian Ranches', count: 23, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070' },
]

export default function PropertyGeography() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.district-card')
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
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
            География объектов
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Премиальная недвижимость в лучших районах Дубая
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district, index) => (
            <div
              key={district.name}
              className="district-card group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${district.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-serif text-white group-hover:text-gold-500 transition-colors">
                    {district.name}
                  </h3>
                  <div className="flex items-center text-gold-500">
                    <MapPin size={20} />
                  </div>
                </div>
                <div className="text-white/70">{district.count} объектов</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

