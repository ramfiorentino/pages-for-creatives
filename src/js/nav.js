export function initNav() {
  const nav   = document.getElementById('nav')
  const swFix = document.getElementById('sw-fixed')
  const hero  = document.getElementById('hero')

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50)
    swFix.classList.toggle('show', window.scrollY > hero.offsetHeight - 100)
  }, { passive: true })

  initOffersMenu()
}

function initOffersMenu() {
  const btn  = document.getElementById('offers-btn')
  const menu = document.getElementById('offers-menu')

  const setOpen = open => {
    btn.setAttribute('aria-expanded', String(open))
    menu.hidden = !open
  }

  btn.addEventListener('click', () => setOpen(menu.hidden))

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false)
      btn.focus()
    }
  })

  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) setOpen(false)
  })
}
