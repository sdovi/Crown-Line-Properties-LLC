export interface ContactInfo {
  phone: string
  whatsapp: string
  email: string
  address: string
  facebook: string
  instagram: string
  twitter: string
  copyright: string
}

const STORAGE_KEY = 'footer_contacts'

// Получить контакты
export function getContacts(): ContactInfo {
  if (typeof window === 'undefined') {
    return getDefaultContacts()
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultContacts()
    }
  }
  return getDefaultContacts()
}

// Сохранить контакты
export function saveContacts(contacts: ContactInfo): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  // Отправляем кастомное событие для обновления в той же вкладке
  window.dispatchEvent(new Event('contactsUpdated'))
}

// Дефолтные контакты
function getDefaultContacts(): ContactInfo {
  return {
    phone: '+971 50 123 45 67',
    whatsapp: '+971 55 230 7377',
    email: 'info@crownlineproperty.com',
    address: 'Dubai, Boulevard Plaza, tower 1, 20 floor, office 2003',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    copyright: '© 2020 CROWN LINE PROPERTY.',
  }
}
