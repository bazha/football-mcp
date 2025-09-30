import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getStandings } from "../services/statistics";

export const registerGetStandings = (server: McpServer) => {
  server.registerTool(
    "get team's standing in champinoship",
    {
      title: "Show standing table in championship",
      description: "Show table with statics in current championship",
      inputSchema: {
        competitionCode: z
          .string({
            required_error: "competitionCode is required",
            invalid_type_error: "teamName must be a string",
          })
          .min(2, "Team name must be at least 2 characters long"),
      },
    },
    async ({ competitionCode }) => {
      console.error(
        `🔍 MCP Tool Called: getTeamNextMatch with competitionCode="${competitionCode}"`
      );
      const result = await getStandings(competitionCode);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    }
  );
};
