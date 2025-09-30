import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";;

import { registerAllTools } from './tools';

import { API_KEY } from './config';

const server = new McpServer({
  name: "MatchDay MCP",
  version: "1.0.0",
});

registerAllTools(server);

const main = async () => {
  try {
    if (!API_KEY) {
      console.error("Error: FOOTBALL_API_KEY environment variable is required");
      process.exit(1);
    }

    console.error("Starting Football MCP Server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Football MCP Server connected successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error("Unhandled server error:", error);
  process.exit(1);
});
