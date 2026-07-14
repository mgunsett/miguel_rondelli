import { FaInstagram } from 'react-icons/fa'
import { IoMdStats } from 'react-icons/io'

// Hero
import coachHero from '@assets/polaco1.webp'
import argentina from '@assets/argentina.webp'
// Escudos clubes
import escudoUcatolica from '@assets/escudos/escudo_ucatolica.webp'
import escudoMelgar from '@assets/escudo_melgar.webp'
import escudoCusco from '@assets/escudos/escudo_cusco.webp'
import escudoEmelec from '@assets/escudos/escudo_emelec.webp'
import escudoVelez from '@assets/escudos/escudo_velez.webp'
// Gallery
import image1 from '@assets/gallery/image1.webp'
import image2 from '@assets/gallery/image2.webp'
import image3 from '@assets/gallery/image3.webp'
import image4 from '@assets/gallery/image4.webp'
import image5 from '@assets/gallery/image5.webp'
import image6 from '@assets/gallery/image6.webp'
import image7 from '@assets/gallery/image7.webp'
import image8 from '@assets/gallery/image8.webp'
import image9 from '@assets/gallery/image9.webp'
// Logos de medios 
import logo1 from '@assets/logos/logo1.webp'
import logo2 from '@assets/logos/logo2.webp'
import logo3 from '@assets/logos/logo3.webp'

// Redes / contacto
import transfermkt from '@assets/contact2.svg'
import ledsports from '@assets/contact3.webp'
import moon from '@assets/contact4.webp'

const name = 'MIGUEL'
const fullName = 'RONDELLI'

