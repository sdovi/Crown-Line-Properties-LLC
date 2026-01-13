'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function InvestmentOpportunities() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.investment-card')
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
          delay: index * 0.2,
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
    <section ref={sectionRef} className="luxury-spacing bg-dark-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
            Инвестиционные возможности
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Выгодные инвестиции в недвижимость Дубая с высокой доходностью
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="investment-card bg-dark-lighter rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-colors">
            <div className="bg-gold-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="text-gold-500" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Высокая доходность</h3>
            <p className="text-white/70 mb-6">
              Средняя доходность от аренды составляет 8-12% годовых
            </p>
            <div className="text-4xl font-serif text-gold-500">8-12%</div>
            <div className="text-white/60 text-sm">годовых</div>
          </div>

          <div className="investment-card bg-dark-lighter rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-colors">
            <div className="bg-gold-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <DollarSign className="text-gold-500" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Рост цен</h3>
            <p className="text-white/70 mb-6">
              Стабильный рост стоимости недвижимости в Дубае
            </p>
            <div className="text-4xl font-serif text-gold-500">+15%</div>
            <div className="text-white/60 text-sm">в год</div>
          </div>

          <div className="investment-card bg-dark-lighter rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-colors">
            <div className="bg-gold-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="text-gold-500" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Стабильность</h3>
            <p className="text-white/70 mb-6">
              Надежный рынок с прозрачным законодательством
            </p>
            <div className="text-4xl font-serif text-gold-500">100%</div>
            <div className="text-white/60 text-sm">безопасность</div>
          </div>
        </div>
      </div>
    </section>
  )
}

