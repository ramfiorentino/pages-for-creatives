export function initAnimations() {
  // Hero elements stagger in on load
  document.querySelectorAll('#hero .fu').forEach((el, i) => {
    setTimeout(() => el.classList.add('on'), 60 + i * 110)
  })

  // All other .fu elements animate on scroll
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.fu:not(.on)'))
      setTimeout(() => e.target.classList.add('on'), siblings.indexOf(e.target) * 75)
      obs.unobserve(e.target)
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('section:not(#hero) .fu').forEach(el => obs.observe(el))
}
