import es from '../i18n/es.js'
import en from '../i18n/en.js'

const T = { es, en }
export let currentLang = 'es'

export function applyLang(l) {
  currentLang = l
  document.documentElement.setAttribute('lang', l)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n')
    if (T[l][k] !== undefined) el.innerHTML = T[l][k]
  })
  document.getElementById('lang-btn').textContent = l === 'es' ? 'EN' : 'ES'
  document.querySelectorAll('a[href^="mailto"]').forEach(a => {
    a.href = l === 'es'
      ? 'mailto:ramonx.nwn@gmail.com?subject=Llamada intro — sitio web para creativos'
      : 'mailto:ramonx.nwn@gmail.com?subject=Intro call — website for creatives'
  })
}

export function toggleLang() {
  applyLang(currentLang === 'es' ? 'en' : 'es')
  try { localStorage.setItem('rf-lang', currentLang) } catch(e) {}
}
