'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MessageSquare, Search, Eye, FileText, Handshake, Key } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Консультация',
    description: 'Обсуждение потребностей и бюджета',
  },
  {
    number: '02',
    icon: Search,
    title: 'Подбор объектов',
    description: 'Персональная подборка на основе критериев',
  },
  {
    number: '03',
    icon: Eye,
    title: 'Просмотры',
    description: 'Организация визитов на объекты',
  },
  {
    number: '04',
    icon: FileText,
    title: 'Анализ и сравнение',
    description: 'Помощь в принятии решения',
  },
  {
    number: '05',
    icon: Handshake,
    title: 'Оформление сделки',
    description: 'Юридическое сопровождение',
  },
  {
    number: '06',
    icon: Key,
    title: 'Передача ключей',
    description: 'Финальный этап',
  },
]

export default function WorkProcess() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const steps = sectionRef.current.querySelectorAll('.process-step')
    if (steps.length === 0) return

    const ctx = gsap.context(() => {
      steps.forEach((step, index) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            once: true,
          },
          opacity: 0,
          x: -50,
          duration: 0.8,
          delay: index * 0.15,
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
            Процесс работы
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            От первого контакта до передачи ключей
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold-500/30 transform -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0
              return (
                <div
                  key={step.number}
                  className={`process-step relative flex flex-col lg:flex-row items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-1/2 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-dark-lighter rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-gold-500/10 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <Icon className="text-gold-500" size={24} />
                        </div>
                        <span className="text-gold-500 text-2xl font-serif">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-white/70">{step.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold-500 rounded-full border-4 border-dark z-10" />

                  {/* Spacer */}
                  <div className="lg:w-1/2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