// Fuentes de los datos de gestión (a jul 2026):
// Transfermarkt (perfil trainer/97916) y BeSoccer (coach 47890).
export const coachData = {
  name,
  fullName,
  initials: `${name[0]}${fullName[0]}`, // MR — para logos
  displayName: 'Miguel Ángel Rondelli',
  role: 'Director Técnico',
  roleShort: 'DT',
  nationality: 'Argentina',
  nationalityFlag: argentina,
  age: 48,
  birthDate: '24 / 01 / 1978',
  birthPlace: 'Buenos Aires, Argentina',
  currentClub: 'FBC Melgar',
  logoCurrentClub: escudoMelgar,
  formation: '4-2-3-1',
  image: coachHero,
  image2: image9,

  // Datos de impacto para el Hero
  impact: [
    { value: '+150', label: 'Partidos dirigidos' },
    { value: '75', label: 'Ganados' },
    { value: '4',    label: 'Clubes · 2 países' },
  ],

  // Tácticas
  philosophy: [
    {
      id: 'posesion',
      board: 'posesion',
      title: 'Protagonismo con la pelota',
      text: 'Equipos que toman iniciativa: salida limpia desde el fondo, circulación rápida y ataque posicional. Generando un 70% de posesión promedio en cada llegada.',
      tag: 'Posesión con propósito',
    },
    {
      id: 'presion',
      board: 'presion',
      title: 'Presión alta coordinada',
      text: 'Recuperación inmediata tras pérdida y bloque adelantado. La defensa se apoya lejos del arco propio: promedio de menos de un gol en contra por partido.',
      tag: 'Recuperar arriba',
    },
    {
      id: 'estructura',
      board: 'estructura',
      title: '4-2-3-1 flexible',
      text: 'Estructura base con doble pivote y un enganche libre entre líneas. El sistema muta en ataque a 3-2-5 con laterales interiores, y en defensa a un bloque medio compacto.',
      tag: 'Sistema adaptable',
    },
    {
      id: 'linea343',
      board: 'linea343',
      formation: '3-4-3',
      title: '3-4-3 en línea',
      text: 'Variante de apoyo: línea de tres centrales, mediocampo plano de cuatro con carrileros y tridente ofensivo. Un plan alternativo para ganar amplitud y presencia en campo rival.',
      tag: 'Variante de partido',
    },
  ],

  // ── Trayectoria como DT ──

  career: [
    {
      club: 'FBC Melgar',
      country: 'Perú',
      years: '2026 — Actualidad',
      role: 'Director Técnico',
      stage: 'primera',
      logo: escudoMelgar,
      shortName: 'MEL',
      record: { pj: 11, ppm: 1.64, pg: 5, pp: 3, pe: 3 },
      highlights: ['Proyecto 2026 – 2027', '5 triunfos en los primeros 9 partidos'],
    },
    {
      club: 'Cusco FC',
      country: 'Perú',
      years: '2023 — 2026',
      role: 'Director Técnico',
      stage: 'primera',
      logo: escudoCusco,
      shortName: 'CUS',
      record: { pj: 80, ppm: 1.79, pg: 41, pp: 19, pe: 20 },
      highlights: [
        'Subcampeón Liga 1 2025',
        'Clasificación a Copa Libertadores 2026',
        'Clasificación a Copa Sudamericana 2025',
      ],
    },
    {
      club: 'Emelec',
      country: 'Ecuador',
      years: '2023',
      role: 'Director Técnico',
      stage: 'primera',
      logo: escudoEmelec,
      shortName: 'EME',
      record: { pj: 19, ppm: 1.16, pg: 6, pp: 9, pe: 4 },
      highlights: [],
    },
    {
      club: 'Universidad Católica',
      country: 'Ecuador',
      years: '2021 — 2022',
      role: 'Director Técnico',
      stage: 'primera',
      logo: escudoUcatolica,
      shortName: 'UCA',
      record: { pj: 45, ppm: 1.69, pg: 22, pp: 13, pe: 10 },
      highlights: ['Debut como DT en primera división'],
    },
    {
      club: 'U. Católica — Formativas',
      country: 'Ecuador',
      years: '2018 — 2021',
      role: 'Formador',
      stage: 'formativas',
      logo: escudoUcatolica,
      shortName: 'UCA',
      record: null,
      highlights: ['Coordinación de divisiones juveniles'],
    },
    {
      club: 'Vélez Sarsfield — Inferiores',
      country: 'Argentina',
      years: '2006 — 2017',
      role: 'Formador',
      stage: 'formativas',
      logo: escudoVelez,
      shortName: 'VEL',
      record: null,
      highlights: ['Más de una década en el semillero de Vélez'],
    },
  ],

  // ── Palmarés / Logros a nivel club ──
  honors: [
    {
      icon: 'trophy',
      title: 'Subcampeón Liga 1',
      club: 'Cusco FC',
      year: '2025',
      detail: 'Mejor campaña en la historia del club: venció a Sporting Cristal en la final de playoffs.',
      featured: true,
    },
    {
      icon: 'ticket',
      title: 'Copa Libertadores',
      club: 'Cusco FC',
      year: '2026',
      detail: 'Clasificación directa a fase de grupos como subcampeón del acumulado.',
    },
    {
      icon: 'ticket',
      title: 'Copa Sudamericana',
      club: 'Cusco FC',
      year: '2025',
      detail: 'Primer torneo internacional del club en 5 años: 5º del acumulado 2024 con 60 puntos.',
    },
    {
      icon: 'academy',
      title: 'Formador de futbolistas',
      club: 'Vélez Sarsfield',
      year: '2006 – 2017',
      detail: 'Desarrollo de futbolistas en las divisiones juveniles con énfasis en formación integral.',
    },
  ],

  // ── Estadísticas de gestión (Transfermarkt / BeSoccer, jul 2026) ──
  managementStats: {
    kpis: [
      { label: 'Partidos dirigidos', value: 155 },
      { label: 'Victorias',          value: 75 },
      { label: 'Puntos por partido', value: 1.7, decimals: 1 },
      { label: 'Goles a favor / PJ', value: 1.8, decimals: 1 },
    ],
    winRate: 55.7, // % de victorias en toda la carrera
    record: { wins: 75, draws: 34, losses: 46 }, // victorias, empates y derrotas
    ppmByClub: [
      { club: 'U. Católica', short: 'UCA', years: '2021–22', ppm: 1.69, logo: escudoUcatolica },
      { club: 'Emelec',      short: 'EME', years: '2023',    ppm: 1.16, logo: escudoEmelec },
      { club: 'Cusco FC',    short: 'CUS', years: '2023–26', ppm: 1.79, logo: escudoCusco },
      { club: 'FBC Melgar',  short: 'MEL', years: '2026–',   ppm: 1.64, logo: escudoMelgar },
    ],
    ppmMax: 3, // techo teórico (todas victorias) para escalar el gráfico
  },

  // ── Cuerpo técnico ── ⚠️ PLACEHOLDER — completar con nombres reales y fotos
  staff: [
    {
      role: 'Asistente Técnico',
      name: 'A confirmar',
      photo: null,
      detail: 'Mano derecha en campo: dirige tareas tácticas y análisis del rival.',
    },
    {
      role: 'Preparador Físico',
      name: 'A confirmar',
      photo: null,
      detail: 'Cargas, prevención de lesiones y puesta a punto del plantel.',
    },
    {
      role: 'Analista de Video',
      name: 'A confirmar',
      photo: null,
      detail: 'Scouting, informes de rivales y métricas de rendimiento.',
    },
  ],

  // ── Prensa / Testimonios (artículos reales) ──
  press: [
    {
      media: 'Infobae',
      logo: logo1, // ⚠️ reemplazar por logo de Infobae
      title: 'Miguel Rondelli reivindica a Cusco FC tras gran 2025 pese al título de Universitario: “Fuimos el equipo que mejor jugó”',
      date: 'Diciembre 2025',
      url: 'https://www.infobae.com/peru/deportes/2025/12/15/miguel-rondelli-reivindica-a-cusco-fc-tras-gran-2025-pese-al-titulo-de-universitario-fuimos-el-equipo-que-mejor-jugo/',
    },
    {
      media: 'Fútbol Peruano',
      logo: logo2, // ⚠️ reemplazar por logo de Fútbol Peruano
      title: '“El campeón fue Universitario, pero el que mejor jugó fue Cusco”: el subcampeonato con sello de Rondelli',
      date: 'Diciembre 2025',
      url: 'https://www.futbolperuano.com/liga-1/noticias/miguel-rondelli-estalla-tras-el-subcampeonato-de-cusco-fc-el-campeon-fue-universitario-pero-el-que-mejor-jugo-fue-cusco-555257',
    },
    {
      media: 'ESPN',
      logo: logo3, // ⚠️ reemplazar por logo de ESPN
      title: 'Cusco FC anunció la continuidad de Miguel Rondelli: el proyecto que lo llevó a dirigir Copa Libertadores',
      date: 'Diciembre 2025',
      url: 'https://www.espn.com.ar/futbol/peru/nota/_/id/16018807/cusco-fc-continuidad-del-miguel-rondelli-2028-liga1',
    },
  ],

  // ── Galería ── ⚠️ PLACEHOLDER — ver nota en los imports
  gallery: [
    { id: 1, src: image1, alt: 'Miguel Rondelli', caption: 'Dirigiendo desde la banca',   category: 'Partido',      aspect: 'wide' },
    { id: 2, src: image2, alt: 'Miguel Rondelli', caption: 'Indicaciones al plantel',     category: 'Charla',       aspect: 'tall' },
    { id: 3, src: image3, alt: 'Miguel Rondelli', caption: 'Entrenamiento matutino',      category: 'Entrenamiento', aspect: 'square' },
    { id: 4, src: image4, alt: 'Miguel Rondelli', caption: 'Festejo con el equipo',       category: 'Festejo',      aspect: 'wide' },
    { id: 5, src: image5, alt: 'Miguel Rondelli', caption: 'Plantel 2026',                category: 'Equipo',       aspect: 'wide' },
    { id: 6, src: image6, alt: 'Miguel Rondelli', caption: 'Rueda de prensa',             category: 'Prensa',       aspect: 'tall' },
    { id: 7, src: image7, alt: 'Miguel Rondelli', caption: 'Charla técnica pre-partido',  category: 'Charla',       aspect: 'wide' },
    { id: 8, src: image8, alt: 'Miguel Rondelli', caption: 'Análisis de video',            category: 'Analisis',     aspect: 'tall' },
    { id: 9, src: image9, alt: 'Miguel Rondelli', caption: 'Concentración del plantel',    category: 'Concentración', aspect: 'wide' },
  ],

  socialMedia: [
    {
      label: 'Instagram',
      icon: FaInstagram,
      iconBg: FaInstagram,
      handle: '@miguelrondelli', // ⚠️ confirmar handle real
      url: 'https://www.instagram.com/',
      hoverColor: '#E1306C',
      hoverGradient: 'insta-gradient',
    },
    {
      label: 'TransferMarkt',
      image: transfermkt,
      iconBg: IoMdStats,
      handle: 'Perfil de entrenador',
      url: 'https://www.transfermarkt.com.ar/miguel-rondelli/profil/trainer/97916',
      hoverColor: 'brand.rojoLight',
    },
  ],

  // ⚠️ PLACEHOLDER — reemplazar por la representación real del DT
  contact: [
    {
      title:      'Representante Deportivo',
      label:      'Moon Sports Group',
      image:      moon,
      handle:     '@moonsportsgroup_',
      url:        'https://www.instagram.com/moonsportsgroup_/',
      hoverColor: 'rgba(196,30,42,0.18)',
    },
    {
      title:      'Contacto Marketing',
      label:      'led sports marketing',
      image:      ledsports,
      handle:     '@_ledsports',
      url:        'https://www.instagram.com/_ledsports/',
      hoverColor: 'rgba(217,182,39,0.18)',
    },
  ],
}
