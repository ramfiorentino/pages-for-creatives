import bgVideo from '../assets/y2cute/y2cute_bg-moshed.webm'
import s12 from '../assets/y2cute/drag and drop/1 (12).png'
import s18 from '../assets/y2cute/drag and drop/1 (18).png'
import s19 from '../assets/y2cute/drag and drop/1 (19).png'
import s20 from '../assets/y2cute/drag and drop/1 (20).png'
import s6  from '../assets/y2cute/drag and drop/1 (6).png'

const STICKERS = [
  { src: s12, x: 0.04, y: 0.08,  size: 105 },
  { src: s18, x: 0.76, y: 0.05,  size: 95  },
  { src: s19, x: 0.86, y: 0.50,  size: 115 },
  { src: s20, x: 0.03, y: 0.65,  size: 90  },
  { src: s6,  x: 0.44, y: 0.82,  size: 100 },
]

let _video    = null
let _stickers = []
let _zTop     = 200
let _svg      = null
let _turb     = null
let _animId   = null

export function initY2cute() {
  if (_video) return

  // ── Video background ──────────────────────────────────────
  _video = document.createElement('video')
  _video.id        = 'y2cute-video'
  _video.src       = bgVideo
  _video.autoplay  = true
  _video.loop      = true
  _video.muted     = true
  _video.playsInline = true
  document.body.prepend(_video)
  _video.play().catch(() => {})

  // ── SVG displacement filter ───────────────────────────────
  _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  _svg.setAttribute('id', 'y2cute-filters')
  _svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
  _svg.innerHTML = `
    <defs>
      <filter id="y2cute-wave" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="linearRGB">
        <feTurbulence type="turbulence" baseFrequency="0.025 0.018" numOctaves="3" seed="7" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  `
  document.body.prepend(_svg)
  _turb = _svg.querySelector('feTurbulence')
  _animateFilter()

  // ── Stickers ──────────────────────────────────────────────
  const W = window.innerWidth
  const H = window.innerHeight

  for (const { src, x, y, size } of STICKERS) {
    const img = document.createElement('img')
    img.src       = src
    img.draggable = false
    Object.assign(img.style, {
      position:   'fixed',
      left:       Math.round(x * W) + 'px',
      top:        Math.round(y * H) + 'px',
      width:      size + 'px',
      height:     'auto',
      zIndex:     String(++_zTop),
      userSelect: 'none',
      cursor:     'grab',
    })
    _makeDraggable(img)
    document.body.appendChild(img)
    _stickers.push(img)
  }
}

export function destroyY2cute() {
  if (_video) { _video.pause(); _video.remove(); _video = null }

  if (_animId) { cancelAnimationFrame(_animId); _animId = null }
  if (_svg)    { _svg.remove(); _svg = null; _turb = null }

  for (const el of _stickers) { el._undrag?.(); el.remove() }
  _stickers = []
}

// ── Slowly morph the wave so borders feel alive ───────────────
function _animateFilter() {
  const t = performance.now() * 0.00012
  if (_turb) {
    const bfx = (0.025 + Math.sin(t)        * 0.008).toFixed(5)
    const bfy = (0.018 + Math.cos(t * 0.75) * 0.006).toFixed(5)
    _turb.setAttribute('baseFrequency', `${bfx} ${bfy}`)
  }
  _animId = requestAnimationFrame(_animateFilter)
}

// ── Drag & drop ───────────────────────────────────────────────
function _makeDraggable(el) {
  let active = false
  let ox = 0, oy = 0

  function start(clientX, clientY) {
    active = true
    const r = el.getBoundingClientRect()
    ox = clientX - r.left
    oy = clientY - r.top
    el.style.zIndex = String(++_zTop)
    el.style.cursor = 'grabbing'
  }
  function move(clientX, clientY) {
    if (!active) return
    el.style.left = (clientX - ox) + 'px'
    el.style.top  = (clientY - oy) + 'px'
  }
  function end() {
    if (!active) return
    active = false
    el.style.cursor = 'grab'
  }

  const onMouseDown  = e => { e.preventDefault(); start(e.clientX, e.clientY) }
  const onMouseMove  = e => move(e.clientX, e.clientY)
  const onMouseUp    = ()  => end()
  const onTouchStart = e => { e.preventDefault(); const t = e.touches[0]; start(t.clientX, t.clientY) }
  const onTouchMove  = e => { if (!active) return; e.preventDefault(); const t = e.touches[0]; move(t.clientX, t.clientY) }
  const onTouchEnd   = ()  => end()

  el.addEventListener('mousedown',  onMouseDown)
  el.addEventListener('touchstart', onTouchStart, { passive: false })
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup',   onMouseUp)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend',  onTouchEnd)

  el._undrag = () => {
    el.removeEventListener('mousedown',  onMouseDown)
    el.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup',   onMouseUp)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend',  onTouchEnd)
  }
}
