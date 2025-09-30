import axios from "axios";

import { API_CONFIG, API_KEY } from "../config";

import {
  Competition,
  Standing,
  Scorer
} from "../types.js";

/**
 * Get top scorers in a competition
 * @param competitionCode - Competition code (e.g., 'PL', 'BL1', 'SA')
 * @param limit - Number of top scorers to return (default: 10)
 * @returns Promise<string> - Formatted string with top scorers
 */
export async function getTopScorers(
  competitionCode: string,
  limit: number = 10
): Promise<string> {
  try {
    const validLimit = Math.min(
      Math.max(1, limit),
      API_CONFIG.MAX_SCORERS_LIMIT
    );

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/competitions/${competitionCode}/scorers`,
      {
        headers: { "X-Auth-Token": API_KEY },
        params: { limit: validLimit },
      }
    );

    const scorers = response.data.scorers;
    if (!scorers || scorers.length === 0) {
      return `No scorer data found for competition '${competitionCode}'`;
    }

    let result = `Top Scorers in ${competitionCode.toUpperCase()}:\n\n`;
    result +=
      "Pos | Player                    | Team                    | Goals\n";
    result +=
      "----|---------------------------|-------------------------|------\n";

    scorers.forEach((scorer: Scorer, index: number) => {
      const pos = (index + 1).toString().padStart(3);
      const player = scorer.player.name.padEnd(26);
      const team = scorer.team.name.padEnd(23);
      const goals = scorer.goals.toString().padStart(5);

      result += `${pos} | ${player} | ${team} | ${goals}\n`;
    });

    return result;
  } catch (err: any) {
    console.error("Error getting top scorers:", err.message);

    if (err.response?.status === 404) {
      return `Competition '${competitionCode}' not found. Try: PL, BL1, SA, FL1, CL, EL`;
    }

    return "Error fetching top scorers from API";
  }
}

/**
 * Get all available competitions
 * @returns Promise<string> - Formatted string with list of competitions
 */
export async function getCompetitions(): Promise<string> {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/competitions`, {
      headers: { "X-Auth-Token": API_KEY },
    });

    const competitions = response.data.competitions;
    if (!competitions || competitions.length === 0) {
      return "No competitions found";
    }

    let result = "Available Competitions:\n\n";
    competitions.forEach((comp: Competition, index: number) => {
      result += `${index + 1}. ${comp.name} (${comp.code})\n`;
      result += `   Type: ${comp.type}\n`;
      result += `   ID: ${comp.id}\n\n`;
    });

    return result.trim();
  } catch (err: any) {
    console.error("Error getting competitions:", err.message);
    return "Error fetching competitions from API";
  }
}

/**
 * Get standings/league table for a competition
 * @param competitionCode - Competition code (e.g., 'PL', 'BL1', 'SA')
 * @returns Promise<string> - Formatted string with league standings
 */
export async function getStandings(competitionCode: string): Promise<string> {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/competitions/${competitionCode}/standings`,
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );

    const standings = response.data.standings;
    if (!standings || standings.length === 0) {
      return `No standings found for competition '${competitionCode}'`;
    }

    // Get the main table (usually the first one)
    const mainTable = standings[0]?.table;
    if (!mainTable || mainTable.length === 0) {
      return `No table data found for competition '${competitionCode}'`;
    }

    let result = `League Table for ${competitionCode.toUpperCase()}:\n\n`;
    result +=
      "Pos | Team                    | P | W | D | L | GF | GA | GD | Pts | Form\n";
    result +=
      "----|-------------------------|---|----|---|----|----|---|----|-----|-----\n";

    mainTable.forEach((standing: Standing) => {
      const pos = standing.position.toString().padStart(3);
      const team = standing.team.shortName.padEnd(24);
      const played = standing.playedGames.toString().padStart(1);
      const won = standing.won.toString().padStart(2);
      const draw = standing.draw.toString().padStart(1);
      const lost = standing.lost.toString().padStart(2);
      const goalsFor = standing.goalsFor.toString().padStart(2);
      const goalsAgainst = standing.goalsAgainst.toString().padStart(2);
      const goalDiff =
        (standing.goalDifference >= 0 ? "+" : "") +
        standing.goalDifference.toString();
      const goalDiffPadded = goalDiff.padStart(3);
      const points = standing.points.toString().padStart(3);
      const form = standing.form.padStart(5);

      result += `${pos} | ${team} | ${played} | ${won} | ${draw} | ${lost} | ${goalsFor} | ${goalsAgainst} | ${goalDiffPadded} | ${points} | ${form}\n`;
    });

    return result;
  } catch (err: any) {
    console.error("Error getting standings:", err.message);

    if (err.response?.status === 404) {
      return `Competition '${competitionCode}' not found. Try: PL, BL1, SA, FL1, CL, EL`;
    }

    return "Error fetching standings from API";
  }
}
