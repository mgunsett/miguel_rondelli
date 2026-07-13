import { useRef } from 'react'
import { Box, Text, Flex, VStack, HStack, Image, IconButton } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import useScrubReveal from '../hooks/useScrubReveal'
import { coachData } from '../data/coachData'

function ClubBadge({ club, isActive }) {
  const BADGE = '74px'
  return (
    <Flex
      boxSize={BADGE}
      borderRadius="full"
      align="center"
      justify="center"
      position="relative"
      zIndex={1}
      bg="brand.carbon"
      border="1px solid"
      borderColor={isActive ? 'brand.rojo' : 'brand.dorado'}
      boxShadow={isActive ? '0 0 0 4px rgba(196,30,42,0.35), 0 0 26px rgba(196,30,42,0.45)' : 'none'}
      transition="border-color 0.35s, box-shadow 0.35s, transform 0.35s"
      _groupHover={{
        borderColor: 'brand.doradoLight',
        transform: 'translateY(-4px)',
        boxShadow: '0 0 0 4px rgba(217,182,39,0.28), 0 0 26px rgba(217,182,39,0.35)',
      }}
    >
      {club.logo ? (
        <Image
          src={club.logo}
          alt={`Escudo de ${club.club}`}
          boxSize="46px"
          objectFit="contain"
          loading="lazy"
          filter={isActive ? 'none' : 'saturate(0.85)'}
          transition="filter 0.35s"
        />
      ) : (
        <Text fontFamily="heading" fontSize="lg" color="brand.dorado" letterSpacing="0.06em">
          {club.shortName}
        </Text>
      )}
    </Flex>
  )
}

