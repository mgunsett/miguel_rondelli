import { useState, useRef } from 'react'
import { Box, Grid, GridItem, Text, Flex, VStack } from '@chakra-ui/react'
import { FaFutbol, FaUsers } from 'react-icons/fa'
import { FiTarget, FiGrid } from 'react-icons/fi'
import useScrubReveal from '../hooks/useScrubReveal'
import { coachData } from '../data/coachData'
import TacticalBoard from '../components/Tactical/TacticalBoard'

const CONCEPT_ICONS = {
  posesion:   FaFutbol,
  presion:    FiTarget,
  estructura: FiGrid,
  formacion:  FaUsers,
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
            Filosofía
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1.1fr 1fr' }} gap={{ base: 10, lg: 16 }}
          alignItems="center">
          {/* Conceptos */}
          <GridItem order={{ base: 2, lg: 1 }}>
            <VStack spacing={3} align="stretch">
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
          <GridItem order={{ base: 1, lg: 2 }}>
            <Flex ref={boardRef} direction="column" align="center" gap={4}>
              <Box
                w="100%"
                display="flex"
                justifyContent="center"
                bg="brand.carbon"
                border="1px solid"
                borderColor="brand.linea"
                borderRadius="16px"
                p={{ base: 4, md: 6 }}
                position="relative"
                _before={{
                  content: '""', position: 'absolute', top: 0, left: 6,
                  w: '48px', h: '2px', bg: 'brand.rojo',
                }}
              >
                <TacticalBoard mode={current.board} />
              </Box>
              <Flex align="center" gap={3}>
                <Text fontFamily="heading" fontSize="2xl" color="brand.dorado" lineHeight={1}>
                  {coachData.formation}
                </Text>
                <Box w="1px" h="20px" bg="brand.linea" />
                <Text fontFamily="mono" fontSize="11px" color="brand.gray"
                  textTransform="uppercase" letterSpacing="0.2em">
                  {current.tag}
                </Text>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

export default PhilosophySection
