export function docToMatch(data) {
  return {
    home:      { name: data.home_team, shield: data.home_shield || null },
    away:      { name: data.away_team, shield: data.away_shield || null },
    homeScore: data.home_score ?? null,
    awayScore: data.away_score ?? null,
    date:      data.match_date,
    stadium:   data.stadium || '',
    competition: data.competition || '',
  }
}


export const defaultMatches = {
  last: {
    home:      { name: 'FBC Melgar', shield: null },
    away:      { name: 'Alianza Lima', shield: null },
    homeScore: 2,
    awayScore: 1,
    date:      '05 Jul 2026',
    stadium:   'Monumental UNSA',
    competition: 'Liga 1 — Clausura',
  },
  next: {
    home:      { name: 'Universitario', shield: null },
    away:      { name: 'FBC Melgar', shield: null },
    homeScore: null,
    awayScore: null,
    date:      '19 Jul 2026',
    stadium:   'Monumental',
    competition: 'Liga 1 — Clausura',
  },
}
