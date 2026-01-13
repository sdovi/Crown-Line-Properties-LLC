'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Star, Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Александр Петров',
    location: 'Москва',
    property: 'Вилла на Palm Jumeirah',
    rating: 5,
    text: 'Отличный сервис! Помогли найти идеальную виллу за короткое время. Все было прозрачно и профессионально.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Мария Иванова',
    location: 'Санкт-Петербург',
    property: 'Пентхаус в Downtown',
    rating: 5,
    text: 'CROWN LINE PROPERTY - это действительно премиальный сервис. Внимание к деталям и индивидуальный подход.',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    name: 'Дмитрий Соколов',
    location: 'Дубай',
    property: 'Офис в Business Bay',
    rating: 5,
    text: 'Работали с командой над покупкой офиса. Все этапы прошли гладко, юридическое сопровождение на высшем уровне.',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
]

export default function ClientTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.testimonial-card')
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
            Отзывы клиентов
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Что говорят наши клиенты о работе с нами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-dark-lighter rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300"
            >
              <Quote className="text-gold-500/30 mb-4" size={32} />
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-gold-500 fill-gold-500"
                    size={20}
                  />
                ))}
              </div>
              <p className="text-white/80 mb-6 italic">{testimonial.text}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-gold-500 mr-4"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.location}</div>
                  <div className="text-gold-500 text-sm">{testimonial.property}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

