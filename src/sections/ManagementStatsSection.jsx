import { useRef, useEffect } from 'react'
import { Box, Grid, GridItem, Text, Flex, HStack, Image, useToken } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../hooks/useScrubReveal'
import { coachData } from '../data/coachData'

gsap.registerPlugin(ScrollTrigger)

// Colores de gráfico validados (CVD + contraste) sobre superficie brand.carbon:
// victorias = dorado en banda, empates = neutro (punto medio divergente), derrotas = rojo.
const CHART = {
  win:  '#AD8B18',
  draw: '#9A9298',
  loss: '#C4525B',
}

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function statCard(props) {
  return {
    bg: 'brand.carbon',
    border: '1px solid',
    borderColor: 'brand.linea',
    borderRadius: '14px',
    p: { base: 5, md: 6 },
    position: 'relative',
    ...props,
  }
}

function Kicker({ children }) {
  return (
    <Text fontFamily="mono" fontSize="11px" letterSpacing="0.28em"
      textTransform="uppercase" color="brand.boneWarm" mb={5}>
      {children}
    </Text>
  )
}

// ── KPIs con contador animado ──
function KpiTiles() {
  const numRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      coachData.managementStats.kpis.forEach((kpi, i) => {
        const el = numRefs.current[i]
        if (!el) return
        const decimals = kpi.decimals ?? 0
        if (reduceMotion()) { el.textContent = kpi.value.toFixed(decimals); return }
        const obj = { val: 0 }
        gsap.to(obj, {
          val: kpi.value,
          duration: 1.4,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate() { el.textContent = obj.val.toFixed(decimals) },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
      {coachData.managementStats.kpis.map((kpi, i) => (
        <Box key={kpi.label} {...statCard()}
          _before={{
            content: '""', position: 'absolute', bottom: 0, left: '14px',
            w: '32px', h: '2px', bg: 'brand.rojo', borderRadius: 'full',
          }}>
          <Text ref={(el) => (numRefs.current[i] = el)}
            fontFamily="heading" fontSize={{ base: '4xl', md: '5xl' }}
            color="brand.dorado" lineHeight={1}>
            0
          </Text>
          <Text fontFamily="mono" fontSize="10px" color="brand.gray"
            textTransform="uppercase" letterSpacing="widest" mt={2}>
            {kpi.label}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}

// ── Anillo de % de victorias ──
function WinRateRing() {
  const arcRef = useRef(null)
  const numRef = useRef(null)
  const { winRate, kpis } = coachData.managementStats
  const R = 64
  const CIRC = 2 * Math.PI * R

  useEffect(() => {
    const ctx = gsap.context(() => {
      const target = CIRC * (1 - winRate / 100)
      if (reduceMotion()) {
        gsap.set(arcRef.current, { strokeDashoffset: target })
        if (numRef.current) numRef.current.textContent = winRate.toFixed(1)
        return
      }
      gsap.fromTo(arcRef.current,
        { strokeDashoffset: CIRC },
        {
          strokeDashoffset: target,
          duration: 1.6,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: arcRef.current, start: 'top 85%', once: true },
        }
      )
      const obj = { val: 0 }
      gsap.to(obj, {
        val: winRate,
        duration: 1.6,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: arcRef.current, start: 'top 85%', once: true },
        onUpdate() { if (numRef.current) numRef.current.textContent = obj.val.toFixed(1) },
      })
    })
    return () => ctx.revert()
  }, [CIRC, winRate])

  return (
    <Flex direction="column" align="center">
      <Box position="relative" w="200px" h="200px"
        role="img" aria-label={`${winRate}% de victorias en ${kpis[0].value} partidos dirigidos`}>
        <Box as="svg" viewBox="0 0 160 160" w="100%" h="100%">
          <circle cx="80" cy="80" r={R} fill="none" stroke="#221E20" strokeWidth="10" />
          <circle
            ref={arcRef}
            cx="80" cy="80" r={R}
            fill="none"
            stroke={CHART.win}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            transform="rotate(-90 80 80)"
          />
        </Box>
        <Flex position="absolute" inset={0} direction="column" align="center" justify="center">
          <HStack spacing={0} align="baseline">
            <Text ref={numRef} fontFamily="heading" fontSize="5xl" color="brand.bone" lineHeight={1}>
              0
            </Text>
            <Text fontFamily="heading" fontSize="2xl" color="brand.gray">%</Text>
          </HStack>
          <Text fontFamily="mono" fontSize="9px" color="brand.gray"
            textTransform="uppercase" letterSpacing="0.2em">
            de victorias
          </Text>
        </Flex>
      </Box>
      <Text fontFamily="mono" fontSize="10px" color="brand.gray"
        textTransform="uppercase" letterSpacing="0.18em" mt={2}>
        Carrera completa · {kpis[0].value} partidos
      </Text>
    </Flex>
  )
}

// ── Barra apilada V / E / D ──
function RecordBar() {
  const segRefs = useRef([])
  const { record } = coachData.managementStats
  const total = record.wins + record.draws + record.losses
  const segments = [
    { key: 'V', label: 'Victorias', value: record.wins,   color: CHART.win },
    { key: 'E', label: 'Empates',   value: record.draws,  color: CHART.draw },
    { key: 'D', label: 'Derrotas',  value: record.losses, color: CHART.loss },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduceMotion()) { gsap.set(segRefs.current, { scaleX: 1 }); return }
      segRefs.current.forEach((el, i) => {
        gsap.fromTo(el,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.9, delay: i * 0.18, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box role="img"
      aria-label={`Récord: ${record.wins} victorias, ${record.draws} empates, ${record.losses} derrotas`}>
      {/* Leyenda */}
      <HStack spacing={5} mb={4} flexWrap="wrap">
        {segments.map((s) => (
          <HStack key={s.key} spacing={2}>
            <Box boxSize="9px" borderRadius="2px" bg={s.color} />
            <Text fontFamily="mono" fontSize="10px" color="brand.gray"
              textTransform="uppercase" letterSpacing="0.15em">
              {s.label}
            </Text>
          </HStack>
        ))}
      </HStack>

      {/* Barra: separadores de 2px entre segmentos (el fondo actúa de spacer) */}
      <Flex h="18px" gap="2px">
        {segments.map((s, i) => (
          <Box
            key={s.key}
            ref={(el) => (segRefs.current[i] = el)}
            w={`${(s.value / total) * 100}%`}
            bg={s.color}
            borderLeftRadius={i === 0 ? '4px' : 0}
            borderRightRadius={i === segments.length - 1 ? '4px' : 0}
            transformOrigin="left"
            transform="scaleX(0)"
          />
        ))}
      </Flex>

      {/* Etiquetas directas */}
      <Flex gap="2px" mt={2}>
        {segments.map((s) => (
          <Box key={s.key} w={`${(s.value / total) * 100}%`} minW="40px">
            <Text fontFamily="heading" fontSize="xl" color="brand.bone" lineHeight={1}>
              {s.value}
            </Text>
            <Text fontFamily="mono" fontSize="9px" color="brand.gray"
              textTransform="uppercase" letterSpacing="0.12em">
              {s.key} · {Math.round((s.value / total) * 100)}%
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

// ── Puntos por partido por club (línea con puntos, escala 1.0 → 2.0) ──
// El SVG usa un viewBox fijo; valores, escala y etiquetas de club son HTML
// posicionado en % para que el texto no se achique con el ancho.
// Cada club (escudo + sigla + años) va anclado bajo su propio punto.
function PpmChart() {
  const wrapRef   = useRef(null)
  const lineRef   = useRef(null)
  const dotRefs   = useRef([])
  const numRefs   = useRef([])
  const labelRefs = useRef([])
  const [carbon, linea] = useToken('colors', ['brand.carbon', 'brand.linea'])
  const { ppmByClub } = coachData.managementStats

  const W = 560, H = 240, PAD_L = 46, PAD_R = 28, TOP = 28, BASE = 200
  const Y_MIN = 1, Y_MAX = 2
  const ticks = [1, 1.2, 1.4, 1.6, 1.8, 2]
  const xAt = (i) => PAD_L + ((W - PAD_L - PAD_R) / (ppmByClub.length - 1)) * i
  const yAt = (v) => BASE - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (BASE - TOP)
  const pts = ppmByClub.map((c, i) => ({ ...c, x: xAt(i), y: yAt(c.ppm) }))

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduceMotion()) {
        numRefs.current.forEach((el, i) => { if (el) el.textContent = pts[i].ppm.toFixed(2) })
        return
      }
      const line = lineRef.current
      const len  = line.getTotalLength()
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(dotRefs.current, { scale: 0, transformOrigin: 'center' })
      gsap.set(labelRefs.current, { opacity: 0, y: 6 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapRef.current, start: 'top 88%', once: true },
      })
      tl.to(line, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0)
      // Cada punto aparece cuando el trazo lo alcanza, con su club debajo
      pts.forEach((p, i) => {
        const at = (i / (pts.length - 1)) * 1.15
        tl.to(dotRefs.current[i], { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, at)
        tl.to(labelRefs.current[i], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, at + 0.1)
        const obj = { val: 0 }
        tl.to(obj, {
          val: p.ppm, duration: 0.6, ease: 'power2.out',
          onUpdate() { if (numRefs.current[i]) numRefs.current[i].textContent = obj.val.toFixed(2) },
        }, at)
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box ref={wrapRef} role="img"
      aria-label={`Puntos por partido por club: ${ppmByClub.map((c) => `${c.club} ${c.ppm}`).join(', ')}`}>
      <Box position="relative">
        <Text position="absolute" top={0} left={0} fontFamily="mono" fontSize="9px"
          color="brand.gray" textTransform="uppercase" letterSpacing="0.15em">
          pts / pj
        </Text>

        <Box as="svg" viewBox={`0 0 ${W} ${H}`} w="100%" h="auto" display="block">
          {/* Grilla horizontal (la línea base apenas más marcada) */}
          {ticks.map((t) => (
            <line key={t} x1={PAD_L} y1={yAt(t)} x2={W - PAD_R} y2={yAt(t)}
              stroke={linea} strokeWidth="1" opacity={t === Y_MIN ? 0.55 : 0.4} />
          ))}
          {/* Serie */}
          <path ref={lineRef} d={`M${pts.map((p) => `${p.x},${p.y}`).join(' L')}`}
            fill="none" stroke={CHART.win} strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="round" />
          {/* Puntos, con área de hover más grande que el marcador */}
          {pts.map((p, i) => (
            <g key={p.short}>
              <circle ref={(el) => (dotRefs.current[i] = el)} cx={p.x} cy={p.y} r="5.5"
                fill={CHART.win} stroke={carbon} strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="14" fill="transparent">
                <title>{`${p.club} · ${p.ppm.toFixed(2)} pts por partido`}</title>
              </circle>
            </g>
          ))}
        </Box>

        {/* Valores sobre cada punto */}
        {pts.map((p, i) => (
          <Text key={p.short} ref={(el) => (numRefs.current[i] = el)}
            position="absolute" left={`${(p.x / W) * 100}%`} top={`${(p.y / H) * 100}%`}
            transform="translate(-50%, calc(-100% - 12px))"
            fontFamily="heading" fontSize={{ base: 'md', md: 'lg' }}
            color="brand.bone" lineHeight={1}>
            0
          </Text>
        ))}
        {/* Escala Y */}
        {ticks.map((t) => (
          <Text key={t} position="absolute" left={0} top={`${(yAt(t) / H) * 100}%`}
            transform="translateY(-50%)" fontFamily="mono" fontSize="9px" color="brand.gray">
            {t.toFixed(1)}
          </Text>
        ))}

        {/* Clubes: escudo + sigla + años anclados bajo su punto */}
        {pts.map((p, i) => (
          <Flex key={p.short} ref={(el) => (labelRefs.current[i] = el)}
            position="absolute" left={`${(p.x / W) * 100}%`} top={`${(p.y / H) * 100}%`}
            transform="translateX(-50%)" mt="10px"
            direction="column" align="center" gap={1} pointerEvents="none">
            <Image src={p.logo} alt="" boxSize="20px" objectFit="contain" />
            <Text fontFamily="mono" fontSize={{ base: '10px', md: '11px' }} color="brand.bone"
              textTransform="uppercase" letterSpacing="0.12em" lineHeight={1}>
              {p.short}
            </Text>
            <Text fontFamily="mono" fontSize="9px" color="brand.gray" letterSpacing="0.08em"
              lineHeight={1}>
              {p.years}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  )
}

export function ManagementStatsSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [{ ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } }],
    start: 'top 80%',
    end:   'top 40%',
  })

  return (
    <Box
      as="section"
      id="estadisticas"
      ref={sectionRef}
      bg="brand.negro"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        <Box ref={titleRef} mb={{ base: 8, lg: 10 }}>
          <Text fontFamily="mono" fontSize="10px" color="brand.boneWarm"
            textTransform="uppercase" letterSpacing="widest">
            Gestión · Fuente: Transfermarkt / BeSoccer
          </Text>
          <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
            color="brand.dorado" lineHeight={1}>
            Estadísticas
          </Text>
        </Box>

        <KpiTiles />

        <Grid templateColumns={{ base: '1fr', lg: '380px 1fr' }} gap={5} mt={5}>
          <GridItem {...statCard()}>
            <Kicker>Efectividad</Kicker>
            <WinRateRing />
          </GridItem>
          <GridItem>
            <Flex direction="column" gap={5} h="100%">
              <Box {...statCard()} flex={0}>
                <Kicker>Récord total — 151 partidos</Kicker>
                <RecordBar />
              </Box>
              <Box {...statCard()} flex={1}>
                <Kicker>Puntos por partido según club</Kicker>
                <PpmChart />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

export default ManagementStatsSection
