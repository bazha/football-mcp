import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getTeamNextMatch } from "../services/matches";

export const registerGetTeamNextMatch = (server: McpServer) => {
  server.registerTool(
    "getTeamNextMatch",
    {
      title: "Get Team Next Match",
      description: "Get the next scheduled match for a football team",
      inputSchema: {
        teamName: z
          .string({
            required_error: "teamName is required",
            invalid_type_error: "teamName must be a string",
          })
          .min(2, "Team name must be at least 2 characters long"),
      },
    },
    async ({ teamName }) => {
      console.error(
        `🔍 MCP Tool Called: getTeamNextMatch with teamName="${teamName}"`
      );

      if (
        !teamName ||
        typeof teamName !== "string" ||
        teamName.trim().length < 2
      ) {

        return {
          content: [
            {
              type: "text",
              text: "Error: Team name must be at least 2 characters long",
            },
          ],
          isError: true,
        };
      }

      console.error(`🏈 Searching for team: "${teamName.trim()}"`);
      const result = await getTeamNextMatch(teamName.trim());

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
