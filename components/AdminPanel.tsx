'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property, getProperties, addProperty, updateProperty, deleteProperty } from '@/lib/properties'
import { ContactInfo, getContacts, saveContacts } from '@/lib/contacts'
import { Plus, Edit, Trash2, Save, X, Home, MapPin, DollarSign, Square, Bed, Image as ImageIcon, ArrowLeft, Phone, Mail, Facebook, Instagram, Twitter, Settings, Upload } from 'lucide-react'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'properties' | 'contacts'>('properties')
  const [properties, setProperties] = useState<Property[]>([])
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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    location: '',
    price: '',
    areaM2: '',
    areaSqft: '',
    bedrooms: 0,
    images: [],
    type: 'sale',
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    loadProperties()
    loadContacts()
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const loadProperties = () => {
    setProperties(getProperties())
  }

  const loadContacts = () => {
    setContacts(getContacts())
  }

  const handleSaveContacts = () => {
    try {
      saveContacts(contacts)
      setNotification({ message: 'Контакты успешно сохранены', type: 'success' })
    } catch (error) {
      setNotification({ message: 'Ошибка при сохранении контактов', type: 'error' })
    }
  }

  const handleEdit = (property: Property) => {
    setEditingId(property.id)
    setFormData(property)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      title: '',
      location: '',
      price: '',
      areaM2: '',
      areaSqft: '',
      bedrooms: 0,
      images: [],
      type: 'sale',
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({})
    setNewImageUrl('')
  }

  const handleSave = () => {
    if (!formData.title || !formData.location || !formData.price) {
      setNotification({ message: 'Заполните все обязательные поля', type: 'error' })
      return
    }

    try {
      if (isAdding) {
        addProperty({
          title: formData.title!,
          location: formData.location!,
          price: formData.price!,
          areaM2: formData.areaM2 || '0',
          areaSqft: formData.areaSqft || '0',
          bedrooms: formData.bedrooms || 0,
          images: formData.images || [],
          type: formData.type || 'sale',
        })
        setNotification({ message: 'Карточка успешно добавлена', type: 'success' })
      } else if (editingId) {
        updateProperty(editingId, formData)
        setNotification({ message: 'Карточка успешно обновлена', type: 'success' })
      }

      loadProperties()
      handleCancel()
    } catch (error) {
      setNotification({ message: 'Ошибка при сохранении', type: 'error' })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту карточку?')) {
      try {
        deleteProperty(id)
        loadProperties()
        setNotification({ message: 'Карточка успешно удалена', type: 'success' })
      } catch (error) {
        setNotification({ message: 'Ошибка при удалении', type: 'error' })
      }
    }
  }

  const addImage = () => {
    const url = newImageUrl.trim()
    if (!url) return

    // Простая валидация URL
    try {
      new URL(url)
      setFormData({
        ...formData,
        images: [...(formData.images || []), url],
      })
      setNewImageUrl('')
    } catch {
      setNotification({ message: 'Введите корректный URL изображения', type: 'error' })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        setNotification({ message: 'Пожалуйста, выберите файл изображения', type: 'error' })
        return
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({ message: 'Размер файла не должен превышать 5MB', type: 'error' })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        if (dataUrl) {
          setFormData({
            ...formData,
            images: [...(formData.images || []), dataUrl],
          })
        }
      }
      reader.onerror = () => {
        setNotification({ message: 'Ошибка при чтении файла', type: 'error' })
      }
      reader.readAsDataURL(file)
    })

    // Сбрасываем input
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const images = formData.images || []
    setFormData({
      ...formData,
      images: images.filter((_, i) => i !== index),
    })
  }

  const isEditing = (id: number): boolean => editingId === id || isAdding

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-dark text-white">
      {/* Header */}
      <div className="bg-dark-lighter/50 backdrop-blur-sm border-b border-gold-500/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/"
                  className="p-2 hover:bg-gold-500/10 rounded-lg transition-colors"
                  aria-label="Вернуться на главную"
                >
                  <ArrowLeft size={20} className="text-gold-500" />
                </Link>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gold-500">
                  Админ-панель
                </h1>
              </div>
              <p className="text-white/60 text-sm sm:text-base ml-11">
                Управление контентом сайта
              </p>
            </div>
            {activeTab === 'properties' && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 w-full sm:w-auto justify-center"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Добавить карточку</span>
                <span className="sm:hidden">Добавить</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-lighter/30 border-b border-gold-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                activeTab === 'properties'
                  ? 'text-gold-500 border-gold-500'
                  : 'text-white/60 border-transparent hover:text-white'
              }`}
            >
              Карточки недвижимости
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                activeTab === 'contacts'
                  ? 'text-gold-500 border-gold-500'
                  : 'text-white/60 border-transparent hover:text-white'
              }`}
            >
              Контакты Footer
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in slide-in-from-right">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${
              notification.type === 'success'
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        {activeTab === 'properties' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-gold-500/10 to-gold-500/5 border border-gold-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-serif text-gold-500 mb-1">
                  {properties.length}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">Всего карточек</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-serif text-blue-400 mb-1">
                  {properties.filter(p => p.type === 'sale').length}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">На продажу</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-serif text-green-400 mb-1">
                  {properties.filter(p => p.type === 'rental').length}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">В аренду</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-serif text-purple-400 mb-1">
                  {properties.reduce((sum, p) => sum + p.images.length, 0)}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">Всего фото</div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {isAdding && (
                <div className="bg-gradient-to-br from-dark-lighter to-dark border border-gold-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-gold-500/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gold-500/20 rounded-lg">
                      <Plus className="text-gold-500" size={24} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-500">
                      Новая карточка
                    </h2>
                  </div>
                  <PropertyForm
                    formData={formData}
                    setFormData={setFormData}
                    newImageUrl={newImageUrl}
                    setNewImageUrl={setNewImageUrl}
                    addImage={addImage}
                    handleFileUpload={handleFileUpload}
                    removeImage={removeImage}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              )}

              {properties.length === 0 && !isAdding && (
                <div className="text-center py-12 sm:py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-full mb-4">
                    <Home className="text-gold-500" size={32} />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-2">Нет карточек</h3>
                  <p className="text-white/60 mb-6">Добавьте первую карточку, чтобы начать</p>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-dark font-semibold rounded-lg hover:bg-gold-400 transition-colors"
                  >
                    <Plus size={20} />
                    Добавить карточку
                  </button>
                </div>
              )}

              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-gradient-to-br from-dark-lighter to-dark border border-gold-500/20 rounded-2xl p-4 sm:p-6 overflow-hidden hover:border-gold-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gold-500/5"
                >
              {isEditing(property.id) ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gold-500/20 rounded-lg">
                      <Edit className="text-gold-500" size={24} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-500">
                      Редактирование карточки
                    </h2>
                  </div>
                  <PropertyForm
                    formData={formData}
                    setFormData={setFormData}
                    newImageUrl={newImageUrl}
                    setNewImageUrl={setNewImageUrl}
                    addImage={addImage}
                    handleFileUpload={handleFileUpload}
                    removeImage={removeImage}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-gold-500/10 rounded-lg mt-1">
                          <Home className="text-gold-500" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-serif text-white mb-2">
                            {property.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-white/70">
                              <MapPin size={14} className="text-gold-500" />
                              <span>{property.location}</span>
                            </div>
                            <span className="text-white/30">•</span>
                            <div className="flex items-center gap-1.5 text-white/70">
                              <Bed size={14} className="text-gold-500" />
                              <span>{property.bedrooms} спален</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-11">
                        <div className="flex items-center gap-2 p-3 bg-dark/50 rounded-lg border border-gold-500/10">
                          <DollarSign size={18} className="text-gold-500" />
                          <div>
                            <div className="text-xs text-white/60">Цена</div>
                            <div className="text-gold-500 font-semibold text-sm sm:text-base">
                              {property.price}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-dark/50 rounded-lg border border-gold-500/10">
                          <Square size={18} className="text-gold-500" />
                          <div>
                            <div className="text-xs text-white/60">Площадь</div>
                            <div className="text-white font-semibold text-sm sm:text-base">
                              {property.areaM2} м² / {property.areaSqft} sqft
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-4 ml-11">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property.type === 'sale'
                              ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {property.type === 'sale' ? 'Продажа' : 'Аренда'}
                        </span>
                        <div className="flex items-center gap-1.5 text-white/60 text-sm">
                          <ImageIcon size={14} />
                          <span>{property.images.length} фото</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:flex-col sm:gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gold-500/20 text-gold-500 rounded-lg hover:bg-gold-500/30 transition-all duration-300 border border-gold-500/20 hover:border-gold-500/40"
                        aria-label="Редактировать"
                      >
                        <Edit size={18} />
                        <span className="sm:hidden">Изменить</span>
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                        aria-label="Удалить"
                      >
                        <Trash2 size={18} />
                        <span className="sm:hidden">Удалить</span>
                      </button>
                    </div>
                  </div>

                  {property.images.length > 0 && (
                    <div className="mt-4 ml-11">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {property.images.slice(0, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-gold-500/20"
                          >
                            <Image
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {idx === 3 && property.images.length > 4 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  +{property.images.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-gradient-to-br from-dark-lighter to-dark border border-gold-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-gold-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gold-500/20 rounded-lg">
                <Settings className="text-gold-500" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-gold-500">
                Управление контактами Footer
              </h2>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <Phone size={16} className="text-gold-500" />
                    Телефон
                  </label>
                  <input
                    type="text"
                    value={contacts.phone}
                    onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="+971 50 123 45 67"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <Phone size={16} className="text-gold-500" />
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={contacts.whatsapp}
                    onChange={(e) => setContacts({ ...contacts, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="+971 55 230 7377"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <Mail size={16} className="text-gold-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={contacts.email}
                    onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="info@crownlineproperty.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <MapPin size={16} className="text-gold-500" />
                    Адрес
                  </label>
                  <textarea
                    value={contacts.address}
                    onChange={(e) => setContacts({ ...contacts, address: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
                    rows={2}
                    placeholder="Dubai, Boulevard Plaza, tower 1, 20 floor, office 2003"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <Facebook size={16} className="text-gold-500" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={contacts.facebook}
                    onChange={(e) => setContacts({ ...contacts, facebook: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <Instagram size={16} className="text-gold-500" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={contacts.instagram}
                    onChange={(e) => setContacts({ ...contacts, instagram: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    <Twitter size={16} className="text-gold-500" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={contacts.twitter}
                    onChange={(e) => setContacts({ ...contacts, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
                    Копирайт
                  </label>
                  <input
                    type="text"
                    value={contacts.copyright}
                    onChange={(e) => setContacts({ ...contacts, copyright: e.target.value })}
                    className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    placeholder="© 2020 CROWN LINE PROPERTY."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gold-500/20">
                <button
                  onClick={handleSaveContacts}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
                >
                  <Save size={18} />
                  Сохранить контакты
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PropertyForm({
  formData,
  setFormData,
  newImageUrl,
  setNewImageUrl,
  addImage,
  handleFileUpload,
  removeImage,
  onSave,
  onCancel,
}: {
  formData: Partial<Property>
  setFormData: (data: Partial<Property>) => void
  newImageUrl: string
  setNewImageUrl: (url: string) => void
  addImage: () => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            <Home size={16} className="text-gold-500" />
            Название *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            placeholder="Пентхаус с видом на Burj Khalifa"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            <MapPin size={16} className="text-gold-500" />
            Локация *
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            placeholder="Downtown Dubai"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            <DollarSign size={16} className="text-gold-500" />
            Цена *
          </label>
          <input
            type="text"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            placeholder="AED 15,000,000"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            Тип
          </label>
          <select
            value={formData.type || 'sale'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rental' })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
          >
            <option value="sale">Продажа</option>
            <option value="rental">Аренда</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            <Square size={16} className="text-gold-500" />
            Площадь (м²)
          </label>
          <input
            type="text"
            value={formData.areaM2 || ''}
            onChange={(e) => setFormData({ ...formData, areaM2: e.target.value })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            placeholder="450"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            <Square size={16} className="text-gold-500" />
            Площадь (sqft)
          </label>
          <input
            type="text"
            value={formData.areaSqft || ''}
            onChange={(e) => setFormData({ ...formData, areaSqft: e.target.value })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            placeholder="4844"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 mb-2 font-medium">
            <Bed size={16} className="text-gold-500" />
            Количество спален
          </label>
          <input
            type="number"
            value={formData.bedrooms || 0}
            onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-white/80 mb-3 font-medium">
          <ImageIcon size={16} className="text-gold-500" />
          Фотографии
        </label>
        
        {/* Загрузка через URL */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addImage()}
            className="flex-1 px-4 py-3 bg-dark/50 border border-gold-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            placeholder="URL изображения"
          />
          <button
            onClick={addImage}
            className="px-4 sm:px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20"
          >
            Добавить URL
          </button>
        </div>

        {/* Загрузка файлов */}
        <div className="mb-3">
          <label className="block w-full">
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-dark/50 border-2 border-dashed border-gold-500/30 rounded-lg cursor-pointer hover:border-gold-500/50 hover:bg-dark/70 transition-all duration-300">
              <Upload size={20} className="text-gold-500" />
              <span className="text-white/80 font-medium">
                Выберите файлы или перетащите их сюда
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-white/50 text-xs mt-2 text-center">
            Поддерживаются форматы: JPG, PNG, GIF, WebP (макс. 5MB на файл)
          </p>
        </div>

        {/* Галерея изображений */}
        {(formData.images || []).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(formData.images || []).map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gold-500/30">
                <Image
                  src={img}
                  alt={`Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeImage(idx)}
                    className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                    aria-label="Удалить изображение"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gold-500/20">
        <button
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
        >
          <Save size={18} />
          Сохранить
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-dark/50 border border-gold-500/30 text-white font-semibold rounded-lg hover:bg-dark/70 hover:border-gold-500/50 transition-all duration-300"
        >
          Отмена
        </button>
      </div>
    </div>
  )
}
