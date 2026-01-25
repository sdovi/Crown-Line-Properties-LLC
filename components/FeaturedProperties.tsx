'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MapPin, Bed, Square, Share2, Check } from 'lucide-react'
import { Property, getProperties } from '@/lib/properties'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sale' | 'rental'>('all')
  const [properties, setProperties] = useState<Property[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({})
  const [copiedPropertyId, setCopiedPropertyId] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const loadProperties = () => {
      const props = getProperties()
      setProperties(props)
      
      // Инициализация индексов изображений
      setActiveImageIndex((prev) => {
        const initialIndexes: Record<number, number> = { ...prev }
        props.forEach((prop) => {
          if (!(prop.id in initialIndexes)) {
            initialIndexes[prop.id] = 0
          }
        })
        return initialIndexes
      })
    }

    loadProperties()

    // Слушаем изменения в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'featured_properties') {
        loadProperties()
      }
    }

    // Слушаем кастомное событие для обновления в той же вкладке
    const handleCustomStorageChange = () => {
      loadProperties()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('propertiesUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('propertiesUpdated', handleCustomStorageChange)
    }
  }, [])

  const filteredProperties =
    activeFilter === 'all'
      ? properties
      : properties.filter((p) => p.type === activeFilter)

  const handleImageChange = (propertyId: number, direction: 'next' | 'prev') => {
    const property = properties.find((p) => p.id === propertyId)
    if (!property || property.images.length === 0) return

    const currentIndex = activeImageIndex[propertyId] || 0
    let newIndex: number

    if (direction === 'next') {
      newIndex = currentIndex === property.images.length - 1 ? 0 : currentIndex + 1
    } else {
      newIndex = currentIndex === 0 ? property.images.length - 1 : currentIndex - 1
    }

    setActiveImageIndex({
      ...activeImageIndex,
      [propertyId]: newIndex,
    })
  }

  const handleShare = async (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    const propertyUrl = `${window.location.origin}/property/${propertyId}`
    
    const copyToClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(propertyUrl)
        } else {
          // Fallback для старых браузеров
          const textArea = document.createElement('textarea')
          textArea.value = propertyUrl
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
        }
        setCopiedPropertyId(propertyId)
        setTimeout(() => setCopiedPropertyId(null), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
    
    try {
      // Пытаемся использовать Web Share API, если доступен (в основном на мобильных)
      if (navigator.share) {
        try {
          await navigator.share({
            title: properties.find(p => p.id === propertyId)?.title || 'Недвижимость',
            url: propertyUrl,
          })
          // Если шаринг успешен, не показываем состояние "скопировано"
          return
        } catch (shareError) {
          // Если пользователь отменил шаринг (AbortError), копируем в буфер
          if (shareError instanceof Error && shareError.name === 'AbortError') {
            return
          }
          // При другой ошибке пробуем скопировать
          await copyToClipboard()
        }
      } else {
        // Если Web Share API недоступен, просто копируем
        await copyToClipboard()
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  useEffect(() => {
    const currentSectionRef = sectionRef.current
    if (!currentSectionRef) return

    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (card) {
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
        }
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
  }, [filteredProperties])

  return (
    <section ref={sectionRef} className="luxury-spacing bg-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-500 mb-4">
            Избранная коллекция
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Резиденции в ключевых локациях Дубая
          </p>

          {/* Filters */}
          <div className="flex justify-center gap-4">
            {(['all', 'sale', 'rental'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gold-500 text-dark'
                    : 'bg-dark-lighter text-white hover:bg-dark-light'
                }`}
              >
                {filter === 'all'
                  ? 'Все'
                  : filter === 'sale'
                  ? 'Продажа'
                  : 'Аренда'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => {
            const currentImageIndex = activeImageIndex[property.id] || 0
            const images = property.images.length > 0 ? property.images : ['https://via.placeholder.com/400x300?text=No+Image']
            const hasMultipleImages = images.length > 1

            return (
              <div
                key={property.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el as HTMLAnchorElement
                }}
                className="group bg-dark-lighter rounded-2xl overflow-hidden hover:bg-dark-light transition-all duration-300"
              >
                <Link href={`/property/${property.id}`} className="block">
                  {/* Image Slider */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="relative w-full h-full">
                      {images.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                    
                    {/* Navigation Buttons */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleImageChange(property.id, 'prev')
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          ←
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleImageChange(property.id, 'next')
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          →
                        </button>
                      </>
                    )}

                    {/* Image Indicators */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveImageIndex({
                                ...activeImageIndex,
                                [property.id]: imgIndex,
                              })
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              imgIndex === currentImageIndex
                                ? 'bg-gold-500 w-6'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to image ${imgIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          property.type === 'sale'
                            ? 'bg-gold-500 text-dark'
                            : 'bg-white/20 text-white backdrop-blur-sm'
                        }`}
                      >
                        {property.type === 'sale' ? 'Продажа' : 'Аренда'}
                      </span>
                    </div>

                    {/* Photo Count Badge */}
                    {hasMultipleImages && images.length > 1 && (
                      <div className="absolute top-4 left-4">
                        <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs font-semibold">
                          {images.length} фото
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="text-xl font-serif text-white group-hover:text-gold-500 transition-colors flex-1">
                        {property.title}
                      </h3>
                      <button
                        onClick={(e) => handleShare(e, property.id)}
                        className="relative ml-2 p-2 hover:bg-gold-500/10 rounded-lg transition-all duration-300 group/share flex-shrink-0"
                        aria-label={copiedPropertyId === property.id ? 'Ссылка скопирована' : 'Поделиться'}
                        title={copiedPropertyId === property.id ? 'Ссылка скопирована' : 'Поделиться'}
                      >
                        {copiedPropertyId === property.id ? (
                          <>
                            <Check size={18} className="text-gold-500 animate-in fade-in zoom-in duration-200" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gold-500 text-dark text-xs font-semibold rounded whitespace-nowrap opacity-0 group-hover/share:opacity-100 transition-opacity pointer-events-none">
                              Скопировано!
                            </span>
                          </>
                        ) : (
                          <>
                            <Share2 size={18} className="text-white/60 group-hover/share:text-gold-500 transition-colors" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-lighter border border-gold-500/30 text-white text-xs font-semibold rounded whitespace-nowrap opacity-0 group-hover/share:opacity-100 transition-opacity pointer-events-none">
                              Поделиться
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center text-white/60 text-sm mb-4">
                      <MapPin size={16} className="mr-1" />
                      {property.location}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-serif text-gold-500">
                        {property.price}
                      </div>
                      {property.bedrooms > 0 && (
                        <div className="flex items-center text-white/70">
                          <Bed size={18} className="mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <div className="flex items-center">
                        <Square size={16} className="mr-1" />
                        <span>{property.areaM2} м²</span>
                      </div>
                      {property.areaSqft && (
                        <div className="flex items-center">
                          <span>{property.areaSqft} sqft</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/catalog"
            className="inline-flex items-center text-gold-500 font-semibold text-lg hover:text-gold-400 transition-colors"
          >
            Смотреть все объекты
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

