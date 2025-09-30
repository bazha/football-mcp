import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetTeamNextMatch } from "./registerGetTeamNextMatch";
import { registerGetLiveMatches } from "./registerGetLiveMatches";
import { registerGetTeamResults } from "./registerGetTeamResults";
import { registerGetTeamInfo } from "./registerGetTeamInfo";

export const registerAllTools = (server: McpServer) => {
  registerGetTeamNextMatch(server);
  registerGetLiveMatches(server);
  registerGetTeamResults(server);
  registerGetTeamInfo(server);
};
