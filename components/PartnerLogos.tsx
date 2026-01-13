'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const partners = [
  'Partner 1',
  'Partner 2',
  'Partner 3',
  'Partner 4',
  'Partner 5',
  'Partner 6',
]

export default function PartnerLogos() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const logos = sectionRef.current.querySelectorAll('.partner-logo')
    if (logos.length === 0) return

    const ctx = gsap.context(() => {
      logos.forEach((logo, index) => {
        gsap.from(logo, {
          scrollTrigger: {
            trigger: logo,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            once: true,
          },
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gold-500 mb-4">
            Наши партнеры
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="partner-logo flex items-center justify-center h-24 bg-dark-lighter rounded-lg border border-gold-500/10 hover:border-gold-500/30 transition-colors"
            >
              <span className="text-white/40 text-sm">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

