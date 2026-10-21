// Writes a real HTML file for every URL so each offer has its own title and
// link preview, and GitHub Pages answers 200 instead of falling back to 404.html.
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { parseHTML } from 'linkedom'
import { OFFERS, DEFAULT_LANG } from '../src/content/index.js'
import { THEMES, pathFor } from '../src/js/route.js'
import { render } from '../src/js/render.js'

const template = readFileSync('dist/index.html', 'utf8')

function write(path, offer, theme) {
  const { document } = parseHTML(template)
  if (theme) document.documentElement.setAttribute('data-theme', theme)
  render(document, offer, DEFAULT_LANG)
  const file = `dist${path}${path.endsWith('/') ? '' : '/'}index.html`
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, '<!DOCTYPE html>\n' + document.documentElement.outerHTML)
}

write('/', 'overview')
for (const offer of OFFERS) {
  write(pathFor(offer), offer)
  for (const theme of THEMES) write(pathFor(offer, theme), offer, theme)
}
// Old single-offer links (/studio, /y2cute) keep working.
for (const theme of THEMES) write(`/${theme}`, 'landing-page', theme)

console.log(`prerendered ${1 + OFFERS.length * (THEMES.length + 1) + THEMES.length} pages`)
