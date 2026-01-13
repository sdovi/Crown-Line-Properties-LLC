const fs = require('fs')
const path = require('path')

// Функция для рекурсивного поиска HTML файлов
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList)
    } else if (file.endsWith('.html')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Исправление путей в HTML файлах
function fixPaths() {
  const outDir = path.join(__dirname, '..', 'out')
  
  if (!fs.existsSync(outDir)) {
    console.error('Папка out не найдена! Сначала выполните npm run build')
    process.exit(1)
  }

  const htmlFiles = findHtmlFiles(outDir)
  
  console.log(`Найдено ${htmlFiles.length} HTML файлов для обработки...`)

  htmlFiles.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8')
    const originalContent = content

    // Определяем относительный путь от файла до корня out/
    const fileDir = path.normalize(path.dirname(filePath))
    const normalizedOutDir = path.normalize(outDir)
    
    // Вычисляем префикс пути
    let pathPrefix = './'
    
    // Если файл не в корне out/, нужно подняться на уровень выше
    if (fileDir !== normalizedOutDir) {
      // Вычисляем относительный путь от директории файла до корня out/
      const relativePath = path.relative(fileDir, normalizedOutDir)
      // Подсчитываем количество уровней вложенности
      const depth = relativePath === '' ? 0 : relativePath.split(path.sep).filter(p => p === '..').length
      if (depth === 0) {
        // Файл в корне
        pathPrefix = './'
      } else {
        // Файл в подпапке, нужно подняться наверх
        pathPrefix = '../'.repeat(depth)
      }
    }
    
    // Нормализуем разделители путей для веб (используем /)
    pathPrefix = pathPrefix.replace(/\\/g, '/')

    // Заменяем абсолютные пути на относительные в атрибутах href и src
    content = content.replace(/href="\/_next\//g, `href="${pathPrefix}_next/`)
    content = content.replace(/src="\/_next\//g, `src="${pathPrefix}_next/`)
    content = content.replace(/href="\/logo\.jpg/g, `href="${pathPrefix}logo.jpg`)
    content = content.replace(/src="\/logo\.jpg/g, `src="${pathPrefix}logo.jpg`)
    
    // Исправляем пути в JSON данных и скриптах (более аккуратно)
    // Заменяем только если это не часть URL (http://, https://)
    content = content.replace(/([^:])"\/_next\//g, `$1"${pathPrefix}_next/`)
    content = content.replace(/([^:])"\/logo\.jpg/g, `$1"${pathPrefix}logo.jpg`)

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✓ Исправлен: ${path.relative(outDir, filePath)}`)
    }
  })

  console.log('\n✅ Все пути исправлены! Теперь можно открыть index.html в браузере.')
}

fixPaths()