function CareerNode({ club, isFirst, isLast, isActive }) {
  const NODE_W = { base: '190px', md: '230px' }
  const isFormativas = club.stage === 'formativas'

  return (
    <Box w={NODE_W} flexShrink={0} scrollSnapAlign="center" position="relative" pt={8}>
      {/* Riel + nodo del escudo */}
      <Flex h="74px" align="center" justify="center" position="relative">
        <Box
          position="absolute"
          top="50%"
          left={isFirst ? '50%' : 0}
          right={isLast ? '50%' : 0}
          h="1px"
          bg="brand.dorado"
          opacity={isFormativas ? 0.4 : 1}
          transform="translateY(-50%)"
        />
        {isFirst && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            right={0}
            h="1px"
            bgGradient="linear(to-r, brand.rojo, transparent)"
            transform="translateY(-50%)"
          />
        )}
        <ClubBadge club={club} isActive={isActive} />
      </Flex>

      {/* Tarjeta */}
      <Box
        mt={5}
        mx={2}
        px={4}
        pt={5}
        pb={6}
        bg="brand.carbon"
        border="1px solid"
        borderColor={isFormativas ? 'brand.linea' : 'brand.amberLight'}
        borderRadius="lg"
        textAlign="center"
        position="relative"
        transition="border-color 0.35s, transform 0.35s, background 0.35s"
        _before={{
          content: '""', position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          w: isActive ? '40px' : '0', h: '2px', bg: 'brand.rojo', borderRadius: 'full',
          transition: 'width 0.35s',
        }}
        _groupHover={{
          transform: 'translateY(-4px)',
          bg: 'brand.doradoAlpha',
          _before: { width: '40px' },
        }}
      >
        <Text fontFamily="mono" fontSize="10px"
          color={isActive ? 'brand.rec' : 'brand.bone'}
          textTransform="uppercase" letterSpacing="0.2em">
          {club.years}
        </Text>
        <Text fontFamily="heading" fontSize="xl" color="brand.bone" lineHeight={1.05} mt={1}>
          {club.club}
        </Text>
        <Text fontFamily="mono" fontSize="10px" color="brand.gray"
          textTransform="uppercase" letterSpacing="0.18em" mt={1}>
          {club.country} · {club.role}
        </Text>

        {/* Récord del ciclo (solo primera división) */}
        {club.record && (
          <HStack justify="center" spacing={4} mt={3} pt={3}
            borderTop="1px solid" borderColor="brand.linea">
            <Box>
              <Text fontFamily="heading" fontSize="lg" color="brand.dorado" lineHeight={1}>
                {club.record.pj}
              </Text>
              <Text fontFamily="mono" fontSize="8px" color="brand.gray"
                textTransform="uppercase" letterSpacing="0.15em">
                Partidos
              </Text>
            </Box>
            <Box w="1px" h="24px" bg="brand.linea" />
            <Box>
              <Text fontFamily="heading" fontSize="lg" color="brand.dorado" lineHeight={1}>
                {club.record.ppm.toFixed(2)}
              </Text>
              <Text fontFamily="mono" fontSize="8px" color="brand.gray"
                textTransform="uppercase" letterSpacing="0.15em">
                Pts / partido
              </Text>
            </Box>
          </HStack>
        )}

        {club.highlights.length > 0 && (
          <VStack spacing={1.5} mt={3}>
            {club.highlights.map((h) => (
              <Text key={h} fontFamily="mono" fontSize="9px"
                color={isFormativas ? 'brand.gray' : 'brand.doradoLight'}
                letterSpacing="0.12em" lineHeight={1.5}>
                {isFormativas ? h : `🏆 ${h}`}
              </Text>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}

export function CareerSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const scrollRef  = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  useScrubReveal(sectionRef, {
    elements: [{ ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } }],
    start: 'top 80%',
    end:   'top 40%',
  })

  const scrollByDir = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  const onDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    drag.current.active = true
    drag.current.moved = false
    drag.current.startX = (e.pageX ?? e.touches?.[0]?.pageX) - el.offsetLeft
    drag.current.scrollLeft = el.scrollLeft
    el.style.cursor = 'grabbing'
  }
  const onMove = (e) => {
    const el = scrollRef.current
    if (!drag.current.active || !el) return
    const x = (e.pageX ?? e.touches?.[0]?.pageX) - el.offsetLeft
    const delta = (x - drag.current.startX) * 1.15
    if (Math.abs(delta) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.scrollLeft - delta
  }
  const onUp = () => {
    drag.current.active = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  const arrowProps = {
    variant: 'unstyled',
    minW: '38px',
    h: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'full',
    border: '1px solid',
    borderColor: 'brand.dorado',
    color: 'brand.bone',
    transition: 'all 0.25s',
    _hover: { bg: 'brand.doradoAlpha', color: 'brand.dorado' },
    _active: { transform: 'scale(0.92)' },
  }

  return (
    <Box
      as="section"
      id="trayectoria"
      ref={sectionRef}
      bg="brand.negro"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        <Flex align="flex-end" justify="space-between" mb={7}>
          <Box ref={titleRef}>
            <Text fontFamily="mono" fontSize="10px" color="brand.boneWarm"
              textTransform="uppercase" letterSpacing="widest">
              Del semillero de Vélez a la Libertadores
            </Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
              color="brand.dorado" lineHeight={1}>
              Trayectoria
            </Text>
          </Box>
          <HStack spacing={2}>
            <IconButton aria-label="Anterior" icon={<FiChevronLeft size={18} />}
              onClick={() => scrollByDir(-1)} {...arrowProps} />
            <IconButton aria-label="Siguiente" icon={<FiChevronRight size={18} />}
              onClick={() => scrollByDir(1)} {...arrowProps} />
          </HStack>
        </Flex>

        <Box
          ref={scrollRef}
          overflowX="auto"
          cursor="grab"
          pb={6}
          sx={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }}
        >
          <HStack spacing={0} align="stretch" w="max-content" px={1}>
            {coachData.career.map((club, i) => (
              <Box key={club.club} role="group">
                <CareerNode
                  club={club}
                  isFirst={i === 0}
                  isLast={i === coachData.career.length - 1}
                  isActive={i === 0}
                />
              </Box>
            ))}
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}

export default CareerSection
