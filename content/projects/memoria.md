---
title: "Memoria: The Memory Your AI Lacks"
url: "https://memoria.byronwade.com"
category: "Product"
date: 2025-12-04
excerpt: "An MCP server that keeps AI from breaking your code by exposing hidden file dependencies through fast, local git forensics."
---

# Memoria: Keeping AI From Breaking Your Code

I built **Memoria** after watching AI assistants refactor code perfectly in isolation, only to crash the app because another file depended on the old behavior. Imports don't tell the full story—git history does. Memoria is the guardrail that exposes hidden coupling before your AI ships a regression.

---

## Why Memoria Exists

### The Failure Pattern

You ask an AI to update `route.ts`. It ships the change confidently. Production blows up because `billing.tsx` relied on a subtle side effect. There were no imports between them, so the AI never saw the dependency.

### The Requirements

- **Local-first**: Analyze the repo without sending code to any server.
- **Low friction**: One-line install for every major AI client (Cursor, Claude, Windsurf, Cline).
- **Actionable**: Return coupled files, risk scores, and a checklist the AI can follow immediately.
- **Fast**: Sub-100ms analysis and cached results for iterative work.

---

## What Memoria Does

**Reveals hidden coupling** by mining git history to find files that change together, even without imports.  
**Assigns a risk score** so you and the AI know when to slow down.  
**Surfaces static dependents** using git grep to catch direct importers.  
**Builds a pre-flight checklist** of files to verify or update before the change is "done."  
**Runs 100% locally**—no API keys, no cloud upload, works offline.

---

## How It Works

### Volatility Engine
Scans commit history with time-decayed weighting for panic keywords (fix, bug, revert, hotfix) to flag historically brittle files and who usually touches them.

### Entanglement Engine
Calculates coupling frequency to surface files that change together >15% of the time, uncovering implicit dependencies that imports miss.

### Sentinel Engine
Detects drift when coupled files haven't been updated together in >7 days, prompting a sanity check before shipping.

### Static Import Engine
Runs lightweight git grep to enumerate importers so new or low-history files still get coverage.

---

## Installing in Minutes

Memoria is distributed as an **MCP server**. Pick your client and drop in a single config line:

- Cursor: `mkdir -p .cursor && echo '{"mcpServers":{"memoria":{"command":"npx","args":["-y","@byronwade/memoria"]}}}' > .cursor/mcp.json`
- Claude Code (CLI): `claude mcp add memoria -- npx -y @byronwade/memoria`
- Claude Desktop: `npx @anthropic/claude-code mcp add memoria -- npx -y @byronwade/memoria`
- Global npm: `npm install -g @byronwade/memoria` then point your MCP config to `memoria`

Restart your AI tool and Memoria is available immediately—no API keys needed.

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

Repeat the analysis during refactors—the cache returns results in milliseconds.

---

## When to Reach for Memoria

- Refactors or API shape changes where hidden dependents are likely.
- Deleting "dead" code that might actually be a regression fix—run history first.
- Touching high-churn areas with many authors and unclear ownership.
- Onboarding a new AI workflow—make Memoria the first step before any edit.

---

## Confidence Without Compromise

Memoria keeps your codebase private, accelerates AI-driven work, and reduces the risk of shipping regressions caused by unseen dependencies. If you want your AI to be both fast *and* safe, give it the memory it’s missing.

Visit [memoria.byronwade.com](https://memoria.byronwade.com) to install or learn more.





