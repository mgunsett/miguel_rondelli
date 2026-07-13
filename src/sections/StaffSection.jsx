import { useRef, useEffect } from 'react'
import { Box, Grid, Text, Flex, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../hooks/useScrubReveal'
import { coachData } from '../data/coachData'

gsap.registerPlugin(ScrollTrigger)

function getInitials(role = '') {
  return role
    .split(/\s+/)
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function StaffCard({ member, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7,
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
      borderColor="brand.linea"
      borderRadius="14px"
      p={{ base: 5, md: 7 }}
      textAlign="center"
      transition="border-color 0.35s, transform 0.35s, background 0.35s"
      _hover={{
        borderColor: 'brand.dorado',
        transform: 'translateY(-4px)',
        bg: 'brand.doradoAlpha',
      }}
    >
      <Flex
        boxSize="86px"
        mx="auto"
        borderRadius="full"
        overflow="hidden"
        align="center"
        justify="center"
        bg="brand.negro"
        border="2px solid"
        borderColor="brand.dorado"
        transition="box-shadow 0.35s"
        _groupHover={{ boxShadow: '0 0 0 4px rgba(217,182,39,0.25)' }}
      >
        {member.photo ? (
          <Image src={member.photo} alt={`${member.name}, ${member.role}`}
            boxSize="100%" objectFit="cover" loading="lazy" />
        ) : (
          <Text fontFamily="heading" fontSize="2xl" color="brand.dorado" lineHeight={1}>
            {getInitials(member.role)}
          </Text>
        )}
      </Flex>

      <Text fontFamily="mono" fontSize="10px" color="brand.rojoLight"
        textTransform="uppercase" letterSpacing="0.22em" mt={5}>
        {member.role}
      </Text>
      <Text fontFamily="heading" fontSize="2xl" color="brand.bone" lineHeight={1.1} mt={1}>
        {member.name}
      </Text>
      <Text fontFamily="body" fontSize="xs" color="brand.gray" lineHeight={1.6} mt={3}>
        {member.detail}
      </Text>
    </Box>
  )
}

export function StaffSection() {
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
      id="cuerpo-tecnico"
      ref={sectionRef}
      bg="brand.negro"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        <Box ref={titleRef} mb={{ base: 8, lg: 10 }}>
          <Text fontFamily="mono" fontSize="10px" color="brand.boneWarm"
            textTransform="uppercase" letterSpacing="widest">
            Equipo de trabajo
          </Text>
          <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
            color="brand.dorado" lineHeight={1}>
            Cuerpo Técnico
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={5}>
          {coachData.staff.map((member, i) => (
            <StaffCard key={member.role} member={member} index={i} />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default StaffSection
