import { useRef, useEffect } from 'react'
import { Box, useToken } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Posiciones base del 4-2-3-1 (cancha vertical, ataque hacia arriba).
// pressY: posición adelantada en presión alta — cada línea queda por debajo de la anterior.
const PLAYERS = [
  { n: 1,  x: 180, y: 482 },               // GK (único que no presiona)
  { n: 4,  x: 305, y: 402, pressY: 300 },  // RB
  { n: 2,  x: 225, y: 414, pressY: 314 },  // CB
  { n: 6,  x: 135, y: 414, pressY: 314 },  // CB
  { n: 3,  x: 55,  y: 402, pressY: 300 },  // LB
  { n: 5,  x: 230, y: 330, pressY: 246 },  // DM
  { n: 8,  x: 130, y: 330, pressY: 246 },  // DM
  { n: 7,  x: 300, y: 236, pressY: 146 },  // AM derecha
  { n: 10, x: 180, y: 222, pressY: 188 },  // AM centro
  { n: 11, x: 60,  y: 236, pressY: 146 },  // AM izquierda
  { n: 9,  x: 180, y: 128, pressY: 96 },   // FW
]

// Oleadas de presión (índices de PLAYERS): 9 → 11/7 → 10 → 8/5 → defensa
const PRESS_WAVES = [[10], [9, 7], [8], [6, 5], [4, 3, 2, 1]]

// Circuito de pases (índices de PLAYERS): arquero → central → pivote → enganche → 9
const PASS_ROUTE = [0, 3, 6, 8, 10]
// Juveniles proyectados que se destacan en el modo 'juveniles'
const YOUTH_IDX = [7, 8, 9]

function PitchMarkings({ stroke }) {
  const s = { fill: 'none', stroke, strokeWidth: 1.2 }
  return (
    <g opacity={0.35}>
      <rect x="14" y="14" width="332" height="492" rx="6" {...s} />
      <line x1="14" y1="260" x2="346" y2="260" stroke={stroke} strokeWidth="1.2" />
      <circle cx="180" cy="260" r="42" {...s} />
      <rect x="96" y="14" width="168" height="62" {...s} />
      <rect x="140" y="14" width="80" height="26" {...s} />
      <rect x="96" y="444" width="168" height="62" {...s} />
      <rect x="140" y="480" width="80" height="26" {...s} />
    </g>
  )
}

