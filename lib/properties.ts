export interface Property {
  id: number
  title: string
  location: string
  price: string
  areaM2: string
  areaSqft: string
  bedrooms: number
  images: string[]
  type: 'sale' | 'rental'
}

const STORAGE_KEY = 'featured_properties'

// Получить все карточки
export function getProperties(): Property[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultProperties()
    }
  }
  return getDefaultProperties()
}

// Сохранить карточки
export function saveProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
  // Отправляем кастомное событие для обновления в той же вкладке
  window.dispatchEvent(new Event('propertiesUpdated'))
}

// Добавить новую карточку
export function addProperty(property: Omit<Property, 'id'>): Property {
  const properties = getProperties()
  const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1
  const newProperty: Property = { ...property, id: newId }
  properties.push(newProperty)
  saveProperties(properties)
  return newProperty
}

// Обновить карточку
export function updateProperty(id: number, updates: Partial<Property>): boolean {
  const properties = getProperties()
  const index = properties.findIndex(p => p.id === id)
  if (index === -1) return false
  
  properties[index] = { ...properties[index], ...updates }
  saveProperties(properties)
  return true
}

// Удалить карточку
export function deleteProperty(id: number): boolean {
  const properties = getProperties()
  const filtered = properties.filter(p => p.id !== id)
  if (filtered.length === properties.length) return false
  
  saveProperties(filtered)
  return true
}

// Получить карточку по ID
export function getPropertyById(id: number): Property | null {
  const properties = getProperties()
  return properties.find(p => p.id === id) || null
}

// Дефолтные карточки
function getDefaultProperties(): Property[] {
  return [
    {
      id: 1,
      title: 'Пентхаус с видом на Burj Khalifa',
      location: 'Downtown Dubai',
      price: 'AED 15,000,000',
      areaM2: '450',
      areaSqft: '4844',
      bedrooms: 4,
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2027',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
      ],
      type: 'sale',
    },
    {
      id: 2,
      title: 'Вилла на Palm Jumeirah',
      location: 'Palm Jumeirah',
      price: 'AED 25,000/мес',
      areaM2: '800',
      areaSqft: '8611',
      bedrooms: 6,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070',
      ],
      type: 'rental',
    },
    {
      id: 3,
      title: 'Апартаменты в Dubai Marina',
      location: 'Dubai Marina',
      price: 'AED 8,500,000',
      areaM2: '180',
      areaSqft: '1938',
      bedrooms: 2,
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2027',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
      ],
      type: 'sale',
    },
    {
      id: 4,
      title: 'Офис в Business Bay',
      location: 'Business Bay',
      price: 'AED 120,000/мес',
      areaM2: '500',
      areaSqft: '5382',
      bedrooms: 0,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
      ],
      type: 'rental',
    },
    {
      id: 5,
      title: 'Таунхаус в Arabian Ranches',
      location: 'Arabian Ranches',
      price: 'AED 4,200,000',
      areaM2: '320',
      areaSqft: '3444',
      bedrooms: 3,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
      ],
      type: 'sale',
    },
    {
      id: 6,
      title: 'Пентхаус в Jumeirah',
      location: 'Jumeirah',
      price: 'AED 18,000/мес',
      areaM2: '280',
      areaSqft: '3014',
      bedrooms: 3,
      images: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
      ],
      type: 'rental',
    },
  ]
}
