import * as THREE from 'three'
import terrazzoPng        from '../textures/installation/Terrazzo006_1K-JPG_Color.jpg'
import terrazzoNormalPng  from '../textures/installation/Terrazzo006_1K-JPG_NormalGL.jpg'
import terrazzoRoughPng   from '../textures/installation/Terrazzo006_1K-JPG_Roughness.jpg'
import plasterPng         from '../textures/installation/Plaster001_1K-JPG_Color.jpg'
import plasterNormalPng   from '../textures/installation/Plaster001_1K-JPG_NormalGL.jpg'
import plasterRoughPng    from '../textures/installation/Plaster001_1K-JPG_Roughness.jpg'
import bgSrc              from '../assets/installation/installation-bg2.gif'

let renderer    = null
let animationId = null
let cleanupFns  = []
let _arrow      = null
let _bgEl       = null

const CAM  = { x: -5.0, y: -3.5, z: 4.0 }
const LOOK = { x: 0.2,  y: -2.0, z: -2.8 }
const FOG_COLOR = 0xF2F2EE

export function initInstallation() {
  const canvas = document.getElementById('installation-canvas')
  if (!canvas || renderer) return

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(FOG_COLOR)
  scene.fog = new THREE.Fog(FOG_COLOR, 4, 22)

  const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 150)
  camera.position.set(CAM.x, CAM.y, CAM.z)

  const RW = 14, RH = 12, RD = 10
  const SLW = 3,  SLD = 4

  const wallLoader = new THREE.TextureLoader()
  function wallTex(src, repeat = [3, 2]) {
    const t = wallLoader.load(src)
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(...repeat)
    return t
  }
  const wallMat = new THREE.MeshStandardMaterial({
    map:          wallTex(plasterPng),
    normalMap:    wallTex(plasterNormalPng),
    roughnessMap: wallTex(plasterRoughPng),
    metalness: 0,
  })

  buildWalls(scene, wallMat, RW, RH, RD)
  buildCeilingWithSkylight(scene, wallMat, RW, RH, RD, SLW, SLD)
  buildFloor(scene, RW, RH, RD)
  buildLights(scene, RW, RH, RD)
  buildWallText(scene, RD, document.fonts.load('300 1em "LinealVF"'))

  const mouse        = { x: 0, y: 0 }
  const smooth       = { x: 0, y: 0 }
  const scrollTarget = { p: 0 }
  const scrollSmooth = { p: 0 }

  function onMouseMove(e) {
    mouse.x = e.clientX / window.innerWidth  - 0.5
    mouse.y = e.clientY / window.innerHeight - 0.5
  }
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  // ── Scroll: fade canvas out, pause rAF when hidden, fade bg in ──
  function onScroll() {
    const p = Math.min(window.scrollY / window.innerHeight, 1)
    scrollTarget.p = p

    canvas.style.opacity = String(1 - p)

    // pause Three.js render when canvas is fully off-screen
    if (p >= 0.99 && animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    } else if (p < 0.99 && !animationId) {
      animate()
    }

    if (_arrow) _arrow.style.opacity = String(Math.max(0, 1 - p * 5))

    if (_bgEl) {
      const imgP = Math.max(0, Math.min(1, (p - 0.45) / 0.55))
      _bgEl.style.opacity = String(imgP)
    }
  }

  // ── Scroll arrow ───────────────────────────────────────────
  _arrow = document.createElement('div')
  _arrow.id = 'install-scroll-arrow'
  _arrow.innerHTML = `<svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="9" y1="0" x2="9" y2="23" stroke="#1A1A1A" stroke-width="1.2"/>
    <polyline points="3,17 9,23 15,17" stroke="#1A1A1A" stroke-width="1.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`
  document.body.appendChild(_arrow)

  // ── Background GIF ─────────────────────────────────────────
  _bgEl = document.createElement('img')
  _bgEl.id  = 'install-bg-img'
  _bgEl.src = bgSrc
  _bgEl.alt = ''
  _bgEl.style.opacity = '0'
  document.body.appendChild(_bgEl)

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize',    onResize)
  window.addEventListener('scroll',    onScroll)
  cleanupFns = [
    () => window.removeEventListener('mousemove', onMouseMove),
    () => window.removeEventListener('resize',    onResize),
    () => window.removeEventListener('scroll',    onScroll),
  ]

  function animate() {
    animationId = requestAnimationFrame(animate)
    smooth.x += (mouse.x - smooth.x) * 0.04
    smooth.y += (mouse.y - smooth.y) * 0.04
    scrollSmooth.p += (scrollTarget.p - scrollSmooth.p) * 0.05

    camera.position.x = CAM.x + smooth.x * 0.8
    camera.position.y = CAM.y - smooth.y * 0.45 - scrollSmooth.p * 5.0
    camera.position.z = CAM.z + scrollSmooth.p * 2.5
    camera.lookAt(
      LOOK.x + smooth.x * 0.2,
      LOOK.y - smooth.y * 0.1 - scrollSmooth.p * 2.0,
      LOOK.z
    )
    renderer.render(scene, camera)
  }

  animate()
}

export function destroyInstallation() {
  if (animationId) { cancelAnimationFrame(animationId); animationId = null }
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  if (renderer) { renderer.dispose(); renderer = null }

  const canvas = document.getElementById('installation-canvas')
  if (canvas) { canvas.style.opacity = '' }

  if (_arrow) { _arrow.remove(); _arrow = null }
  if (_bgEl)  { _bgEl.remove();  _bgEl  = null }
}

