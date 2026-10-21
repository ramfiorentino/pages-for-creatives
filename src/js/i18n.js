import { DEFAULT_LANG } from '../content/index.js'
import { render } from './render.js'

export let currentLang = DEFAULT_LANG
let currentOffer = 'overview'

export function applyLang(l, offer = currentOffer) {
  currentLang = l
  currentOffer = offer
  render(document, offer, l)
  document.querySelectorAll('a[href^="mailto"]').forEach(a => {
    a.href = l === 'es'
      ? 'mailto:ramfiorentino@proton.me?subject=Llamada intro — sitio web para creativos'
      : 'mailto:ramfiorentino@proton.me?subject=Intro call — website for creatives'
  })
}

export function toggleLang() {
  applyLang(currentLang === 'es' ? 'en' : 'es')
  try { localStorage.setItem('rf-lang', currentLang) } catch(e) {}
}
