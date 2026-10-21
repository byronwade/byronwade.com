---
title: "Memoria: The Memory Your AI Lacks"
url: "https://memoria.byronwade.com"
category: "Product"
date: 2025-12-04
excerpt: "An MCP server that keeps AI from breaking your code by exposing hidden file dependencies through fast, local git forensics."
status: "Archived"
featured: false
---

# Memoria: Keeping AI From Breaking Your Code

I built **Memoria** after watching AI assistants refactor code perfectly in isolation, only to crash the app because another file depended on the old behavior. Imports don't tell the full story, git history does. Memoria is the guardrail that exposes hidden coupling before your AI ships a regression.

---

## Why Memoria Exists

### The Failure Pattern

You ask an AI to update `route.ts`. It ships the change confidently. Production blows up because `billing.tsx` relied on a subtle side effect. There were no imports between them, so the AI never saw the dependency.

### The Requirements

- **Local-first**: Analyze the repo without sending code to any server.
- **Low friction**: One small config entry for the common MCP clients (Claude Code, Claude Desktop, Cursor, Windsurf, Cline).
- **Actionable**: Return coupled files, risk scores, and a checklist the AI can follow immediately.
- **Fast**: About a tenth of a second for a full analysis, and cached results for iterative work.

---

## What Memoria Does

**Reveals hidden coupling** by mining git history to find files that change together, even without imports.
**Assigns a risk score** so you and the AI know when to slow down.
**Surfaces static dependents** using git grep to catch direct importers.
**Builds a pre-flight checklist** of files to verify or update before the change is "done."
**Runs the analysis locally.** It reads your repo's `.git` history on your machine, with no account, no API key and no code upload, and it works offline. Signing in is optional and only adds cloud-synced project memories.

---

## How It Works

### Volatility Engine
Scans commit history with time-decayed weighting for panic keywords (fix, bug, revert, hotfix) to flag historically brittle files and who usually touches them.

### Entanglement Engine
Calculates coupling frequency to surface files that change together more often than a threshold, uncovering implicit dependencies that imports miss. The default is 15% of recent commits, adjusted between 10% and 25% for the project's commit pace and commit size, and you can override it in `.memoria.json`.

### Sentinel Engine
Detects drift when a coupled file was last modified more than a week before the file you're changing (3 to 14 days depending on commit pace, also configurable), prompting a sanity check before shipping.

### Static Import Engine
Runs lightweight git grep to enumerate importers so new or low-history files still get coverage.

---

## Installing in Minutes

Memoria is distributed as an **MCP server**. Every client gets the same server entry, `{"mcpServers":{"memoria":{"command":"npx","args":["-y","@byronwade/memoria"]}}}`:

- Claude Code (CLI): `claude mcp add memoria -- npx -y @byronwade/memoria`
- Claude Desktop: merge the entry into `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`)
- Cursor: `mkdir -p .cursor && echo '{"mcpServers":{"memoria":{"command":"npx","args":["-y","@byronwade/memoria"]}}}' > .cursor/mcp.json` (this replaces an existing `.cursor/mcp.json`, so merge by hand if you have one)
- Windsurf and Cline: add the entry in their MCP server settings
- Global npm: `npm install -g @byronwade/memoria` then point your MCP config to `memoria`

Restart your AI tool and the analysis tools are available, with no account or API key needed.

---

## Using Memoria With Your AI

Ask your AI to analyze a file before it edits anything:

```
"Analyze src/api/route.ts before refactoring"
```

You’ll see:

- **Risk score** with volatility and coupling factors
- **Coupled files** (e.g., `billing/page.tsx` 85% coupled)
- **Static dependents** that import the target
- **Pre-flight checklist** so the AI updates everything that matters, not just the file you asked for

Repeat the analysis during refactors, the cache returns results in milliseconds.

---

## When to Reach for Memoria

- Refactors or API shape changes where hidden dependents are likely.
- Deleting "dead" code that might actually be a regression fix, run history first.
- Touching high-churn areas with many authors and unclear ownership.
- Onboarding a new AI workflow, make Memoria the first step before any edit.

---

## Confidence Without Compromise

Memoria keeps your codebase private, accelerates AI-driven work, and reduces the risk of shipping regressions caused by unseen dependencies. If you want your AI to be both fast *and* safe, give it the memory it’s missing.

This write-up describes the MCP server as published on npm in December 2025 (version 1.0.32). [memoria.byronwade.com](https://memoria.byronwade.com) now presents Memoria as an MCP server and GitHub App with risk reports for pull requests.