// ── Room geometry ─────────────────────────────────────────────

function mkPlane(w, h, mat) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
}

function buildWalls(scene, mat, RW, RH, RD) {
  const back = mkPlane(RW, RH, mat)
  back.position.z = -RD / 2
  scene.add(back)

  const left = mkPlane(RD, RH, mat)
  left.rotation.y = Math.PI / 2
  left.position.x = -RW / 2
  scene.add(left)

  const right = mkPlane(RD, RH, mat)
  right.rotation.y = -Math.PI / 2
  right.position.x = RW / 2
  scene.add(right)
}

function buildCeilingWithSkylight(scene, mat, RW, RH, RD, SLW, SLD) {
  const ceilY = RH / 2

  const shape = new THREE.Shape()
  shape.moveTo(-RW / 2, -RD / 2)
  shape.lineTo( RW / 2, -RD / 2)
  shape.lineTo( RW / 2,  RD / 2)
  shape.lineTo(-RW / 2,  RD / 2)

  const hole = new THREE.Path()
  hole.moveTo(-SLW / 2, -SLD / 2)
  hole.lineTo( SLW / 2, -SLD / 2)
  hole.lineTo( SLW / 2,  SLD / 2)
  hole.lineTo(-SLW / 2,  SLD / 2)
  shape.holes.push(hole)

  const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = ceilY
  scene.add(ceiling)

  const skyMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, fog: false })
  const sky = mkPlane(SLW, SLD, skyMat)
  sky.rotation.x = Math.PI / 2
  sky.position.set(0, ceilY + 0.01, 0)
  scene.add(sky)
}

function buildFloor(scene, RW, RH, RD) {
  const loader = new THREE.TextureLoader()

  function tex(src, repeat = [5, 4]) {
    const t = loader.load(src)
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(...repeat)
    return t
  }

  const mat = new THREE.MeshStandardMaterial({
    map:          tex(terrazzoPng),
    normalMap:    tex(terrazzoNormalPng),
    roughnessMap: tex(terrazzoRoughPng),
    metalness: 0,
  })

  const floor = mkPlane(RW, RD, mat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -RH / 2
  scene.add(floor)
}

// ── Lighting ──────────────────────────────────────────────────

function buildLights(scene, RW, RH, RD) {
  scene.add(new THREE.AmbientLight(0xFFFFFF, 1.1))

  const spot = new THREE.SpotLight(0xFFFEFA, 6.0, RH * 2.2, Math.PI / 3.2, 0.95, 1.1)
  spot.position.set(0, RH / 2 + 1, 0)
  spot.target.position.set(0, -RH / 2, 0)
  scene.add(spot)
  scene.add(spot.target)

  ;[
    [-4, RH / 2 - 0.6, -1.5],
    [ 4, RH / 2 - 0.6, -1.5],
    [-4, RH / 2 - 0.6,  2.5],
    [ 4, RH / 2 - 0.6,  2.5],
  ].forEach(([x, y, z]) => {
    const pt = new THREE.PointLight(0xFFFEF8, 1.6, 24)
    pt.position.set(x, y, z)
    scene.add(pt)
  })

  const key = new THREE.DirectionalLight(0xFFFFFF, 0.18)
  key.position.set(0, 2, RD / 2)
  key.target.position.set(0, -1.5, -RD / 2)
  scene.add(key)
  scene.add(key.target)
}

// ── Wall text ─────────────────────────────────────────────────

function buildWallText(scene, RD, fontReady) {
  const CW   = 2048
  const CH   = 1024
  const FS   = 288
  const LEAD = FS * 0.9
  const MAXW = CW - 120

  const REGULAR = `300 ${FS}px "LinealVF", "Helvetica Neue", Helvetica, Arial, sans-serif`
  const ITALIC  = `300 italic ${FS}px "LinealVF", "Helvetica Neue", Helvetica, Arial, sans-serif`

  const tc  = document.createElement('canvas')
  tc.width  = CW
  tc.height = CH
  const ctx = tc.getContext('2d')

  function wrapText(text, font) {
    ctx.font = font
    const words = text.split(' ')
    const lines = []
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > MAXW && line) {
        lines.push({ text: line, font })
        line = word
      } else {
        line = test
      }
    }
    if (line) lines.push({ text: line, font })
    return lines
  }

  function draw() {
    ctx.clearRect(0, 0, CW, CH)
    ctx.fillStyle    = '#1A1A1A'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'

    const lines = [
      ...wrapText('A website as considered', REGULAR),
      ...wrapText('as your craft.', ITALIC),
    ]

    const blockH = lines.length * LEAD
    const startY = (CH - blockH) / 2 + LEAD / 2

    lines.forEach(({ text, font }, i) => {
      ctx.font = font
      ctx.fillText(text, CW / 2, startY + i * LEAD)
    })

    texture.needsUpdate = true
  }

  const texture = new THREE.CanvasTexture(tc)
  const planeW  = 13
  const planeH  = planeW / (CW / CH)

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(planeW, planeH),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
  )
  mesh.position.set(0, 2.0, -RD / 2 + 0.05)
  scene.add(mesh)

  draw()
  fontReady.then(draw)
}
