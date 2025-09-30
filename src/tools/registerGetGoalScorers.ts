import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getTopScorers } from "../services/statistics";

const registerGetGoalScorers = (server: McpServer) => {
  server.registerTool(
    "goalScorer",
    {
      title: "Get goal scorer in championships",
      description: "Top 10 goal scorers in championships",
      inputSchema: {
        competitionCode: z
          .string({
            required_error: "competitionCode is required",
            invalid_type_error: "competitionCode must be a string",
          })
          .min(2, "Team name must be at least 2 characters long"),
        limit: z.number(),
      },
    },
    async ({ competitionCode, limit }) => {
      if (
        !competitionCode ||
        typeof competitionCode !== "string" ||
        competitionCode.trim().length < 2
      ) {
        console.error(`❌ Invalid input: championships="${competitionCode}"`);
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
      const result = await getTopScorers(competitionCode, limit);

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
