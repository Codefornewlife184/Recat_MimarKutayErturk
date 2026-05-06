const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const distIndexPath = path.join(distDir, 'index.html')

function runViteBuild() {
  const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js')
  const result = spawnSync(process.execPath, [viteBin, 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

function isExternalUrl(src) {
  return /^(https?:)?\/\//i.test(src)
}

function readSourceScript(src) {
  const normalizedSrc = src.replace(/[?#].*$/, '').replace(/^\//, '')
  return fs.readFileSync(path.join(projectRoot, normalizedSrc), 'utf8')
}

function bundleLegacyScripts() {
  if (!fs.existsSync(distIndexPath)) return

  let html = fs.readFileSync(distIndexPath, 'utf8')
  const scriptRegex = /<script\b([^>]*?)src="([^"]+)"([^>]*)><\/script>/g
  const matches = Array.from(html.matchAll(scriptRegex)).map((match) => ({
    full: match[0],
    attrsBefore: match[1] || '',
    src: match[2],
    attrsAfter: match[3] || '',
    start: match.index,
    end: match.index + match[0].length,
  }))

  const groups = []
  let currentGroup = null

  for (const match of matches) {
    const attrs = `${match.attrsBefore} ${match.attrsAfter}`
    const isModule = /type\s*=\s*["']module["']/i.test(attrs)
    const isBundleCandidate = !isModule && !isExternalUrl(match.src) && /\.js(?:[?#].*)?$/i.test(match.src)

    if (!isBundleCandidate) {
      currentGroup = null
      continue
    }

    if (!currentGroup) {
      currentGroup = []
      groups.push(currentGroup)
    }

    currentGroup.push(match)
  }

  const replacements = []

  groups.forEach((group, index) => {
    if (!group.length) return

    const combinedContent = group
      .map((entry) => {
        const source = readSourceScript(entry.src)
        return `/* ${entry.src} */\n${source.trim()}\n`
      })
      .join('\n;\n')

    const hash = crypto.createHash('md5').update(combinedContent).digest('hex').slice(0, 10)
    const fileName = `legacy-${index + 1}-${hash}.js`
    const outputPath = path.join(distDir, 'assets', fileName)
    const indentMatch = html.slice(0, group[0].start).match(/(^|\n)([ \t]*)$/)
    const indent = indentMatch ? indentMatch[2] : '    '

    fs.writeFileSync(outputPath, `${combinedContent}\n`, 'utf8')

    replacements.push({
      start: group[0].start,
      end: group[group.length - 1].end,
      value: `${indent}<script src="/assets/${fileName}"></script>`,
    })
  })

  replacements
    .sort((a, b) => b.start - a.start)
    .forEach((replacement) => {
      html = `${html.slice(0, replacement.start)}${replacement.value}${html.slice(replacement.end)}`
    })

  fs.writeFileSync(distIndexPath, html, 'utf8')
}

runViteBuild()
bundleLegacyScripts()
