'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Plus, Minus } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    question: 'Какой процесс покупки недвижимости в Дубае?',
    answer:
      'Процесс включает консультацию, подбор объектов, просмотры, анализ, оформление сделки и передачу ключей. Мы сопровождаем вас на всех этапах.',
  },
  {
    question: 'Какие документы нужны для покупки?',
    answer:
      'Основные документы: паспорт, виза (если требуется), подтверждение дохода, банковские выписки. Наша команда поможет собрать все необходимые документы.',
  },
  {
    question: 'Можно ли получить вид на жительство при покупке недвижимости?',
    answer:
      'Да, при покупке недвижимости на сумму от 1 млн AED можно получить резидентскую визу на 2 года с возможностью продления.',
  },
  {
    question: 'Какая средняя доходность от аренды?',
    answer:
      'Средняя доходность от аренды недвижимости в Дубае составляет 8-12% годовых, в зависимости от типа и локации объекта.',
  },
  {
    question: 'Есть ли налоги на недвижимость в Дубае?',
    answer:
      'Нет, в Дубае нет налога на недвижимость для физических лиц. Единственные расходы - это регистрационные сборы и комиссия агентства.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentSectionRef = sectionRef.current
    if (!currentSectionRef) return

    const items = currentSectionRef.querySelectorAll('.faq-item')
    if (items.length === 0) return

    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            once: true,
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power3.out',
        })
      })
    }, currentSectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger && currentSectionRef.contains(trigger.vars.trigger as Element)) {
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
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Ответы на популярные вопросы о недвижимости в Дубае
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-dark-lighter rounded-xl border border-gold-500/20 overflow-hidden"
            >
              <button
                className="w-full p-6 flex items-center justify-between text-left hover:bg-dark-light transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-xl font-semibold text-white pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="text-gold-500 flex-shrink-0" size={24} />
                ) : (
                  <Plus className="text-gold-500 flex-shrink-0" size={24} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-white/70">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

