'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Crown, Shield, Users, FileCheck, TrendingUp, Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const advantages = [
  {
    icon: Crown,
    title: 'Закрытый доступ к объектам',
    description: 'Ранний доступ до выхода на открытый рынок',
  },
  {
    icon: Shield,
    title: 'Комплексное сопровождение сделки',
    description: 'Юридическая и административная поддержка на каждом этапе',
  },
  {
    icon: Users,
    title: 'Международная экспертиза',
    description: 'Более 20 лет практики на глобальных рынках недвижимости',
  },
  {
    icon: FileCheck,
    title: 'Прозрачные условия сотрудничества',
    description: 'Финансовая структура без скрытых начислений',
  },
  {
    icon: TrendingUp,
    title: 'Инвестиционное сопровождение',
    description: 'Подбор активов с учётом стратегии и целей капитала',
  },
  {
    icon: Heart,
    title: 'Персональное сопровождение',
    description: 'Индивидуальная стратегия взаимодействия',
  },
]

export default function CompanyAdvantages() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.advantage-card')
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
    <section ref={sectionRef} className="luxury-spacing bg-dark-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
            Подход Crown Line Property
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Принципы, определяющие наш уровень работы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <div
                key={index}
                className="advantage-card group bg-dark-lighter rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300 hover:bg-dark-light"
              >
                <div className="bg-gold-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  <Icon className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-gold-500 transition-colors">
                  {advantage.title}
                </h3>
                <p className="text-white/70">{advantage.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

