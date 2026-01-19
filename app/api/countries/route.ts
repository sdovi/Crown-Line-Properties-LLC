import { NextResponse } from 'next/server'

// Карта телефонных кодов для стран
const dialCodeMap: Record<string, string> = {
  AE: '+971', // ОАЭ
  RU: '+7',   // Россия
  US: '+1',   // США
  GB: '+44',  // Великобритания
  SA: '+966', // Саудовская Аравия
  QA: '+974', // Катар
  KW: '+965', // Кувейт
  OM: '+968', // Оман
  BH: '+973', // Бахрейн
  CN: '+86',  // Китай
  IN: '+91',  // Индия
  FR: '+33',  // Франция
  DE: '+49',  // Германия
  IT: '+39',  // Италия
  ES: '+34',  // Испания
  JP: '+81',  // Япония
  KR: '+82',  // Южная Корея
  BR: '+55',  // Бразилия
  CA: '+1',   // Канада
  AU: '+61',  // Австралия
  TR: '+90',  // Турция
  EG: '+20',  // Египет
  ID: '+62',  // Индонезия
  MY: '+60',  // Малайзия
  TH: '+66',  // Таиланд
  SG: '+65',  // Сингапур
  PH: '+63',  // Филиппины
  VN: '+84',  // Вьетнам
  PK: '+92',  // Пакистан
  BD: '+880', // Бангладеш
  IR: '+98',  // Иран
  IQ: '+964', // Ирак
  JO: '+962', // Иордания
  LB: '+961', // Ливан
  SY: '+963', // Сирия
  YE: '+967', // Йемен
  IL: '+972', // Израиль
  CY: '+357', // Кипр
  GR: '+30',  // Греция
  PT: '+351', // Португалия
  NL: '+31',  // Нидерланды
  BE: '+32',  // Бельгия
  CH: '+41',  // Швейцария
  AT: '+43',  // Австрия
  SE: '+46',  // Швеция
  NO: '+47',  // Норвегия
  DK: '+45',  // Дания
  FI: '+358', // Финляндия
  PL: '+48',  // Польша
  CZ: '+420', // Чехия
  HU: '+36',  // Венгрия
  RO: '+40',  // Румыния
  UA: '+380', // Украина
  BY: '+375', // Беларусь
  KZ: '+7',   // Казахстан
  UZ: '+998', // Узбекистан
  AF: '+93',  // Афганистан
  // Добавьте больше кодов по необходимости
}

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

// Получаем телефонный код из карты
function getDialCode(cca2: string): string {
  return dialCodeMap[cca2] || ''
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Получаем все страны из Rest Countries API
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags')
    
    if (!response.ok) {
      throw new Error('Failed to fetch countries')
    }

    const countriesData = await response.json()

    // Преобразуем данные в нужный формат
    const countries: Country[] = countriesData
      .map((country: any) => {
        const dialCode = getDialCode(country.cca2)
        // Пропускаем страны без телефонного кода
        if (!dialCode) return null

        // Получаем название на русском или английском
        const name = country.name.common
        
        // Создаем флаг из кода страны (emoji флаг)
        const flag = getFlagEmoji(country.cca2)

        return {
          code: country.cca2,
          name: name,
          dialCode: dialCode,
          flag: flag,
        }
      })
      .filter((country: Country | null) => country !== null)
      .sort((a: Country, b: Country) => {
        // Сортируем: сначала ОАЭ, затем остальные по алфавиту
        if (a.code === 'AE') return -1
        if (b.code === 'AE') return 1
        return a.name.localeCompare(b.name, 'ru')
      })

    // Фильтруем по поисковому запросу, если есть
    let filteredCountries = countries
    if (search) {
      filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.dialCode.includes(search)
      )
    }

    return NextResponse.json({ countries: filteredCountries })
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке стран' },
      { status: 500 }
    )
  }
}

// Функция для получения emoji флага из кода страны
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
