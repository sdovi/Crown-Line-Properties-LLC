'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { ContactInfo, getContacts } from '@/lib/contacts'

export default function Footer() {
  const [contacts, setContacts] = useState<ContactInfo>({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    copyright: '© 2020 CROWN LINE PROPERTY.',
  })

  useEffect(() => {
    const loadContacts = () => {
      setContacts(getContacts())
    }

    loadContacts()

    // Слушаем изменения в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'footer_contacts') {
        loadContacts()
      }
    }

    // Слушаем кастомное событие для обновления в той же вкладке
    const handleCustomStorageChange = () => {
      loadContacts()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('contactsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contactsUpdated', handleCustomStorageChange)
    }
  }, [])

  return (
    <footer className="bg-dark border-t border-gold-500/20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-gold-500 font-serif text-2xl font-bold mb-2">
              CROWN LINE
            </div>
            <div className="text-gold-500 text-sm mb-4">PROPERTY</div>
            <p className="text-white/60 text-sm mb-4">
              Real Estate of Distinction
            </p>
            <div className="flex space-x-4">
              <a
                href={contacts.facebook}
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Facebook"
                target={contacts.facebook !== '#' ? '_blank' : undefined}
                rel={contacts.facebook !== '#' ? 'noopener noreferrer' : undefined}
              >
                <Facebook size={20} />
              </a>
              <a
                href={contacts.instagram}
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Instagram"
                target={contacts.instagram !== '#' ? '_blank' : undefined}
                rel={contacts.instagram !== '#' ? 'noopener noreferrer' : undefined}
              >
                <Instagram size={20} />
              </a>
              <a
                href={contacts.twitter}
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Twitter"
                target={contacts.twitter !== '#' ? '_blank' : undefined}
                rel={contacts.twitter !== '#' ? 'noopener noreferrer' : undefined}
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="text-gold-500 mr-2 flex-shrink-0" size={18} />
                <a
                  href={`tel:${contacts.phone.replace(/\s/g, '')}`}
                  className="text-white/60 hover:text-gold-500 transition-colors text-sm"
                >
                  {contacts.phone}
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="text-gold-500 mr-2 flex-shrink-0"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <a
                  href={`https://wa.me/${contacts.whatsapp.replace(/\s/g, '').replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-500 transition-colors text-sm"
                >
                  {contacts.whatsapp}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-gold-500 mr-2 flex-shrink-0" size={18} />
                <a
                  href={`mailto:${contacts.email}`}
                  className="text-white/60 hover:text-gold-500 transition-colors text-sm"
                >
                  {contacts.email}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="text-gold-500 mr-2 mt-1 flex-shrink-0" size={18} />
                <a
                  href="https://maps.app.goo.gl/Nr6YudwfdQda41U6A?g_st=ipc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-500 transition-colors text-sm"
                >
                  {contacts.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-500/20 pt-8 text-center text-white/60 text-sm">
          <p>{contacts.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
