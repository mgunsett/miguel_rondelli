import { useState, useRef } from 'react'
import { Box, Grid, GridItem, Text, Flex, VStack, IconButton } from '@chakra-ui/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaFutbol } from 'react-icons/fa'
import { FiTarget, FiGrid, FiLayers, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import useScrubReveal from '../hooks/useScrubReveal'
import { coachData } from '../data/coachData'
import TacticalBoard from '../components/Tactical/TacticalBoard'

const CONCEPT_ICONS = {
  posesion:   FaFutbol,
  presion:    FiTarget,
  estructura: FiGrid,
  linea343:   FiLayers,
}

function ConceptCard({ concept, isActive, onSelect }) {
  const Icon = CONCEPT_ICONS[concept.id] ?? FaFutbol
  return (
    <Box
      as="button"
      type="button"
      onClick={onSelect}
      textAlign="left"
      w="100%"
      bg={isActive ? 'brand.doradoAlpha' : 'transparent'}
      border="1px solid"
      borderColor={isActive ? 'brand.dorado' : 'brand.linea'}
      borderLeftWidth="4px"
      borderLeftColor={isActive ? 'brand.rojo' : 'brand.humo'}
      borderRadius="10px"
      p={{ base: 4, md: 5 }}
      transition="border-color 0.3s, background 0.3s, transform 0.3s"
      _hover={{ borderColor: 'brand.dorado', transform: 'translateX(4px)' }}
      aria-pressed={isActive}
    >
      <Flex align="center" gap={3} mb={2}>
        <Box as={Icon} fontSize="18px" color={isActive ? 'brand.dorado' : 'brand.gray'}
          transition="color 0.3s" />
        <Text fontFamily="heading" fontSize={{ base: 'xl', md: '2xl' }}
          color={isActive ? 'brand.bone' : 'brand.gray'} lineHeight={1} transition="color 0.3s">
          {concept.title}
        </Text>
      </Flex>
      <Text fontFamily="mono" fontSize="10px" color="brand.rojoLight"
        textTransform="uppercase" letterSpacing="0.2em" mb={isActive ? 2 : 0}>
        {concept.tag}
      </Text>
      {isActive && (
        <Text fontFamily="body" fontSize={{ base: 'xs', md: 'sm' }} color="brand.gray" lineHeight={1.6}>
          {concept.text}
        </Text>
      )}
    </Box>
  )
}

const MotionFlex = motion(Flex)

function ConceptSlider({ concepts, active, onChange }) {
  const [dir, setDir] = useState(1)
  const touchX = useRef(null)
  const reduceMotion = useReducedMotion()
  const concept = concepts[active]
  const Icon = CONCEPT_ICONS[concept.id] ?? FaFutbol

  const go = (delta) => {
    setDir(delta)
    onChange((active + delta + concepts.length) % concepts.length)
  }

  return (
    <Box>
      <Flex align="center" gap={1}>
        <IconButton
          aria-label="Concepto anterior"
          icon={<FiChevronLeft />}
          onClick={() => go(-1)}
          variant="ghost"
          isRound
          fontSize="24px"
          color="brand.gray"
          _hover={{ color: 'brand.dorado', bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          flexShrink={0}
        />
        {/* Concepto activo centrado — cambia con flechas o deslizando */}
        <Box
          flex={1}
          minW={0}
          overflow="hidden"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <MotionFlex
              key={concept.id}
              initial={reduceMotion ? false : { x: dir * 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
              exit={reduceMotion ? undefined
                : { x: dir * -48, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
              align="center"
              justify="center"
              gap={2}
              px={3}
              py={2}
              bg="brand.doradoAlpha"
              border="1px solid"
              borderColor="brand.dorado"
              borderRadius="full"
            >
              <Box as={Icon} fontSize="14px" color="brand.dorado" flexShrink={0} />
              <Text fontFamily="heading" fontSize={{ base: 'sm', sm: 'md' }} whiteSpace="nowrap"
                lineHeight={1} color="brand.bone">
                {concept.title}
              </Text>
            </MotionFlex>
          </AnimatePresence>
        </Box>
        <IconButton
          aria-label="Concepto siguiente"
          icon={<FiChevronRight />}
          onClick={() => go(1)}
          variant="ghost"
          isRound
          fontSize="24px"
          color="brand.gray"
          _hover={{ color: 'brand.dorado', bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          flexShrink={0}
        />
      </Flex>
      {/* Indicador de posición */}
      <Flex justify="center" gap={2} mt={3}>
        {concepts.map((c, i) => (
          <Box
            key={c.id}
            as="button"
            type="button"
            onClick={() => { setDir(i > active ? 1 : -1); onChange(i) }}
            w={i === active ? '18px' : '6px'}
            h="6px"
            borderRadius="full"
            bg={i === active ? 'brand.dorado' : 'brand.humo'}
            transition="width 0.3s, background 0.3s"
            aria-label={`Ver ${c.title}`}
          />
        ))}
      </Flex>
    </Box>
  )
}

export function PhilosophySection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const boardRef   = useRef(null)
  const concepts   = coachData.philosophy
  const current    = concepts[active]

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } },
      { ref: boardRef, fromVars: { y: 40, opacity: 0 }, vars: { y: 0, opacity: 1 } },
    ],
    start: 'top 80%',
    end:   'top 40%',
  })

  return (
    <Box
      as="section"
      id="filosofia"
      ref={sectionRef}
      bg="brand.negro"
      pt={{ base: 16, lg: 20 }}
      pb={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
      borderTopLeftRadius={{ base: '14px', lg: '22px' }}
      borderTopRightRadius={{ base: '14px', lg: '22px' }}
      boxShadow="0 -24px 80px rgba(0,0,0,0.65)"
    >
      <Box maxW="1400px" mx="auto">
        <Box ref={titleRef} mb={{ base: 8, lg: 12 }}>
          <Text fontFamily="mono" fontSize="10px" color="brand.boneWarm"
            textTransform="uppercase" letterSpacing="widest">
            Modelo de juego
          </Text>
          <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
            color="brand.dorado" lineHeight={1}>
            Tácticas
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 5, lg: 0 }}
          alignItems="start">
          {/* Selector: slider con flechas en mobile, cards en desktop */}
          <GridItem order={{ base: 1, lg: 1 }} minW={0}>
            <Box display={{ base: 'block', lg: 'none' }}>
              <ConceptSlider concepts={concepts} active={active} onChange={setActive} />
            </Box>
            <VStack display={{ base: 'none', lg: 'flex' }} spacing={3} align="stretch">
              {concepts.map((concept, i) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  isActive={i === active}
                  onSelect={() => setActive(i)}
                />
              ))}
            </VStack>
          </GridItem>

          {/* Pizarra táctica */}
          <GridItem order={{ base: 2, lg: 2 }} minW={0}>
            <Flex ref={boardRef} direction="column" align="center" gap={4}>
              <Box
                w={{ base: '78%', md: '60%' }}
                display="flex"
                justifyContent="center"
                bg="brand.carbon"
                border="1px solid"
                borderColor="brand.linea"
                borderRadius="16px"
                p={{ base: 4, md: 2 }}
                position="relative"
                
              >
                <TacticalBoard mode={current.board} />
              </Box>
              <Flex align="center" gap={3}>
                <Text fontFamily="heading" fontSize="2xl" color="brand.dorado" lineHeight={1}>
                  {current.formation ?? coachData.formation}
                </Text>
                <Box w="1px" h="20px" bg="brand.linea" />
                <Text fontFamily="mono" fontSize="11px" color="brand.gray"
                  textTransform="uppercase" letterSpacing="0.2em">
                  {current.tag}
                </Text>
              </Flex>
              {/* Descripción del concepto activo (en desktop vive dentro de la card) */}
              <Text
                key={current.id}
                display={{ base: 'block', lg: 'none' }}
                fontFamily="body"
                fontSize="sm"
                color="brand.gray"
                lineHeight={1.7}
                textAlign="center"
                maxW="420px"
              >
                {current.text}
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

export default PhilosophySection
