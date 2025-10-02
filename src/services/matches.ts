import axios from "axios";

import { findTeamInList } from "../utilities/teams";
import { Match, MatchResult } from "../types.js";
import { API_KEY, API_CONFIG } from '../config';
import { formatMatchDate } from '../utils.js';

/**
 * Get the next scheduled match for a football team
 * @param teamName - Name of the football team to search for
 * @returns Promise<string> - Formatted string with next match information
 */
export async function getTeamNextMatch(teamName: string): Promise<string> {
  try {
    // First, search for teams to get the team ID
    const teamsResp = await axios.get(`${API_CONFIG.BASE_URL}/teams`, {
      headers: { "X-Auth-Token": API_KEY },
      params: { limit: API_CONFIG.DEFAULT_LIMIT },
    });

    const team = findTeamInList(teamsResp.data.teams, teamName);
    if (!team) return `Team '${teamName}' not found`;

    const teamId = team.id;

    // Then get matches for the specific team
    const matchesResp = await axios.get(
      `${API_CONFIG.BASE_URL}/teams/${teamId}/matches?status=SCHEDULED&limit=1`,
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );

    const nextMatch = matchesResp.data.matches[0];
    if (!nextMatch) return `No upcoming matches found for team '${teamName}'`;

    return `Next match for ${teamName}: ${nextMatch.homeTeam.name} vs ${
      nextMatch.awayTeam.name
    } on ${formatMatchDate(nextMatch.utcDate)}`;
  } catch (err: any) {
    console.error("API Error:", err.message);

    if (err.response?.status === 401) {
      return "Authentication error: Please check your API key";
    } else if (err.response?.status === 429) {
      return "Rate limit exceeded: Please try again later";
    } else if (err.response?.status >= 500) {
      return "Server error: Football API is temporarily unavailable";
    }

    return "Error fetching match data from API";
  }
}

/**
 * Determine match result for a team
 */
export function getMatchResult(match: string, teamName: string) {
//   const homeScore = match?.score.fullTime.home || 0;
//   const awayScore = match?.score.fullTime.away || 0;

  const isHomeTeam = teamName
    .toLowerCase()
    // .includes(match?.homeTeam.name.toLowerCase());

//   if (isHomeTeam) {
//     if (homeScore > awayScore) return "W";
//     if (homeScore < awayScore) return "L";
//     return "D";
//   } else {
//     if (awayScore > homeScore) return "W";
//     if (awayScore < homeScore) return "L";
//     return "D";
//   }
    return "D"
}

/**
 * Get currently live matches
 * @returns Promise<string> - Formatted string with live matches
 */
export async function getLiveMatches(): Promise<string> {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/matches`, {
      headers: { "X-Auth-Token": API_KEY },
      params: { status: "LIVE" },
    });

    const matches = response.data.matches;
    if (!matches || matches.length === 0) {
      return "No live matches currently playing";
    }

    let result = "Live Matches:\n\n";
    matches.forEach((match: any, index: number) => {
      const homeTeam = match.homeTeam.name;
      const awayTeam = match.awayTeam.name;
      const homeScore =
        match.score.fullTime.home || match.score.halfTime.home || 0;
      const awayScore =
        match.score.fullTime.away || match.score.halfTime.away || 0;
      const minute = match.minute || "HT";
      const competition = match.competition.name;

      result += `${
        index + 1
      }. ${homeTeam} ${homeScore}-${awayScore} ${awayTeam}\n`;
      result += `   ${competition} - ${minute}'\n`;
      result += `   Status: ${match.status}\n\n`;
    });

    return result.trim();
  } catch (err: any) {
    console.error("Error getting live matches:", err.message);
    return "Error fetching live matches from API";
  }
}

/**
 * Get matches by date range
 * @param dateFrom - Start date in YYYY-MM-DD format
 * @param dateTo - End date in YYYY-MM-DD format
 * @returns Promise<string> - Formatted string with matches
 */
export async function getMatchesByDate(
  dateFrom: string,
  dateTo: string
): Promise<string> {
  try {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateFrom) || !dateRegex.test(dateTo)) {
      return "Error: Dates must be in YYYY-MM-DD format (e.g., 2024-01-15)";
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/matches`, {
      headers: { "X-Auth-Token": API_KEY },
      params: {
        dateFrom,
        dateTo,
        limit: API_CONFIG.MAX_DATE_MATCHES,
      },
    });

    const matches = response.data.matches;
    if (!matches || matches.length === 0) {
      return `No matches found between ${dateFrom} and ${dateTo}`;
    }

    // Group matches by date
    const matchesByDate: { [key: string]: Match[] } = {};
    matches.forEach((match: Match) => {
      const date = match.utcDate.split("T")[0];
      if (!matchesByDate[date]) {
        matchesByDate[date] = [];
      }
      matchesByDate[date].push(match);
    });

    let result = `Matches from ${dateFrom} to ${dateTo}:\n\n`;

    Object.keys(matchesByDate)
      .sort()
      .forEach((date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        result += `📅 ${formattedDate}\n`;
        result += "─".repeat(50) + "\n";

        matchesByDate[date].forEach((match) => {
          const homeTeam = match.homeTeam.shortName;
          const awayTeam = match.awayTeam.shortName;
          const homeScore = match.score.fullTime.home ?? "-";
          const awayScore = match.score.fullTime.away ?? "-";
          const status = match.status;
          const competition = match.competition.name;
          const time = new Date(match.utcDate).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          result += `${time} | ${homeTeam} ${homeScore}-${awayScore} ${awayTeam}\n`;
          result += `     ${competition} - ${status}\n\n`;
        });
      });

    return result.trim();
  } catch (err: any) {
    console.error("Error getting matches by date:", err.message);
    return "Error fetching matches from API";
  }
}
