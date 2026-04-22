export function setTheme(t) {
  const h = document.documentElement
  h.classList.add('is-switching')
  h.setAttribute('data-theme', t)
  try { localStorage.setItem('rf-theme', t) } catch(e) {}
  setTimeout(() => h.classList.remove('is-switching'), 450)
}
