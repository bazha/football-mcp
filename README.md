# Football MCP

## Overview
Football MCP exposes football-data.org information through a Model Context Protocol server implemented in TypeScript. It boots an MCP server over stdio (`src/server.ts`) and requires a `FOOTBALL_API_KEY` environment variable for all outbound API calls.

## Architecture
- **Server layer** – `src/server.ts` configures the `McpServer`, loads environment-backed config from `src/config.ts`, and connects via `StdioServerTransport`.
- **Tool registrations** – Files under `src/tools` register MCP tools, validate inputs with `zod`, and delegate to service functions; `registerAllTools` wires the exposed tool set.
- **Service layer** – `src/services` wraps `axios` requests against the football-data API for matches, statistics, and team data, formatting human-readable responses for MCP clients.
- **Shared utilities** – `src/utilities/teams.ts` and `src/utils.ts` provide reusable helpers (team lookup, date formatting) while `src/types.ts` centralises API response typing.
- **Configuration** – `src/config.ts` exports constants such as the API base URL, limits, and standard competition codes.

## Development
1. Install dependencies: `npm install`.
2. Set `FOOTBALL_API_KEY` (copy `.env.example` to `.env` and fill in the key).
3. Run the server in watch mode with `npm run dev`, or compile with `npm run build` and start the compiled output via `npm start`.

## Notes & Thoughts
- The separation between tools, services, and utilities keeps concerns clear and makes it easy to extend with new MCP endpoints.
- Input validation via `zod` and typed service contracts contribute to reliability when interacting with external APIs.
- Consider wiring currently unused registrations (e.g. goal scorer and standings tools) into `registerAllTools` to expose the full feature set.
