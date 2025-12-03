---
title: "Rebuzzle: Hard Puzzles Everyday Built by AI"
url: "https://rebuzzle.byronwade.com"
category: "Product"
date: 2024-12-01
excerpt: "Building Rebuzzle: Engineering an AI system that actually understands humor and logic through multi-agent orchestration and continuous learning."
---

Large Language Models (LLMs) are excellent at generating text, but asking them to be witty, logical, or visually creative in a structured format is a different challenge entirely.

With **Rebuzzle**, I set out to build more than just a wrapper around OpenAI or Anthropic. I wanted to create a self-correcting, learning system capable of generating high-quality puzzles, from Rebus visual wordplay to complex Logic Grids, that are actually solvable and fun.

Here is a technical deep dive into how Rebuzzle works, moving beyond simple prompts to a sophisticated multi-agent orchestration system.

## The Architecture: Serverless & Event-Driven

Rebuzzle is built on a modern, production-ready stack designed for modularity and scale. At its core, it utilizes **Next.js 15** and the **Vercel AI SDK**, backed by **MongoDB** for vector storage and analytics.

The system isn't static; it operates on a serverless, event-driven model. This allows the infrastructure to scale automatically, handling the rigorous computational demands of vector embeddings and multi-step AI reasoning without maintaining expensive, idle servers.

## The Core: Multi-Agent Orchestration

The secret sauce of Rebuzzle isn't a single prompt; it's a team of four specialized AI agents working in concert. Using the Vercel AI SDK, we orchestrate these agents to mimic a human editorial team:

1.  **The Generator Agent:** Uses Chain-of-Thought (CoT) reasoning to conceptualize the puzzle. It doesn't just "guess"; it plans a visual strategy, considers phonetic relationships, and drafts the content.

2.  **The Quality Evaluator:** Acts as the harsh critic. It scores puzzles on seven dimensions (including clarity, creativity, and cultural sensitivity). If a puzzle scores below 70, it is sent back for revision.

3.  **The Difficulty Calibrator:** AI is notoriously bad at judging how hard a puzzle is for humans. This agent analyzes visual ambiguity and cognitive steps to assign a weighted difficulty score (1-10), ensuring we hit that "sweet spot" of challenge.

4.  **The Personalization Agent:** Tailors the experience to the specific user, adjusting generation based on their skill level and past performance.

## The Generation Pipeline: Quality by Design

Every puzzle you see on Rebuzzle has survived a rigorous **six-stage pipeline**. We don't publish raw AI output.

*   **Stage 1: Chain-of-Thought:** The AI maps out the logic and potential pitfalls before generating a single pixel or word.

*   **Stage 2: Uniqueness Validation:** We use semantic fingerprinting to prevent duplicates. If a new puzzle is >80% similar to an existing one (determined via vector cosine similarity), it is rejected.

*   **Stage 3 & 4: Calibration & QA:** The puzzle is scored and difficulty-rated.

*   **Stage 5: Adversarial Testing:** The system attempts to "break" the puzzle, looking for multiple valid answers or unintended ambiguity.

*   **Stage 6: Final Validation:** Metadata, hints, and explanations are verified and indexed.

## Semantic Understanding & Vector Embeddings

Rebuzzle understands the *meaning* of its content, not just the text.

Every puzzle is converted into a high-dimensional vector embedding stored in MongoDB. This powers our **Semantic Search Engine**. It allows users to search for "puzzles about cats" and find puzzles containing the 🐱 emoji, even if the word "cat" never appears.

This also enables **Semantic Caching**. Before generating a new puzzle, the system checks if a semantically similar request was recently processed. If so, it serves the cached result. This significantly reduces API costs and latency while ensuring variety.

## Continuous Learning

The system gets smarter the more people play. We track solve rates, time-to-solve, and hint usage.

If a puzzle is marked as "Medium" difficulty but has a 90% abandonment rate, the system learns from this data. It auto-calibrates the difficulty rating for future users and feeds this data back into the generation engine to avoid creating similar "unsolvable" logic in the future.

## Conclusion

Rebuzzle represents a shift from simple generative AI to **agentic AI workflows**. By combining chain-of-thought reasoning, adversarial testing, and vector search, we've created a system that doesn't just generate content, it thinks, evaluates, and learns.

Visit [rebuzzle.byronwade.com](https://rebuzzle.byronwade.com) to start solving today's puzzle.

---

**Note:** I'm a huge vibecoder, and Claude Code is my AI of choice currently. This project was built with a lot of joy, experimentation, and collaboration with AI tools that understand the craft of coding.







