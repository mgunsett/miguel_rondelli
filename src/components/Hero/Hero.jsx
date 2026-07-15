import { useRef, useEffect } from 'react'
import { Box, Text, Flex, HStack, Image, useToken } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MatchBox from './MatchBox'
import { coachData } from '../../data/coachData'
import useMatches from '../../hooks/useMatches'
// ⚠️ PLACEHOLDER — reemplazar por foto de fondo del DT (estadio / banca de Melgar)
import heroBg from '@assets/polaco3.webp'
import '../../styles/globals.css'

gsap.registerPlugin(ScrollTrigger)

function CoachPanel() {
  const [dorado] = useToken('colors', ['brand.dorado'])
  return (
    <Box>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={{ base: 2, md: 4 }}
      >
        <Text
          className="player-number"
          fontFamily="heading"
          fontSize={{ base: '110px', md: '100px' }}
          ml={{ base: '-10px', md: 0 }}
          lineHeight={0.9}
          color="transparent"
          sx={{ WebkitTextStroke: `2px ${dorado}` }}
        >
          {coachData.roleShort}
        </Text>
        <Box w={{ base: '60px', md: '1px' }} h={{ base: '1px', md: '70px', lg: '80px' }} bg="brand.dorado" />
        <Flex direction="column" justifyContent="flex-start" gap={1}>
          <Flex gap={1} justifyContent="flex-start" alignItems="center">
            <Text fontFamily="mono" fontSize={{ base: '9px', md: '10px' }} color="brand.bone"
              textTransform="uppercase" letterSpacing="widest">
              Rol
            </Text>
            <Text fontFamily="mono" fontSize={{ base: '9px', md: '12px' }} color="brand.dorado"
              fontWeight="700" textTransform="uppercase" letterSpacing="widest">
              {coachData.role}
            </Text>
          </Flex>
          <Flex justifyContent="flex-start" alignItems="center" gap={{ base: '10px', md: '12px' }}>
            <Image src={coachData.nationalityFlag} alt="" w={{ base: '15px', md: '20px' }} />
            <Text mb="-5px" fontFamily="mono" fontSize={{ base: 'xs', md: 'md' }} color="brand.dorado" letterSpacing="wider">
              {coachData.nationality}
            </Text>
          </Flex>
          <Flex justifyContent="flex-start" alignItems="flex-end" gap={{ base: '8px', md: '10px' }} mt="3px">
            {coachData.logoCurrentClub && (
              <Image src={coachData.logoCurrentClub} alt={`Escudo de ${coachData.currentClub}`}
                w={{ base: '20px', md: '28px' }} h={{ base: '20px', md: '30px' }} objectFit="contain" />
            )}
            <Text fontFamily="mono" fontSize={{ base: 'xs', md: 'md' }} color="brand.rojoLight"
              fontWeight="600" letterSpacing="wider" textTransform="uppercase">
              {coachData.currentClub}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Datos de impacto */}
      <HStack
        spacing={{ base: 4, md: 4 }}
        mt={{ base: 3, md: 2 }}
        divider={<Box w="1px" h="30px" bg="brand.linea" border="none" />}
      >
        {coachData.impact.map((item) => (
          <Box key={item.label}>
            <Text fontFamily="heading" fontSize={{ base: 'xl', md: '3xl' }} color="brand.dorado" lineHeight={1}>
              {item.value}
            </Text>
            <Text fontFamily="mono" fontSize={{ base: '8px', md: '10px' }} color="brand.gray"
              textTransform="uppercase" letterSpacing="widest" mt={1}>
              {item.label}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  )
}

export default function Hero() {
  const outerRef     = useRef(null)
  const containerRef = useRef(null)
  const photoRef     = useRef(null)
  const line1Ref     = useRef(null)
  const line2Ref     = useRef(null)
  const vignetteRef  = useRef(null)
  const { matches }  = useMatches()
  const [rojo] = useToken('colors', ['brand.rojo'])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo([line1Ref.current, line2Ref.current],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.4 }
      )
      gsap.fromTo(photoRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.6 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(vignetteRef.current,
        { opacity: 0.15 },
        {
          opacity: 0.75,
          ease: 'none',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top top',
            end: '+=80vh',
            scrub: 1.2,
          },
        }
      )
    }, outerRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box ref={outerRef} h="200vh" position="relative" zIndex={1} id="hero">
      <Box
        ref={containerRef}
        position="sticky"
        top={0}
        h="100vh"
        overflow="hidden"
        bg="brand.negro"
        sx={{
          maskImage: 'linear-gradient(black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(black 90%, transparent)',
          // dvh evita el salto al colapsar la barra del navegador en mobile; vh queda de fallback
          '@supports (height: 100dvh)': { height: '100dvh' },
        }}
      >
        {/* Foto de fondo — en base la imagen mide el 100% real del contenedor
            (que ya es dvh-aware) para que no se recorte contra la barra del navegador */}
        <Box
          position="absolute"
          inset={0}
          zIndex={0}
          pointerEvents="none"
          display="flex"
          justifyContent="center"
          alignItems={{ base: 'center', md: 'flex-start' }}
          mt={{ base: '60px', md: 12 }}
          ml={{ base: '0%', md: '4%' }}
          sx={{
            maskImage: {
              base: 'radial-gradient(120% 95% at 50% 45%, black 40%, transparent 82%)',
              md: 'radial-gradient(120% 90% at 50% 30%, black 35%, transparent 78%)',
            },
            WebkitMaskImage: {
              base: 'radial-gradient(120% 95% at 50% 45%, black 40%, transparent 82%)',
              md: 'radial-gradient(120% 90% at 50% 30%, black 35%, transparent 78%)',
            },
          }}
        >
          <Image
            src={heroBg}
            alt=""
            aria-hidden="true"
            draggable={false}
            w={{ base: '100%', md: '62vw' }}
            h={{ base: '100%', md: 'auto' }}
            objectFit={{ base: 'cover', md: 'contain' }}
            objectPosition={{ base: 'center', md: 'center top' }}
            opacity={{ base: 0.21, lg: 0.20 }}
            filter="grayscale(100%) contrast(1.05)"
            sx={{ mixBlendMode: 'luminosity' }}
          />
        </Box>

        {/* Foto Principal */}
        <Box
          position="absolute"
          inset={0}
          zIndex={{ base: 3, md: 5, lg: 9 }}
          pl={{ base: '27%', lg: '10%' }}
          pt={{ base: '24%', lg: '5%' }}
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          pointerEvents="none"
        >
          <Box
            ref={photoRef}
            h={{ base: '78vh', lg: '90vh' }}
            style={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
          >
            <Image
              className="player-photo"
              src={coachData.image}
              alt={`${coachData.displayName}, director técnico de ${coachData.currentClub}`}
              h={{ base: '90%', lg: '100%' }}
              w={{ base: '70vw', lg: '30vw' }}
              objectFit="contain"
              objectPosition="bottom center"
              draggable={false}
            />
          </Box>
        </Box>

        {/* Nombre gigante */}
        <Box
          className='player-name-giant'
          position="absolute"
          inset={0}
          zIndex={2}
          pointerEvents="none"
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent={{ base: 'flex-start', md: 'center' }}
          pl={{ base: 0, lg: '15%' }}
          pt={{ base: '22%', lg: '0%' }}
          mt={{ base: '5%', lg: '-4%' }}
        >
          <Flex direction="column" as="h1" overflow="hidden">
            <Text
              ref={line1Ref}
              as="span"
              display="block"
              fontFamily="heading"
              fontSize={{ base: '20vw', md: '11vw', lg: '9vw' }}
              color="transparent"
              lineHeight={0.9}
              style={{ opacity: 0 }}
              sx={{ WebkitTextStroke: `2px ${rojo}` }}
            >
              {coachData.name}
            </Text>
            <Text
              ref={line2Ref}
              as="span"
              display="block"
              fontFamily="heading"
              fontSize={{ base: '34vw', md: '16vw', lg: '13vw' }}
              color="brand.dorado"
              lineHeight={0.9}
              style={{ opacity: 0 }}
              mt={{ base: '-6px', md: '-14px', lg: '-20px' }}
            >
              {coachData.fullName}
            </Text>
          </Flex>
        </Box>

        {/* Info del DT — abajo a la izquierda */}
        <Box
          className="player-info"
          position="absolute"
          bottom={{ base: '20%', lg: '16%' }}
          left={{ base: '5%', lg: '39%' }}
          zIndex={15}
        >
          <CoachPanel />
        </Box>

        {/* MatchBox desktop */}
        <Box
          position="absolute"
          bottom="12%"
          right={0}
          top={{ base: 'auto', lg: '60%' }}
          zIndex={10}
          display={{ base: 'none', lg: 'block' }}
        >
          <MatchBox last={matches.last} next={matches.next} variant="card" />
        </Box>

        {/* MatchBox mobile */}
        <Box
          position="absolute"
          bottom={{ base: '30px', md: '40px' }}
          left={0}
          right={0}
          zIndex={15}
          display={{ base: 'block', lg: 'none' }}
        >
          <MatchBox last={matches.last} next={matches.next} variant="strip" />
        </Box>

        {/* Vignette */}
        <Box
          ref={vignetteRef}
          position="absolute"
          inset={0}
          zIndex={20}
          background="radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)"
          pointerEvents="none"
          style={{ opacity: 0.15 }}
        />
      </Box>
    </Box>
  )
}
