import axios from "axios";

import { Team } from "../types.js";
import { API_KEY, API_CONFIG } from '../config'

/**
 * Utility function to search for a team by name (case-insensitive partial match)
 */
export function findTeamInList(teams: Team[], teamName: string): Team | null {
  return (
    teams.find((team) =>
      team.name.toLowerCase().includes(teamName.toLowerCase())
    ) || null
  );
}

/**
 * Search for a team by name and return team information
 * @param teamName - Name of the football team to search for
 * @returns Promise<Team | null> - Team object or null if not found
 */
export async function findTeam(teamName: string): Promise<Team | null> {
  try {
    const teamsResp = await axios.get(`${API_CONFIG.BASE_URL}/teams`, {
      headers: { "X-Auth-Token": API_KEY },
      params: { limit: API_CONFIG.DEFAULT_LIMIT },
    });

    const team = findTeamInList(teamsResp.data.teams, teamName);
    return team || null;
  } catch (err: any) {
    console.error("Error finding team:", err.message);
    return null;
  }
}