export function TacticalBoard({ mode = 'estructura' }) {
  const svgRef     = useRef(null)
  const dotRefs    = useRef([])
  const lineRefs   = useRef([])
  const passRef    = useRef(null)
  const ballRef    = useRef(null)
  const zoneRef    = useRef(null)
  const arrowRefs  = useRef([])
  const ringRefs   = useRef([])
  const [rojo, rojoLight, dorado, bone] = useToken(
    'colors', ['brand.rojo', 'brand.rojoLight', 'brand.dorado', 'brand.bone']
  )

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Estado base: todos en su posición, overlays ocultos
      dotRefs.current.forEach((el, i) => {
        gsap.set(el, { x: PLAYERS[i].x, y: PLAYERS[i].y, scale: 1, transformOrigin: 'center' })
        gsap.set(el.querySelector('circle'), { fill: rojo, stroke: dorado })
      })
      gsap.set([passRef.current, ballRef.current, zoneRef.current], { opacity: 0 })
      gsap.set([...lineRefs.current, ...arrowRefs.current, ...ringRefs.current], { opacity: 0 })

      if (reduceMotion) {
        // Sin loops ni dibujado: estado final estático del modo activo
        if (mode === 'estructura') gsap.set(lineRefs.current, { opacity: 0.5 })
        if (mode === 'posesion')   gsap.set(passRef.current, { opacity: 0.8, strokeDashoffset: 0 })
        if (mode === 'presion') {
          gsap.set(zoneRef.current, { opacity: 0.5 })
          dotRefs.current.forEach((el, i) => {
            if (PLAYERS[i].pressY) gsap.set(el, { y: PLAYERS[i].pressY })
          })
        }
        if (mode === 'juveniles') {
          YOUTH_IDX.forEach((i) =>
            gsap.set(dotRefs.current[i]?.querySelector('circle'), { fill: dorado, stroke: bone }))
        }
        return
      }

      // Si la pizarra ya está en viewport (cambio de concepto), arranca al instante;
      // en el primer scroll espera a que la sección entre en pantalla.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svgRef.current, start: 'top 85%', once: true },
      })

      // Entrada de los 11 jugadores (siempre)
      tl.fromTo(dotRefs.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'back.out(2)' }
      )

      if (mode === 'estructura') {
        lineRefs.current.forEach((line) => {
          const len = line.getTotalLength()
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.6 })
          tl.to(line, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.2')
        })
      }

      if (mode === 'posesion') {
        const path = passRef.current
        const len  = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.85 })
        tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' })
        // La pelota recorre el circuito en loop
        const [first, ...rest] = PASS_ROUTE.map((i) => PLAYERS[i])
        tl.set(ballRef.current, { x: first.x, y: first.y, opacity: 1 })
        const ballTl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 })
        rest.forEach((p) => {
          ballTl.to(ballRef.current, { x: p.x, y: p.y, duration: 0.55, ease: 'power2.inOut' })
        })
        ballTl.to(ballRef.current, { opacity: 0, duration: 0.3 })
        ballTl.set(ballRef.current, { x: first.x, y: first.y })
        ballTl.to(ballRef.current, { opacity: 1, duration: 0.3 })
        tl.add(ballTl)
      }

      if (mode === 'presion') {
        // Presión alta en oleadas: cada línea adelanta y queda por debajo de la anterior
        tl.to(zoneRef.current, { opacity: 0.5, duration: 0.5 }, '-=0.1')
        PRESS_WAVES.forEach((wave, k) => {
          wave.forEach((idx, j) => {
            tl.to(
              dotRefs.current[idx],
              { y: PLAYERS[idx].pressY, duration: 0.55, ease: 'power2.out' },
              j > 0 || k === 0 ? '<' : '-=0.35'
            )
          })
        })
        arrowRefs.current.forEach((arrow) => {
          const len = arrow.getTotalLength()
          gsap.set(arrow, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.9 })
          tl.to(arrow, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, '-=0.3')
        })
        tl.to(zoneRef.current, {
          opacity: 0.25, duration: 1.1, ease: 'sine.inOut', repeat: -1, yoyo: true,
        })
      }

      if (mode === 'juveniles') {
        YOUTH_IDX.forEach((idx, k) => {
          const dot  = dotRefs.current[idx]
          const ring = ringRefs.current[k]
          tl.to(dot.querySelector('circle'), { fill: dorado, stroke: bone, duration: 0.4 }, 0.6 + k * 0.15)
          gsap.set(ring, { x: PLAYERS[idx].x, y: PLAYERS[idx].y })
          tl.fromTo(ring,
            { opacity: 0.8, scale: 0.4, transformOrigin: 'center' },
            { opacity: 0, scale: 2.4, duration: 1.4, ease: 'power1.out', repeat: -1, repeatDelay: 0.4 },
            0.7 + k * 0.15
          )
        })
      }
    }, svgRef)

    return () => ctx.revert()
  }, [mode, rojo, rojoLight, dorado, bone])

  return (
    <Box
      as="svg"
      ref={svgRef}
      viewBox="0 0 360 520"
      w="100%"
      maxW="420px"
      h="auto"
      role="img"
      aria-label={`Pizarra táctica: formación ${mode}`}
    >
      <PitchMarkings stroke={bone} />

      {/* Zona de presión alta (mitad rival) */}
      <rect ref={zoneRef} x="22" y="22" width="316" height="200" rx="4"
        fill={rojo} opacity="0" style={{ mixBlendMode: 'screen' }} />

      {/* Conectores de línea (modo estructura) */}
      {[
        'M55,402 L135,414 L225,414 L305,402',
        'M130,330 L230,330',
        'M60,236 L180,222 L300,236',
      ].map((d, i) => (
        <path key={d} ref={(el) => (lineRefs.current[i] = el)} d={d}
          fill="none" stroke={dorado} strokeWidth="1.5" opacity="0" />
      ))}

      {/* Circuito de pases (modo posesión) */}
      <path
        ref={passRef}
        d={`M${PASS_ROUTE.map((i) => `${PLAYERS[i].x},${PLAYERS[i].y}`).join(' L')}`}
        fill="none" stroke={dorado} strokeWidth="2" strokeDasharray="6 6" opacity="0"
      />

      {/* Flechas de presión (modo presión) */}
      {['M60,210 L60,120', 'M180,196 L180,100', 'M300,210 L300,120'].map((d, i) => (
        <path key={d} ref={(el) => (arrowRefs.current[i] = el)} d={d}
          fill="none" stroke={rojoLight} strokeWidth="2.5" strokeLinecap="round"
          markerEnd="url(#press-arrow)" opacity="0" />
      ))}
      <defs>
        <marker id="press-arrow" viewBox="0 0 10 10" refX="7" refY="5"
          markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={rojoLight} />
        </marker>
      </defs>

      {/* Anillos de proyección (modo juveniles) */}
      {YOUTH_IDX.map((idx, k) => (
        <circle key={idx} ref={(el) => (ringRefs.current[k] = el)} r="14"
          fill="none" stroke={dorado} strokeWidth="1.5" opacity="0" />
      ))}

      {/* Los 11 jugadores */}
      {PLAYERS.map((p, i) => (
        <g key={p.n} ref={(el) => (dotRefs.current[i] = el)}>
          <circle r="13" fill={rojo} stroke={dorado} strokeWidth="1.5" />
          <text textAnchor="middle" dy="4" fontSize="11" fontFamily="Barlow Condensed"
            fontWeight="600" fill={bone}>
            {p.n}
          </text>
        </g>
      ))}

      {/* Pelota (modo posesión) */}
      <circle ref={ballRef} r="5" fill={bone} stroke={rojo} strokeWidth="1.5" opacity="0" />
    </Box>
  )
}

export default TacticalBoard
