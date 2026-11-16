import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Shape,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'

/**
 * The hero's 3D stack: three glass plates (interface, API, data) with
 * requests travelling up and responses travelling down between them.
 *
 * Plain three.js, one scene, one loop. The page drives it through
 * `setScroll({ explode, focus })`: `explode` (0–1) pulls the plates apart,
 * `focus` (-1 for the hero, then 0, 1, 2) lights the layer the reader is on.
 * The loop sleeps while the canvas is off screen or the tab is hidden, and
 * with reduced motion the scene renders on demand with no idle movement.
 */

const PALETTE = {
  chalk: new Color('#F3EEE4'),
  amber: new Color('#D4AF37'),
  signal: new Color('#BDB9B0'),
  side: new Color('#3A3A3A'),
}

const W = 3.4 // plate width
const D = 2.2 // plate depth
const T = 0.09 // plate thickness
const TEX_W = 1024
const TEX_H = Math.round((TEX_W * D) / W)

/* ------------------------------------------------------------------------ */
/* Plate faces, drawn once to 2D canvases                                     */
/* ------------------------------------------------------------------------ */

const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function plateBase(ctx) {
  const g = ctx.createLinearGradient(0, 0, TEX_W, TEX_H)
  g.addColorStop(0, 'rgba(40, 40, 40, 0.96)')
  g.addColorStop(1, 'rgba(14, 14, 14, 0.96)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, TEX_W, TEX_H)
}

function drawInterface(ctx) {
  plateBase(ctx)
  // Browser chrome
  ctx.fillStyle = 'rgba(243, 238, 228, 0.08)'
  ctx.fillRect(0, 0, TEX_W, 74)
  ;['#D4AF37', 'rgba(243,238,228,.45)', 'rgba(243,238,228,.25)'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(46 + i * 34, 37, 10, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = 'rgba(243, 238, 228, 0.12)'
  rr(ctx, 170, 20, 420, 34, 17)
  ctx.fill()
  // Headline and body lines
  ctx.fillStyle = 'rgba(243, 238, 228, 0.92)'
  rr(ctx, 70, 130, 560, 58, 10)
  ctx.fill()
  rr(ctx, 70, 202, 400, 58, 10)
  ctx.fill()
  ctx.fillStyle = 'rgba(168, 165, 158, 0.55)'
  ;[290, 318, 346].forEach((y, i) => {
    rr(ctx, 70, y, [470, 430, 300][i], 14, 7)
    ctx.fill()
  })
  // Primary action
  ctx.fillStyle = '#D4AF37'
  rr(ctx, 70, 392, 200, 58, 29)
  ctx.fill()
  ctx.strokeStyle = 'rgba(243, 238, 228, 0.4)'
  ctx.lineWidth = 3
  rr(ctx, 290, 392, 170, 58, 29)
  ctx.stroke()
  // Cards
  for (let i = 0; i < 3; i += 1) {
    const x = 70 + i * 300
    ctx.strokeStyle = 'rgba(243, 238, 228, 0.22)'
    rr(ctx, x, 500, 270, 130, 16)
    ctx.stroke()
    ctx.fillStyle = i === 0 ? 'rgba(189, 185, 176, 0.35)' : 'rgba(243, 238, 228, 0.1)'
    rr(ctx, x + 16, 516, 238, 60, 10)
    ctx.fill()
    ctx.fillStyle = 'rgba(243, 238, 228, 0.35)'
    rr(ctx, x + 16, 592, 150, 14, 7)
    ctx.fill()
  }
  // Hero visual block on the right
  const g = ctx.createRadialGradient(830, 270, 10, 830, 270, 190)
  g.addColorStop(0, 'rgba(212, 175, 55, 0.75)')
  g.addColorStop(1, 'rgba(212, 175, 55, 0)')
  ctx.fillStyle = g
  ctx.fillRect(640, 90, 380, 380)
}

function drawApi(ctx) {
  plateBase(ctx)
  const routes = [
    ['GET', '/projects'],
    ['POST', '/briefs'],
    ['PATCH', '/orders/:id'],
    ['GET', '/leaderboard'],
    ['DELETE', '/sessions'],
  ]
  ctx.font = '600 34px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.textBaseline = 'middle'
  routes.forEach(([method, path], i) => {
    const y = 96 + i * 98
    ctx.fillStyle = 'rgba(243, 238, 228, 0.07)'
    rr(ctx, 50, y - 36, 560, 72, 14)
    ctx.fill()
    ctx.fillStyle = '#D4AF37'
    ctx.fillText(method, 76, y)
    ctx.fillStyle = 'rgba(243, 238, 228, 0.9)'
    ctx.fillText(path, 230, y)
  })
  // A small service graph on the right
  const nodes = [
    [760, 140],
    [930, 230],
    [760, 330],
    [910, 460],
    [740, 540],
  ]
  ctx.strokeStyle = 'rgba(189, 185, 176, 0.55)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ;[
    [0, 1],
    [1, 2],
    [0, 2],
    [2, 3],
    [3, 4],
    [2, 4],
  ].forEach(([a, b]) => {
    ctx.moveTo(...nodes[a])
    ctx.lineTo(...nodes[b])
  })
  ctx.stroke()
  nodes.forEach(([x, y], i) => {
    ctx.fillStyle = i === 2 ? '#D4AF37' : 'rgba(243, 238, 228, 0.9)'
    ctx.beginPath()
    ctx.arc(x, y, i === 2 ? 20 : 12, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawData(ctx) {
  plateBase(ctx)
  const cols = [60, 230, 520, 760]
  ctx.font = '600 28px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(189, 185, 176, 0.95)'
  ;['id', 'name', 'status', 'updated'].forEach((h, i) => ctx.fillText(h, cols[i], 70))
  ctx.fillStyle = 'rgba(243, 238, 228, 0.2)'
  ctx.fillRect(40, 104, TEX_W - 80, 3)
  for (let r = 0; r < 7; r += 1) {
    const y = 150 + r * 70
    if (r % 2 === 0) {
      ctx.fillStyle = 'rgba(243, 238, 228, 0.05)'
      ctx.fillRect(40, y - 32, TEX_W - 80, 64)
    }
    ctx.fillStyle = 'rgba(168, 165, 158, 0.8)'
    ctx.fillText(String(1040 + r), cols[0], y)
    ctx.fillStyle = 'rgba(243, 238, 228, 0.55)'
    rr(ctx, cols[1], y - 8, 180 + ((r * 53) % 90), 16, 8)
    ctx.fill()
    ctx.fillStyle = r === 2 ? '#D4AF37' : 'rgba(189, 185, 176, 0.85)'
    ctx.beginPath()
    ctx.arc(cols[2] + 12, y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(243, 238, 228, 0.3)'
    rr(ctx, cols[3], y - 8, 150, 16, 8)
    ctx.fill()
  }
}

function faceTexture(draw) {
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H
  const ctx = canvas.getContext('2d')
  if (!ctx.roundRect) ctx.roundRect = (x, y, w, h) => ctx.rect(x, y, w, h)
  draw(ctx)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  // ExtrudeGeometry's cap UVs are the shape's own coordinates, centred on 0.
  texture.repeat.set(1 / W, 1 / D)
  texture.offset.set(0.5, 0.5)
  return texture
}

/* ------------------------------------------------------------------------ */
/* Geometry and materials                                                    */
/* ------------------------------------------------------------------------ */

function roundedRect(w, d, r) {
  const s = new Shape()
  const x = -w / 2
  const y = -d / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + d - r)
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d)
  s.lineTo(x + r, y + d)
  s.quadraticCurveTo(x, y + d, x, y + d - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

const GLOW = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      float d = length((vUv - 0.5) * vec2(1.0, 1.4));
      float a = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(uColor, a * a * uOpacity);
    }
  `,
}

const PACKETS = {
  vertex: /* glsl */ `
    attribute vec2 aPos;
    attribute float aPhase;
    attribute float aSpeed;
    attribute float aDir;
    uniform float uTime;
    uniform float uBottom;
    uniform float uTop;
    uniform float uSize;
    uniform float uPixelRatio;
    varying float vFade;
    varying float vDir;
    void main() {
      float t = fract(aPhase + uTime * aSpeed);
      float y = aDir > 0.0 ? mix(uBottom, uTop, t) : mix(uTop, uBottom, t);
      vec4 mv = modelViewMatrix * vec4(aPos.x, y, aPos.y, 1.0);
      gl_Position = projectionMatrix * mv;
      vFade = sin(t * 3.14159);
      vDir = aDir;
      gl_PointSize = uSize * uPixelRatio * (0.55 + 0.45 * vFade) / -mv.z;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uUp;
    uniform vec3 uDown;
    uniform float uOpacity;
    varying float vFade;
    varying float vDir;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d);
      vec3 c = vDir > 0.0 ? uUp : uDown;
      gl_FragColor = vec4(c, a * a * vFade * uOpacity);
    }
  `,
}

const DUST = {
  vertex: /* glsl */ `
    uniform float uPixelRatio;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = 26.0 * uPixelRatio / -mv.z;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uColor;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * 0.45);
    }
  `,
}

/* ------------------------------------------------------------------------ */

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export function createStackScene(container, { reduced = false, lowPower = false } = {}) {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.75)

  const renderer = new WebGLRenderer({
    antialias: !lowPower,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(pixelRatio)
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  container.appendChild(canvas)

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 100)

  const stack = new Group()
  scene.add(stack)

  // --- plates ---------------------------------------------------------------
  const shape = roundedRect(W, D, 0.22)
  const geometry = new ExtrudeGeometry(shape, { depth: T, bevelEnabled: false, curveSegments: 10 })
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, -T / 2, 0)
  const edges = new EdgesGeometry(geometry, 30)
  const glowGeometry = new PlaneGeometry(W * 1.7, D * 1.9)
  glowGeometry.rotateX(-Math.PI / 2)

  const disposables = [geometry, edges, glowGeometry]

  const layerDefs = [
    { id: 'interface', draw: drawInterface, glow: PALETTE.amber },
    { id: 'api', draw: drawApi, glow: PALETTE.amber.clone().lerp(PALETTE.signal, 0.5) },
    { id: 'data', draw: drawData, glow: PALETTE.signal },
  ]

  const plates = layerDefs.map((def, i) => {
    const map = faceTexture(def.draw)
    const cap = new MeshBasicMaterial({ map, transparent: true })
    const side = new MeshBasicMaterial({ color: PALETTE.side, transparent: true })
    const mesh = new Mesh(geometry, [cap, side])

    const lineMat = new LineBasicMaterial({ color: PALETTE.chalk.clone(), transparent: true, opacity: 0.35 })
    const outline = new LineSegments(edges, lineMat)

    const glowMat = new ShaderMaterial({
      vertexShader: GLOW.vertex,
      fragmentShader: GLOW.fragment,
      uniforms: { uColor: { value: def.glow }, uOpacity: { value: 0.4 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const glow = new Mesh(glowGeometry, glowMat)
    glow.position.y = -0.18

    const group = new Group()
    group.add(glow, mesh, outline)
    stack.add(group)
    disposables.push(map, cap, side, lineMat, glowMat)
    return { group, cap, side, lineMat, glowMat, index: i }
  })

  // --- packets travelling between the plates -------------------------------
  const count = lowPower ? 36 : 90
  const pos = new Float32Array(count * 2)
  const phase = new Float32Array(count)
  const speed = new Float32Array(count)
  const dir = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    pos[i * 2] = (Math.random() - 0.5) * W * 0.82
    pos[i * 2 + 1] = (Math.random() - 0.5) * D * 0.78
    phase[i] = Math.random()
    speed[i] = 0.12 + Math.random() * 0.22
    dir[i] = Math.random() > 0.42 ? 1 : -1
  }
  const packetGeometry = new BufferGeometry()
  packetGeometry.setAttribute('aPos', new BufferAttribute(pos, 2))
  packetGeometry.setAttribute('aPhase', new BufferAttribute(phase, 1))
  packetGeometry.setAttribute('aSpeed', new BufferAttribute(speed, 1))
  packetGeometry.setAttribute('aDir', new BufferAttribute(dir, 1))
  // Positions are computed in the shader; give the geometry a position
  // attribute of the right length so three draws every point.
  packetGeometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
  const packetMat = new ShaderMaterial({
    vertexShader: PACKETS.vertex,
    fragmentShader: PACKETS.fragment,
    uniforms: {
      uTime: { value: 0 },
      uBottom: { value: -1 },
      uTop: { value: 1 },
      uSize: { value: 150 },
      uPixelRatio: { value: pixelRatio },
      uUp: { value: PALETTE.amber },
      uDown: { value: PALETTE.signal },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const packets = new Points(packetGeometry, packetMat)
  packets.frustumCulled = false
  stack.add(packets)
  disposables.push(packetGeometry, packetMat)

  // --- dust -------------------------------------------------------------------
  const dustCount = lowPower ? 120 : 260
  const dustPos = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i += 1) {
    const r = 5 + Math.random() * 9
    const a = Math.random() * Math.PI * 2
    dustPos[i * 3] = Math.cos(a) * r
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 9
    dustPos[i * 3 + 2] = Math.sin(a) * r
  }
  const dustGeometry = new BufferGeometry()
  dustGeometry.setAttribute('position', new BufferAttribute(dustPos, 3))
  const dustMat = new ShaderMaterial({
    vertexShader: DUST.vertex,
    fragmentShader: DUST.fragment,
    uniforms: { uColor: { value: PALETTE.signal }, uPixelRatio: { value: pixelRatio } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const dust = new Points(dustGeometry, dustMat)
  scene.add(dust)
  disposables.push(dustGeometry, dustMat)

  // --- state ----------------------------------------------------------------
  const state = {
    explode: 0,
    focus: -1,
    targetExplode: 0,
    targetFocus: -1,
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    intro: reduced ? 1 : 0,
    time: 0,
  }

  let width = 1
  let height = 1
  const resize = () => {
    width = Math.max(1, container.clientWidth)
    height = Math.max(1, container.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Narrow screens pull the camera back so the whole stack stays in frame.
    const fit = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 1.1 : 1
    camera.position.set(0, 5.2 * fit, 9.2 * fit)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    if (reduced) render()
  }

  const apply = (dt) => {
    const k = reduced ? 1 : 1 - Math.pow(0.0025, dt)
    state.explode += (state.targetExplode - state.explode) * k
    state.focus += (state.targetFocus - state.focus) * k
    state.px += (state.tx - state.px) * (reduced ? 1 : 1 - Math.pow(0.02, dt))
    state.py += (state.ty - state.py) * (reduced ? 1 : 1 - Math.pow(0.02, dt))

    const gap = MathUtils.lerp(0.52, 1.32, state.explode)
    const engaged = clamp01(state.focus + 1) // 0 in the hero, 1 once a layer is in focus

    plates.forEach((p) => {
      // Intro: data lands first, then API, then interface.
      const order = 2 - p.index
      const land = easeOutExpo(clamp01(state.intro * 1.7 - order * 0.28))
      const nearness = Math.max(0.22, 1 - Math.abs(state.focus - p.index))
      const weight = MathUtils.lerp(1, nearness, engaged)
      const active = weight * engaged

      p.group.position.y = (1 - p.index) * gap + (1 - land) * 3.2 + active * 0.12
      p.group.position.x = active * 0.18
      p.group.scale.setScalar(1 + active * 0.05)

      const alpha = land * (0.38 + 0.62 * weight)
      p.cap.opacity = alpha
      p.side.opacity = alpha
      p.lineMat.opacity = land * (0.22 + 0.5 * weight)
      p.lineMat.color.copy(PALETTE.chalk).lerp(PALETTE.amber, active)
      p.glowMat.uniforms.uOpacity.value = land * (0.18 + 0.42 * weight)
    })

    packetMat.uniforms.uTop.value = gap - 0.05
    packetMat.uniforms.uBottom.value = -gap + 0.05
    packetMat.uniforms.uOpacity.value = clamp01(state.intro * 1.4 - 0.7) * (0.55 + state.explode * 0.45)

    const idle = reduced ? 0 : Math.sin(state.time * 0.35) * 0.06
    stack.rotation.y = -0.62 + idle + state.px * 0.28 + Math.max(0, state.focus) * 0.16
    stack.rotation.x = state.py * 0.1
    stack.position.y = -0.1 - state.explode * 0.1
    dust.rotation.y = state.time * 0.015
  }

  const render = () => renderer.render(scene, camera)

  // --- loop -----------------------------------------------------------------
  let frame = 0
  let last = 0
  let visible = true
  let disposed = false

  const tick = (now) => {
    frame = 0
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
    last = now
    state.time += dt
    if (state.intro < 1) state.intro = Math.min(1, state.intro + dt / 1.6)
    packetMat.uniforms.uTime.value = state.time
    apply(dt)
    render()
    start()
  }

  function start() {
    if (reduced || disposed || frame || !visible || document.hidden) return
    frame = requestAnimationFrame(tick)
  }

  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
    last = 0
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  })
  io.observe(container)

  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  const onPointer = (e) => {
    if (e.pointerType !== 'mouse') return
    state.tx = (e.clientX / window.innerWidth) * 2 - 1
    state.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true })

  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()
  apply(0.016)
  render()
  start()

  return {
    canvas,
    setScroll({ explode, focus }) {
      state.targetExplode = explode
      state.targetFocus = focus
      if (reduced) {
        apply(1)
        render()
      }
    },
    dispose() {
      disposed = true
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      canvas.remove()
    },
  }
}
