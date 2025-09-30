/**
 * Type definitions for Football MCP Server
 * All interfaces and types for the football data API
 */

// Basic team interface
export interface Team {
  id: number;
  name: string;
  shortName: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  website?: string;
}

// Match interface
export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string;
  lastUpdated: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  };
}

// Competition interface
export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

// Standing interface for league tables
export interface Standing {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  playedGames: number;
  form: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

// Player interface
export interface Player {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  shirtNumber?: number;
}

// Scorer interface for top scorers
export interface Scorer {
  player: {
    id: number;
    name: string;
  };
  team: {
    id: number;
    name: string;
  };
  goals: number;
  assists?: number;
  penalties?: number;
}

export interface StandingsResponse {
  standings: Array<{
    type: string;
    table: Standing[];
  }>;
}

export interface SquadResponse {
  squad: Player[];
}

export interface ScorersResponse {
  scorers: Scorer[];
}

// Utility types
export type MatchResult = 'W' | 'L' | 'D'; // Win, Loss, Draw
