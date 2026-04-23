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

import { setTheme as _setTheme } from './theme.js'
import { applyLang, toggleLang } from './i18n.js'
import { initNav } from './nav.js'
import { initAnimations } from './animations.js'
import { initFaq } from './faq.js'
import { initInstallation, destroyInstallation } from './installation.js'
import { initY2cute, destroyY2cute } from './y2cute.js'

const VALID_THEMES = ['studio', 'y2cute', 'installation']
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') // '' in dev, '/pages-for-creatives' on GH Pages

function themeFromPath() {
  const path = window.location.pathname.slice(BASE.length).replace(/^\//, '')
  const seg = path.split('/')[0].toLowerCase()
  return VALID_THEMES.includes(seg) ? seg : null
}

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
  if (!VALID_THEMES.includes(t)) return
  _applyTheme(t)
  history.pushState({ theme: t }, '', `${BASE}/${t}`)
}

// Browser back / forward
window.addEventListener('popstate', () => {
  const t = themeFromPath()
  if (t) _applyTheme(t)
})

window.toggleLang = toggleLang

// ── Boot: URL path takes priority → localStorage → default 'studio' ──
const urlTheme = themeFromPath()
let bootTheme = urlTheme

if (!bootTheme) {
  try {
    const saved = localStorage.getItem('rf-theme')
    if (saved && VALID_THEMES.includes(saved)) bootTheme = saved
  } catch (e) {}
}

if (!bootTheme) bootTheme = 'studio'

// Apply and sync URL (replaceState so the boot doesn't pollute history)
document.documentElement.setAttribute('data-theme', bootTheme)
history.replaceState({ theme: bootTheme }, '', `${BASE}/${bootTheme}`)

try {
  const savedLang = localStorage.getItem('rf-lang')
  if (savedLang && ['es', 'en'].includes(savedLang)) applyLang(savedLang)
} catch (e) {}

// Boot canvas scenes if active on load
if (bootTheme === 'installation') initInstallation()
if (bootTheme === 'y2cute') initY2cute()

initNav()
initAnimations()
initFaq()
