export function initNav() {
  const nav   = document.getElementById('nav')
  const swFix = document.getElementById('sw-fixed')
  const hero  = document.getElementById('hero')

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50)
    swFix.classList.toggle('show', window.scrollY > hero.offsetHeight - 100)
  }, { passive: true })
}
