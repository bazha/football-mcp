import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getTeamResults } from "../services/teams";

export const registerGetTeamResults = (server: McpServer) => {
  server.registerTool(
    "getTeamResults",
    {
      title: "Get Team Recent Results",
      description:
        "Get recent match results for a football team (shows last 5 matches by default)",
      inputSchema: {
        teamName: z
          .string({
            required_error: "teamName is required",
            invalid_type_error: "teamName must be a string",
          })
          .min(2, "Team name must be at least 2 characters long"),
        limit: z.number(),
      },
    },
    async ({ teamName, limit = 5 }) => {
      console.error(
        `🏆 MCP Tool Called: getTeamResults with teamName="${teamName}", limit="${limit}"`
      );

      if (
        !teamName ||
        typeof teamName !== "string" ||
        teamName.trim().length < 2
      ) {
        console.error(`❌ Invalid input: teamName="${teamName}"`);
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

      const resultLimit =
        limit && typeof limit === "number" && limit > 0 && limit <= 20
          ? limit
          : 5;

      console.error(
        `📊 Getting results for team: "${teamName.trim()}", limit: ${resultLimit}`
      );
      const result = await getTeamResults(teamName.trim(), resultLimit);
      console.error(`✅ Results: ${result}`);

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
