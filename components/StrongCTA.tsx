'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle, Search, ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

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
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('50 123 45 67')
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Загружаем страны при монтировании компонента
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true)
        const response = await fetch('/api/countries')
        if (!response.ok) throw new Error('Failed to fetch countries')
        
        const data = await response.json()
        
        // Сортируем страны: ОАЭ первый, остальные по алфавиту, Россия последняя
        const sortedCountries = [...data.countries].sort((a: Country, b: Country) => {
          // ОАЭ всегда первый
          if (a.code === 'AE') return -1
          if (b.code === 'AE') return 1
          // Россия всегда последняя
          if (a.code === 'RU') return 1
          if (b.code === 'RU') return -1
          // Остальные по алфавиту
          return a.name.localeCompare(b.name, 'ru')
        })
        
        // Явно перемещаем Россию в конец
        const uaeCountry = sortedCountries.find((c: Country) => c.code === 'AE')
        const russiaCountry = sortedCountries.find((c: Country) => c.code === 'RU')
        const otherCountries = sortedCountries.filter((c: Country) => c.code !== 'AE' && c.code !== 'RU')
        
        const finalSorted: Country[] = []
        if (uaeCountry) finalSorted.push(uaeCountry)
        finalSorted.push(...otherCountries)
        if (russiaCountry) finalSorted.push(russiaCountry)
        
        setCountries(finalSorted)
        
        // Устанавливаем ОАЭ по умолчанию
        if (uaeCountry) {
          setSelectedCountry(uaeCountry)
        } else if (finalSorted.length > 0) {
          setSelectedCountry(finalSorted[0])
        }
      } catch (error) {
        console.error('Error loading countries:', error)
        // Fallback к статическому списку при ошибке
        const fallbackCountries: Country[] = [
          { code: 'AE', name: 'ОАЭ (Дубай)', dialCode: '+971', flag: '🇦🇪' },
          { code: 'RU', name: 'Россия', dialCode: '+7', flag: '🇷🇺' },
          { code: 'US', name: 'США', dialCode: '+1', flag: '🇺🇸' },
        ]
        setCountries(fallbackCountries)
        setSelectedCountry(fallbackCountries[0])
      } finally {
        setIsLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  // Обновляем значение телефона при изменении страны или номера
  useEffect(() => {
    if (selectedCountry) {
      const fullPhone = `${selectedCountry.dialCode} ${phoneNumber}`.replace(/\s/g, '')
      setValue('phone', fullPhone)
    }
  }, [selectedCountry, phoneNumber, setValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = countries.filter((country) => {
    if (!searchQuery) return true
    return (
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
    )
  })

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchQuery('')
    phoneInputRef.current?.focus()
  }

  useEffect(() => {
    const currentSectionRef = sectionRef.current
    if (!currentSectionRef) return

    const content = currentSectionRef.querySelector('.cta-content')
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
              Частное обращение
            </h2>
            <p className="text-xl text-white/70">
              Для персонального рассмотрения запроса
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
                <label className="block text-white mb-2 font-bold">Телефон *</label>
                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center border border-gold-500/30 rounded-lg bg-dark overflow-hidden hover:border-gold-500/50 focus-within:border-gold-500 transition-colors">
                    {/* Country Selector Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (!isLoadingCountries) {
                          setIsDropdownOpen(!isDropdownOpen)
                        }
                      }}
                      disabled={isLoadingCountries || !selectedCountry}
                      className="flex items-center space-x-2 px-3 py-3 hover:bg-gold-500/10 transition-colors border-r border-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      {isLoadingCountries ? (
                        <span className="text-white/60 text-sm">Загрузка...</span>
                      ) : selectedCountry ? (
                        <>
                          <span className="text-2xl leading-none" style={{ fontFamily: 'system-ui' }}>
                            {selectedCountry.flag}
                          </span>
                          <span className="text-white/90 text-sm font-bold">{selectedCountry.dialCode}</span>
                          <ChevronDown 
                            size={16} 
                            className={`text-gold-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </>
                      ) : null}
                    </button>
                    
                    {/* Phone Input */}
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 bg-transparent text-white/90 text-sm px-4 py-3 outline-none placeholder-white/40"
                      placeholder="50 123 45 67"
                    />
                  </div>

                  {/* Hidden input for form validation */}
                  {selectedCountry && (
                    <input
                      {...register('phone')}
                      type="hidden"
                      value={`${selectedCountry.dialCode} ${phoneNumber}`.replace(/\s/g, '')}
                    />
                  )}

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-dark border border-gold-500/30 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
                      {/* Search Input */}
                      <div className="p-3 border-b border-gold-500/20">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={18} />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск страны..."
                            className="w-full bg-dark/50 border border-gold-500/30 rounded-lg pl-10 pr-4 py-2 text-white/90 text-sm outline-none focus:border-gold-500 placeholder-white/40 font-bold"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Countries List */}
                      <div className="overflow-y-auto max-h-64">
                        {isLoadingCountries ? (
                          <div className="px-4 py-8 text-center text-white/60 text-sm">
                            Загрузка стран...
                          </div>
                        ) : filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              onClick={(e) => {
                                e.preventDefault()
                                handleCountrySelect(country)
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gold-500/10 transition-colors text-left ${
                                selectedCountry?.code === country.code ? 'bg-gold-500/10' : ''
                              }`}
                              type="button"
                            >
                              <span className="text-2xl leading-none" style={{ fontFamily: 'system-ui' }}>
                                {country.flag}
                              </span>
                              <div className="flex-1">
                                <div className="text-white/90 text-sm font-bold">{country.name}</div>
                                <div className="text-white/60 text-xs">{country.dialCode}</div>
                              </div>
                              {selectedCountry?.code === country.code && (
                                <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-white/60 text-sm">
                            Страна не найдена
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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

          </form>
        </div>
      </div>
    </section>
  )
}

