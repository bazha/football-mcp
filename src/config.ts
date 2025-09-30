export const API_KEY = process.env.FOOTBALL_API_KEY;

// Configuration constants
export const API_CONFIG = {
  BASE_URL: "https://api.football-data.org/v4",
  DEFAULT_LIMIT: 100,
  MAX_RESULTS_LIMIT: 20,
  MAX_SCORERS_LIMIT: 20,
  MAX_FORM_MATCHES: 10,
  MAX_DATE_MATCHES: 50,
} as const;

// Common competition codes
export const COMPETITION_CODES = {
  PREMIER_LEAGUE: "PL",
  BUNDESLIGA: "BL1",
  SERIE_A: "SA",
  LIGUE_1: "FL1",
  LA_LIGA: "PD",
  CHAMPIONS_LEAGUE: "CL",
  EUROPA_LEAGUE: "EL",
  EREDIVISIE: "DED",
} as const;