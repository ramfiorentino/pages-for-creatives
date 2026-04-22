import '../styles/themes.css'
import '../styles/base.css'
import '../styles/nav.css'
import '../styles/hero.css'
import '../styles/components.css'
import '../styles/sections.css'
import '../styles/mobile.css'

import { setTheme } from './theme.js'
import { applyLang, toggleLang } from './i18n.js'
import { initNav } from './nav.js'
import { initAnimations } from './animations.js'
import { initFaq } from './faq.js'

// Restore saved preferences before anything renders
try {
  const savedTheme = localStorage.getItem('rf-theme')
  if (savedTheme && ['studio', 'signal', 'print'].includes(savedTheme)) {
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
  const savedLang = localStorage.getItem('rf-lang')
  if (savedLang && ['es', 'en'].includes(savedLang)) {
    applyLang(savedLang)
  }
} catch(e) {}

// Expose to global scope for inline onclick handlers in HTML
window.setTheme = setTheme
window.toggleLang = toggleLang

initNav()
initAnimations()
initFaq()
