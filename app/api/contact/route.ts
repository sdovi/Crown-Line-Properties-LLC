import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, message } = body

    // Validate required fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    // Telegram Bot API integration
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Telegram credentials not configured')
      // In development, just log the data
      console.log('Form submission:', { name, phone, email, message })
      return NextResponse.json({ success: true, message: 'Заявка получена (dev mode)' })
    }

    const text = `
🆕 Новая заявка с сайта CROWN LINE PROPERTY

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
${message ? `💬 Сообщение: ${message}` : ''}

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

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Ошибка при отправке заявки' },
      { status: 500 }
    )
  }
}

