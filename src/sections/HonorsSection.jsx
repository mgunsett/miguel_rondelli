import { useRef, useEffect } from 'react'
import { Box, Grid, Text, Flex } from '@chakra-ui/react'
import { FaTrophy, FaTicketAlt, FaGraduationCap, FaMedal } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../hooks/useScrubReveal'
import { coachData } from '../data/coachData'

gsap.registerPlugin(ScrollTrigger)

const HONOR_ICONS = {
  trophy:  FaTrophy,
  ticket:  FaTicketAlt,
  academy: FaGraduationCap,
  medal:   FaMedal,
}

function HonorCard({ honor, index }) {
  const cardRef = useRef(null)
  const Icon = HONOR_ICONS[honor.icon] ?? FaMedal

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <Box
      ref={cardRef}
      role="group"
      style={{ opacity: 0 }}
      bg="brand.carbon"
      border="1px solid"
      borderColor={honor.featured ? 'brand.dorado' : 'brand.linea'}
      borderRadius="14px"
      p={{ base: 5, md: 7 }}
      position="relative"
      overflow="hidden"
      transition="border-color 0.35s, transform 0.35s, background 0.35s"
      _hover={{
        borderColor: 'brand.dorado',
        transform: 'translateY(-4px)',
        bg: 'brand.doradoAlpha',
      }}
    >
      {/* Watermark */}
      <Box
        position="absolute"
        right="-20px"
        bottom="-30px"
        color={honor.featured ? 'brand.dorado' : 'brand.bone'}
        opacity={0.06}
        pointerEvents="none"
        transition="opacity 0.4s, color 0.4s"
        _groupHover={{ opacity: 0.12, color: 'brand.dorado' }}
      >
        <Box as={Icon} fontSize="150px" />
      </Box>

      <Flex align="flex-start" justify="space-between" position="relative">
        <Box
          as={Icon}
          fontSize="30px"
          color={honor.featured ? 'brand.dorado' : 'brand.gray'}
          transition="color 0.35s"
          _groupHover={{ color: 'brand.dorado' }}
        />
        <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }}
          color={honor.featured ? 'brand.dorado' : 'brand.gray'}
          lineHeight={1}
          transition="color 0.35s"
          _groupHover={{ color: 'brand.doradoLight' }}>
          {honor.year}
        </Text>
      </Flex>

      <Box position="relative" mt={{ base: 5, md: 8 }}>
        <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} color="brand.bone" lineHeight={1}>
          {honor.title}
        </Text>
        <Text fontFamily="mono" fontSize="10px" color="brand.rojoLight"
          textTransform="uppercase" letterSpacing="0.2em" mt={2}>
          {honor.club}
        </Text>
        <Text fontFamily="body" fontSize={{ base: 'xs', md: 'sm' }} color="brand.gray"
          lineHeight={1.6} mt={3}>
          {honor.detail}
        </Text>
      </Box>
    </Box>
  )
}

export function HonorsSection() {
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
      id="palmares"
      ref={sectionRef}
      bg="brand.negro"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        <Box ref={titleRef} mb={{ base: 8, lg: 10 }}>
          <Text fontFamily="mono" fontSize="10px" color="brand.boneWarm"
            textTransform="uppercase" letterSpacing="widest">
            Logros a nivel club
          </Text>
          <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
            color="brand.dorado" lineHeight={1}>
            Palmarés
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={5}>
          {coachData.honors.map((honor, i) => (
            <HonorCard key={honor.title + honor.year} honor={honor} index={i} />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default HonorsSection
