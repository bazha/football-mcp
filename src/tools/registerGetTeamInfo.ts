import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getTeamInfo } from "../services/teams";

export const registerGetTeamInfo = (server: McpServer) => {
  server.registerTool(
    "getTeamInfo",
    {
      title: "Get Team Information",
      description:
        "Get information about a specific football team by name. Provide details like founding date, stadium, colors, and notable achievements.)",
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
        `ℹ️ MCP Tool Called: getTeamInfo with teamName="${teamName}"`
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

      const result = await getTeamInfo(teamName.trim());

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
