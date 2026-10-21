// Fills the page with one offer's text. Takes the document as a parameter so the
// same code runs in the browser and in scripts/prerender.js at build time.
import { OFFERS, CONTENT, SHARED } from '../content/index.js'
import { pathFor } from './route.js'

export const SITE_URL = 'https://offers.ramfiorentino.com'

// Missing keys fall back to English, then to the shared text.
export function t(offer, lang, key) {
  const own = CONTENT[offer]
  return own[lang][key] ?? own.en[key] ?? SHARED[lang][key] ?? SHARED.en[key]
}

const plain = html => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')

function setHidden(el, hidden) {
  if (hidden) el.setAttribute('hidden', '')
  else el.removeAttribute('hidden')
}

function setMeta(doc, selector, value) {
  const el = doc.querySelector(selector)
  if (el) el.setAttribute(el.hasAttribute('href') ? 'href' : 'content', value)
}

export function render(doc, offer, lang) {
  const tr = key => t(offer, lang, key)
  const html = doc.documentElement
  html.setAttribute('lang', lang)
  html.setAttribute('data-offer', offer)

  // Text: elements whose key this offer doesn't have are hidden.
  doc.querySelectorAll('[data-i18n]').forEach(el => {
    const value = tr(el.getAttribute('data-i18n'))
    setHidden(el, value === undefined)
    if (value !== undefined) el.innerHTML = value
  })
  // Whole sections, cards and list items that depend on one key.
  doc.querySelectorAll('[data-requires]').forEach(el => {
    setHidden(el, tr(el.getAttribute('data-requires')) === undefined)
  })

  const menu = doc.getElementById('offers-menu-list')
  if (menu) {
    menu.innerHTML = ['overview', ...OFFERS].map(o => {
      const label = o === 'overview' ? tr('menu.all') : t(o, lang, 'offer.name')
      const current = o === offer ? ' aria-current="page"' : ''
      return `<li><a href="${pathFor(o)}"${current}>${label}</a></li>`
    }).join('')
  }

  const list = doc.getElementById('offer-list')
  if (list) {
    list.innerHTML = OFFERS.map((o, i) => `
      <li class="offer-row">
        <a href="${pathFor(o)}">
          <span class="offer-n">0${i + 1}</span>
          <span class="offer-body">
            <span class="offer-name">${t(o, lang, 'offer.name')}</span>
            <span class="offer-for">${t(o, lang, 'offer.for')}</span>
          </span>
          <span class="offer-price">${t(o, lang, 'offer.price')}</span>
          <span class="offer-go">${tr('offers.cta')} →</span>
        </a>
      </li>`).join('')
  }

  const langBtn = doc.getElementById('lang-btn')
  if (langBtn) langBtn.textContent = lang === 'es' ? 'EN' : 'ES'

  const title = offer === 'overview'
    ? `Ram Fiorentino — ${plain(tr('hero.tag')).split(' · ')[0]}`
    : `${plain(tr('offer.name'))} — Ram Fiorentino`
  const description = plain(tr('hero.sub'))
  const url = SITE_URL + pathFor(offer)
  doc.title = title
  setMeta(doc, 'meta[name="description"]', description)
  setMeta(doc, 'meta[property="og:title"]', title)
  setMeta(doc, 'meta[property="og:description"]', description)
  setMeta(doc, 'meta[property="og:url"]', url)
  setMeta(doc, 'link[rel="canonical"]', url)
}
