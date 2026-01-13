'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const formSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function StrongCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (!sectionRef.current) return

    const content = sectionRef.current.querySelector('.cta-content')
    if (!content) return

    const ctx = gsap.context(() => {
      gsap.from(content, {
        scrollTrigger: {
          trigger: content,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
          once: true,
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // For static export, use Telegram Bot API directly from client
      const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
      const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID

      if (BOT_TOKEN && CHAT_ID) {
        const text = `
🆕 Новая заявка с сайта CROWN LINE PROPERTY

👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
📧 Email: ${data.email}
${data.message ? `💬 Сообщение: ${data.message}` : ''}

⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dubai' })}
        `.trim()

        const response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text,
              parse_mode: 'HTML',
            }),
          }
        )

        if (response.ok) {
          setIsSubmitted(true)
          reset()
          setTimeout(() => setIsSubmitted(false), 5000)
        } else {
          throw new Error('Failed to send message')
        }
      } else {
        // Fallback: show success message anyway (for demo)
        setIsSubmitted(true)
        reset()
        setTimeout(() => setIsSubmitted(false), 5000)
        console.log('Form data:', data)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Ошибка при отправке заявки. Пожалуйста, свяжитесь с нами напрямую.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className="luxury-spacing bg-gradient-to-b from-dark-light to-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto cta-content">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl text-white/70">
              Оставьте заявку, и наш консультант свяжется с вами в ближайшее время
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-dark-lighter rounded-2xl p-8 lg:p-12 border border-gold-500/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white mb-2">Имя *</label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 bg-dark border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="Ваше имя"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-white mb-2">Телефон *</label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 bg-dark border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="+7 (999) 123-45-67"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2">Email *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-dark border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2">Сообщение (необязательно)</label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-3 bg-dark border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
                placeholder="Расскажите о ваших требованиях..."
              />
            </div>

            {isSubmitted ? (
              <div className="flex items-center justify-center space-x-2 text-gold-500 py-4">
                <CheckCircle size={24} />
                <span className="font-semibold">Заявка отправлена! Мы свяжемся с вами скоро.</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 text-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-400 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                <span>{isSubmitting ? 'Отправка...' : 'Отправить заявку'}</span>
              </button>
            )}

            <p className="text-white/50 text-sm text-center mt-6">
              Или свяжитесь с нами напрямую:{' '}
              <a href="tel:+971501234567" className="text-gold-500 hover:text-gold-400">
                +971 50 123 45 67
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

