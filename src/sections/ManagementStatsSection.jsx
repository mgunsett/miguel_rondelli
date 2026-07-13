import { useRef, useEffect } from 'react'
import { Box, Grid, GridItem, Text, Flex, HStack } from '@chakra-ui/react'
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

// ── Puntos por partido por club (barras verticales, base cero) ──
function PpmChart() {
  const barRefs = useRef([])
  const numRefs = useRef([])
  const { ppmByClub } = coachData.managementStats
  const SCALE_MAX = 2 // escala del eje (0 → 2 pts/partido); las barras nacen en cero

  useEffect(() => {
    const ctx = gsap.context(() => {
      ppmByClub.forEach((c, i) => {
        const bar = barRefs.current[i]
        const num = numRefs.current[i]
        if (!bar) return
        if (reduceMotion()) {
          gsap.set(bar, { scaleY: 1 })
          if (num) num.textContent = c.ppm.toFixed(2)
          return
        }
        gsap.fromTo(bar,
          { scaleY: 0 },
          {
            scaleY: 1, duration: 1, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 90%', once: true },
          }
        )
        const obj = { val: 0 }
        gsap.to(obj, {
          val: c.ppm, duration: 1, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 90%', once: true },
          onUpdate() { if (num) num.textContent = obj.val.toFixed(2) },
        })
      })
    })
    return () => ctx.revert()
  }, [ppmByClub])

  return (
    <Box role="img"
      aria-label={`Puntos por partido por club: ${ppmByClub.map((c) => `${c.club} ${c.ppm}`).join(', ')}`}>
      <Flex align="flex-end" justify="space-between" gap={{ base: 3, md: 6 }} h="190px">
        {ppmByClub.map((c, i) => (
          <Flex key={c.club} direction="column" align="center" justify="flex-end" flex={1} h="100%">
            <Text ref={(el) => (numRefs.current[i] = el)}
              fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} color="brand.bone"
              lineHeight={1} mb={2}>
              0
            </Text>
            <Box
              ref={(el) => (barRefs.current[i] = el)}
              w="100%"
              maxW="64px"
              h={`${(c.ppm / SCALE_MAX) * 100}%`}
              bg={CHART.win}
              borderTopRadius="4px"
              transformOrigin="bottom"
              transform="scaleY(0)"
            />
          </Flex>
        ))}
      </Flex>
      <Box h="1px" bg="brand.linea" mt="2px" />
      <Flex justify="space-between" gap={{ base: 3, md: 6 }} mt={2}>
        {ppmByClub.map((c) => (
          <Box key={c.club} flex={1} textAlign="center">
            <Text fontFamily="mono" fontSize={{ base: '10px', md: '11px' }} color="brand.bone"
              textTransform="uppercase" letterSpacing="0.12em">
              {c.short}
            </Text>
            <Text fontFamily="mono" fontSize="9px" color="brand.gray" letterSpacing="0.08em">
              {c.years}
            </Text>
          </Box>
        ))}
      </Flex>
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
