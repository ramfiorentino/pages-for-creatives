export function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open')
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
      if (!isOpen) item.classList.add('open')
    })
  })
}
