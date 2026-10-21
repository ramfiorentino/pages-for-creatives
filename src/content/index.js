import sharedEn from './shared/en.js'
import sharedEs from './shared/es.js'
import overviewEn from './overview/en.js'
import overviewEs from './overview/es.js'
import landingEn from './landing-page/en.js'
import landingEs from './landing-page/es.js'
import portfolioEn from './portfolio/en.js'
import portfolioEs from './portfolio/es.js'
import epkEn from './epk/en.js'
import epkEs from './epk/es.js'
import retainerEn from './retainer/en.js'
import retainerEs from './retainer/es.js'
import editingEn from './editing/en.js'
import editingEs from './editing/es.js'
import linksEn from './links/en.js'
import linksEs from './links/es.js'
import contentSystemEn from './content-system/en.js'
import contentSystemEs from './content-system/es.js'

// Only local development (npm run dev) shows drafts.
const SHOW_DRAFTS = import.meta.env?.DEV ?? false

export const LANGS = ['es', 'en']
export const DEFAULT_LANG = 'es'

export const SHARED = { en: sharedEn, es: sharedEs }

export const CONTENT = {
  'overview':     { en: overviewEn,  es: overviewEs },
  'landing-page': { en: landingEn,   es: landingEs },
  'portfolio':    { en: portfolioEn, es: portfolioEs },
  'epk':          { en: epkEn,       es: epkEs },
  'retainer':     { en: retainerEn,  es: retainerEs },
  'editing':      { en: editingEn,   es: editingEs },

  // DRAFTS: offers that aren't ready to sell yet. The production build leaves
  // them out completely (menu, overview, pages and text).
  // To publish one, move its line up into the list above.
  ...(SHOW_DRAFTS ? {
    'links':          { en: linksEn,         es: linksEs },
    'content-system': { en: contentSystemEn, es: contentSystemEs },
  } : {}),
}

// Order here is the order in the offers menu and on the overview page.
export const OFFERS = ['landing-page', 'portfolio', 'epk', 'retainer', 'editing', 'links', 'content-system']
  .filter(slug => slug in CONTENT)
