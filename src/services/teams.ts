import axios from "axios";

import { API_KEY, API_CONFIG } from "../config";
import { findTeam, findTeamInList } from "../utilities/teams.js";

import { Player } from "../types.js";

/**
 * Get team form from recent matches (FREE FEATURE)
 * @param teamName - Name of the football team
 * @param limit - Number of recent matches to analyze (default: 5)
 * @returns Promise<string> - Formatted string with team form
 */
export async function getTeamForm(
  teamName: string,
  limit: number = 5
): Promise<string> {
  try {
    const validLimit = Math.min(
      Math.max(1, limit),
      API_CONFIG.MAX_FORM_MATCHES
    );

    const team = await findTeam(teamName);
    if (!team) {
      return `Team '${teamName}' not found`;
    }

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/teams/${team.id}/matches`,
      {
        headers: { "X-Auth-Token": API_KEY },
        params: {
          status: "FINISHED",
          limit: validLimit,
        },
      }
    );

    const matches = response.data.matches;
    if (!matches || matches.length === 0) {
      return `No recent matches found for team '${teamName}'`;
    }

    // Calculate form
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let formString = "";

    matches.reverse().forEach((match: any) => {
      const homeScore = match.score.fullTime.home || 0;
      const awayScore = match.score.fullTime.away || 0;

      let result: "W" | "D" | "L";
      if (teamName.toLowerCase().includes(match.homeTeam.name.toLowerCase())) {
        // Team was home
        if (homeScore > awayScore) result = "W";
        else if (homeScore < awayScore) result = "L";
        else result = "D";
      } else {
        // Team was away
        if (awayScore > homeScore) result = "W";
        else if (awayScore < homeScore) result = "L";
        else result = "D";
      }

      if (result === "W") wins++;
      else if (result === "D") draws++;
      else losses++;

      formString += result;
    });

    const winRate = ((wins / matches.length) * 100).toFixed(1);
    const points = wins * 3 + draws;

    let result = `Team Form for ${teamName} (Last ${matches.length} matches):\n\n`;
    result += `Form: ${formString}\n`;
    result += `Wins: ${wins} | Draws: ${draws} | Losses: ${losses}\n`;
    result += `Points: ${points}/${matches.length * 3}\n`;
    result += `Win Rate: ${winRate}%\n\n`;

    result += "Recent Results:\n";
    matches.forEach((match: any, index: number) => {
      const homeTeam = match.homeTeam.shortName;
      const awayTeam = match.awayTeam.shortName;
      const homeScore = match.score.fullTime.home;
      const awayScore = match.score.fullTime.away;
      const date = new Date(match.utcDate).toLocaleDateString();

      let matchResult: "W" | "D" | "L";
      if (teamName.toLowerCase().includes(match.homeTeam.name.toLowerCase())) {
        if (homeScore > awayScore) matchResult = "W";
        else if (homeScore < awayScore) matchResult = "L";
        else matchResult = "D";
      } else {
        if (awayScore > homeScore) matchResult = "W";
        else if (awayScore < homeScore) matchResult = "L";
        else matchResult = "D";
      }

      result += `${
        index + 1
      }. ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} (${matchResult}) - ${date}\n`;
    });

    return result;
  } catch (err: any) {
    console.error("Error getting team form:", err.message);
    return "Error fetching team form from API";
  }
}

/**
 * Get team squad/roster
 * @param teamName - Name of the football team
 * @returns Promise<string> - Formatted string with team squad
 */
export async function getTeamSquad(teamName: string): Promise<string> {
  try {
    const team = await findTeam(teamName);
    if (!team) return `Team '${teamName}' not found`;

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/teams/${team.id}`,
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );

    const squad = response.data.squad;
    if (!squad || squad.length === 0) {
      return `No squad information available for team '${teamName}'`;
    }

    // Group players by position
    const playersByPosition: { [key: string]: Player[] } = {};
    squad.forEach((player: Player) => {
      if (!playersByPosition[player.position]) {
        playersByPosition[player.position] = [];
      }
      playersByPosition[player.position].push(player);
    });

    let result = `Squad for ${teamName}:\n\n`;

    // Define position order
    const positionOrder = ["Goalkeeper", "Defence", "Midfield", "Offence"];

    positionOrder.forEach((position) => {
      if (playersByPosition[position]) {
        result += `${position}s:\n`;
        playersByPosition[position].forEach((player) => {
          const age =
            new Date().getFullYear() -
            new Date(player.dateOfBirth).getFullYear();
          const shirtNum = player.shirtNumber ? ` #${player.shirtNumber}` : "";
          result += `  • ${player.name}${shirtNum} (${player.nationality}, ${age} years old)\n`;
        });
        result += "\n";
      }
    });

    // Add any other positions not in the standard order
    Object.keys(playersByPosition).forEach((position) => {
      if (!positionOrder.includes(position)) {
        result += `${position}s:\n`;
        playersByPosition[position].forEach((player) => {
          const age =
            new Date().getFullYear() -
            new Date(player.dateOfBirth).getFullYear();
          const shirtNum = player.shirtNumber ? ` #${player.shirtNumber}` : "";
          result += `  • ${player.name}${shirtNum} (${player.nationality}, ${age} years old)\n`;
        });
        result += "\n";
      }
    });

    return result.trim();
  } catch (err: any) {
    console.error("Error getting team squad:", err.message);
    return "Error fetching team squad from API";
  }
}

