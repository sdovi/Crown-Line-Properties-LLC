'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 500, suffix: '+', label: 'Проданных объектов' },
  { value: 15, suffix: '+', label: 'Лет на рынке' },
  { value: 1200, suffix: '+', label: 'Довольных клиентов' },
  { value: 8, suffix: '%', label: 'Средняя доходность' },
]

export default function Statistics() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [countedValues, setCountedValues] = useState(stats.map(() => 0))

  useEffect(() => {
    if (!sectionRef.current) return

    let hasAnimated = false

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (hasAnimated) return
          hasAnimated = true

          stats.forEach((stat, index) => {
            const obj = { value: 0 }
            gsap.to(obj, {
              value: stat.value,
              duration: 2,
              delay: index * 0.2,
              ease: 'power2.out',
              onUpdate: () => {
                setCountedValues((prev) => {
                  const newValues = [...prev]
                  newValues[index] = Math.floor(obj.value)
                  return newValues
                })
              },
            })
          })
        },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="luxury-spacing bg-dark-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-serif text-gold-500 mb-4">
                {countedValues[index] || 0}
                <span className="text-3xl md:text-4xl">{stat.suffix}</span>
              </div>
              <div className="text-white/70 text-lg md:text-xl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

