import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getLiveMatches } from "../services/matches";

export const registerGetLiveMatches = (server: McpServer) => {
  server.registerTool(
    "get live matches result",
    {
      title: "Show live matches results",
      description: "Get live matches and show results",
    },
    async () => {
      const result = await getLiveMatches();
      console.error(`🔍 MCP Tool Called: getLiveMatches`);
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
