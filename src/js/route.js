import { OFFERS } from '../content/index.js'

export const THEMES = ['studio', 'y2cute', 'installation']

// URLs: "/" is the overview, "/<offer>/<theme>" an offer page.
// "/<theme>" is the old single-offer URL and maps to the landing page offer.
export function parsePath(pathname) {
  const [first, second] = pathname.toLowerCase().split('/').filter(Boolean)
  if (OFFERS.includes(first)) return { offer: first, theme: THEMES.includes(second) ? second : null }
  if (THEMES.includes(first)) return { offer: 'landing-page', theme: first }
  return { offer: 'overview', theme: null }
}

export function pathFor(offer, theme) {
  if (offer === 'overview') return '/'
  return theme ? `/${offer}/${theme}` : `/${offer}/`
}