/**
 * Get team statistics and information
 * @param teamName - Name of the football team
 * @returns Promise<string> - Formatted string with team information
 */
export async function getTeamInfo(teamName: string): Promise<string> {
  try {
    const team = await findTeam(teamName);
    if (!team) return `Team '${teamName}' not found`;

    return `Team Information for ${teamName}:
- Full Name: ${team.name}
- Short Name: ${team.shortName}
- Founded: ${team.founded || "Unknown"}
- Colors: ${team.clubColors || "Unknown"}
- Venue: ${team.venue || "Unknown"}
- Website: ${team.website || "Not available"}`;
  } catch (err: any) {
    console.error("Error getting team info:", err.message);
    return "Error fetching team information from API";
  }
}

/**
 * Get recent match results for a football team
 * @param teamName - Name of the football team to search for
 * @param limit - Number of recent matches to return (default: 5, max: 20)
 * @returns Promise<string> - Formatted string with recent match results
 */
export async function getTeamResults(
  teamName: string,
  limit: number = 5
): Promise<string> {
  try {
    // Validate limit
    const validLimit = Math.min(
      Math.max(1, limit),
      API_CONFIG.MAX_RESULTS_LIMIT
    );

    // First, search for teams to get the team ID
    const teamsResp = await axios.get(`${API_CONFIG.BASE_URL}/teams`, {
      headers: { "X-Auth-Token": API_KEY },
      params: { limit: API_CONFIG.DEFAULT_LIMIT },
    });

    const team = findTeamInList(teamsResp.data.teams, teamName);
    if (!team) return `Team '${teamName}' not found`;

    const teamId = team.id;

    // Get recent finished matches for the team
    const matchesResp = await axios.get(
      `${API_CONFIG.BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=${validLimit}`,
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );

    const matches = matchesResp.data.matches;
    if (!matches || matches.length === 0) {
      return `No recent results found for team '${teamName}'`;
    }

    // Format the results
    let results = `Recent results for ${teamName}:\n\n`;

    matches.forEach((match: any, index: number) => {
      const homeTeam = match.homeTeam.name;
      const awayTeam = match.awayTeam.name;
      const homeScore = match.score.fullTime.home;
      const awayScore = match.score.fullTime.away;
      const matchDate = new Date(match.utcDate).toLocaleDateString();

      // Determine if the team won, lost, or drew
      let result = "";
      if (teamName.toLowerCase().includes(homeTeam.toLowerCase())) {
        // Team was home
        if (homeScore > awayScore) result = "W";
        else if (homeScore < awayScore) result = "L";
        else result = "D";
      } else {
        // Team was away
        if (awayScore > homeScore) result = "W";
        else if (awayScore < homeScore) result = "L";
        else result = "D";
      }

      results += `${
        index + 1
      }. ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} (${result}) - ${matchDate}\n`;
    });

    return results.trim();
  } catch (err: any) {
    console.error("API Error:", err.message);

    if (err.response?.status === 401) {
      return "Authentication error: Please check your API key";
    } else if (err.response?.status === 429) {
      return "Rate limit exceeded: Please try again later";
    } else if (err.response?.status >= 500) {
      return "Server error: Football API is temporarily unavailable";
    }

    return "Error fetching match results from API";
  }
}
