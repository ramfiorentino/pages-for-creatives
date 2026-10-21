import '../styles/fonts.css'
import '../styles/themes.css'
import '../styles/base.css'
import '../styles/nav.css'
import '../styles/hero.css'
import '../styles/components.css'
import '../styles/sections.css'
import '../styles/mobile.css'
import '../styles/installation.css'
import '../styles/y2cute.css'
import '../styles/offers.css'

import { setTheme as _setTheme } from './theme.js'
import { applyLang, toggleLang } from './i18n.js'
import { LANGS, DEFAULT_LANG } from '../content/index.js'
import { initNav } from './nav.js'
import { THEMES, parsePath, pathFor } from './route.js'
import { initAnimations } from './animations.js'
import { initFaq } from './faq.js'
import { initInstallation, destroyInstallation } from './installation.js'
import { initY2cute, destroyY2cute } from './y2cute.js'

const { offer } = parsePath(window.location.pathname)

// Shared lifecycle handler — used by both setTheme and popstate
function _applyTheme(t) {
  const prev = document.documentElement.getAttribute('data-theme')
  _setTheme(t)
  if (prev === 'installation' && t !== 'installation') destroyInstallation()
  if (t === 'installation' && prev !== 'installation') initInstallation()
  if (prev === 'y2cute' && t !== 'y2cute') destroyY2cute()
  if (t === 'y2cute' && prev !== 'y2cute') initY2cute()
}

// Public API — called by pip buttons in the HTML
window.setTheme = (t) => {
  if (!THEMES.includes(t)) return
  _applyTheme(t)
  history.pushState({ theme: t }, '', pathFor(offer, t))
}

// Browser back / forward
window.addEventListener('popstate', () => {
  const { theme } = parsePath(window.location.pathname)
  if (theme) _applyTheme(theme)
})

window.toggleLang = toggleLang

// ── Boot: URL path takes priority → localStorage → default 'studio' ──
let bootTheme = parsePath(window.location.pathname).theme

if (!bootTheme) {
  try {
    const saved = localStorage.getItem('rf-theme')
    if (saved && THEMES.includes(saved)) bootTheme = saved
  } catch (e) {}
}

if (!bootTheme) bootTheme = 'studio'

// Apply and sync URL (replaceState so the boot doesn't pollute history)
document.documentElement.setAttribute('data-theme', bootTheme)
history.replaceState({ theme: bootTheme }, '', pathFor(offer, bootTheme) + window.location.hash)

let bootLang = DEFAULT_LANG
try {
  const savedLang = localStorage.getItem('rf-lang')
  if (LANGS.includes(savedLang)) bootLang = savedLang
} catch (e) {}
applyLang(bootLang, offer)

// Boot canvas scenes if active on load
if (bootTheme === 'installation') initInstallation()
if (bootTheme === 'y2cute') initY2cute()

initNav()
initAnimations()
initFaq()
