import { extendTheme } from '@chakra-ui/react'

// ─────────────────────────────────────────────────────────────
// Paleta FBC Melgar — extraída del escudo y la camiseta rojinegra.
//
//  · Rojo Melgar  → color de ACCIÓN: botones, hovers, líneas activas.
//  · Dorado lira  → color de PRESTIGIO: títulos, cifras, palmarés.
//  · Negro humo   → FONDO: es el único fondo donde rojo y dorado
//                   destacan a la vez sin competir entre sí.
//  · Verde laurel → micro-acento (usar con moderación).
// ─────────────────────────────────────────────────────────────
const brand = {
  // ── Tokens principales (usar estos en código nuevo) ──
  rojo:        '#C41E2A', // rojo Melgar (franja del escudo / camiseta)
  rojoLight:   '#E04A54', // rojo claro (hovers, estados activos)
  rojoDark:    '#8E1620', // granate (fondos de énfasis, hover de botón)
  granate:     '#5E0E15', // granate profundo (bordes, gradientes)
  dorado:      '#D9B627', // dorado lira/estrellas (títulos, bordes, cifras)
  doradoLight: '#F2D95C', // dorado claro (highlights, hover)
  doradoDark:  '#9C8214', // dorado apagado (detalles secundarios)
  negro:       '#0B0A0B', // fondo principal — negro profundo con matiz cálido
  carbon:      '#151315', // paneles / tarjetas elevadas
  humo:        '#221E20', // bordes neutros / divisores sólidos
  bone:        '#F7F4EE', // blanco cálido (texto principal)
  gray:        '#A79EA1', // texto secundario
  verde:       '#4C8C3C', // verde laurel del escudo (micro-acento)
  linea:       'rgba(247,244,238,0.08)',  // divisores sutiles
  doradoAlpha: 'rgba(217,182,39,0.10)',   // bg de hover dorado
  rojoAlpha:   'rgba(196,30,42,0.12)',    // bg de hover rojo

  // ── Alias legacy (nombres heredados del proyecto de jugador) ──
  // Mapean la vieja nomenclatura a la paleta Melgar para que los
  // componentes existentes se re-tinten sin refactor masivo.
  brown:       '#C41E2A',               // acento activo → rojo Melgar
  brownDark:   '#5E0E15',               // → granate profundo
  brownLight:  '#E04A54',               // → rojo claro
  amber:       '#D9B627',               // bordes / headings → dorado
  amber2:      'rgba(196,30,42,0.55)',  // bordes laterales → rojo translúcido
  amberDark:   '#8E1620',               // → granate
  amberLight:  'rgba(217,182,39,0.32)', // bordes suaves → dorado translúcido
  orange:      '#C99A1E',               // → dorado oscuro
  orangeDark:  '#8C6D12',
  orangeLight: '#E8CE55',
  dark:        '#0B0A0B',               // fondo → negro Melgar
  dark2:       '#B7B0B2',
  dark3:       'rgba(11,10,11,0.72)',   // navbar translúcida
  gray2:       '#C4525B',               // detalle rojizo (underscores, hovers)
  boneWarm:    '#E4CE7E',               // kickers de sección → dorado suave
  rec:         '#E5484D',               // indicador rojo vivo
  rose:        '#E04A54',
  panel:       '#151315',
  accent:      '#C41E2A',
  accentDeep:  '#8E1620',
  accentMid:   '#C41E2A',
  bgRef:       'rgba(217,182,39,0.10)', // bg de hover en cajas
}

// Colores de la firma del desarrollador (crédito en el footer)
const dev = {
  green: '#2D5A47',
  cream: '#E8D5A3',
}

const theme = extendTheme({
  colors: { brand, dev },
  fonts: {
    heading:   `'Bebas Neue', sans-serif`,
    body:      `'Barlow', sans-serif`,
    mono:      `'Barlow Condensed', sans-serif`,
  },
  styles: {
    global: {
      'html, body': {
        bg: brand.negro,
        color: brand.bone,
        overflowX: 'hidden',
      },
      '::selection': {
        bg: brand.rojo,
        color: brand.bone,
      },
      '::-webkit-scrollbar': { width: '4px' },
      '::-webkit-scrollbar-track': { bg: brand.negro },
      '::-webkit-scrollbar-thumb': { bg: brand.dorado, borderRadius: '2px' },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

export default theme
