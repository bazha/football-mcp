import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getMatchesByDate } from "../services/matches";

export const registerGetMatchesByDate = (server: McpServer) => {
  server.registerTool(
    "registerGetMatchesByDate",
    {
      title: "Show matches by date",
      description: "Show football matches' results by date",
      inputSchema: {
        dateFrom: z.string(),
        dateTo: z.string(),
      },
    },
    async ({ dateFrom, dateTo }) => {
      const result = await getMatchesByDate(dateFrom, dateTo);

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
