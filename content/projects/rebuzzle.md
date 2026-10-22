---
title: "Rebuzzle: Hard Puzzles Everyday Built by AI"
url: "https://rebuzzle.byronwade.com"
category: "Product"
date: 2024-12-01
excerpt: "Building Rebuzzle: a staged AI pipeline that plans, checks, and scores each daily puzzle before it's published."
status: "Archived"
tagline: "AI-made daily puzzles"
featured: false
---

Large Language Models (LLMs) are excellent at generating text, but asking them to be witty, logical, or visually creative in a structured format is a different challenge entirely.

With **Rebuzzle**, I set out to build more than just a wrapper around OpenAI or Anthropic. I wanted to create a self-correcting, learning system capable of generating high-quality puzzles, from Rebus visual wordplay to complex Logic Grids, that are actually solvable and fun.

Here is a technical deep dive into how Rebuzzle worked as of December 2025, moving beyond simple prompts to a multi-step generation pipeline.

## The Architecture: Serverless & Event-Driven

Rebuzzle was built on **Next.js 16** and the **Vercel AI SDK**, backed by **MongoDB**, which stored the puzzles, their vector embeddings, and play history.

There's no puzzle server sitting idle. Once a day at midnight UTC, a Vercel cron job calls a workflow route that generates the day's puzzle and writes a blog post about the previous one.

## The Core: Multi-Agent Orchestration

The daily puzzle doesn't come from a single prompt. Generation, quality review, and difficulty calibration are separate AI steps, each with its own instructions, a bit like a small editorial team:

1.  **The Generator:** Uses Chain-of-Thought (CoT) reasoning to conceptualize the puzzle. It doesn't just "guess"; it plans a visual strategy, considers phonetic relationships, and drafts the content.

2.  **The Quality Evaluator:** Acts as the harsh critic. It scores puzzles from 0 to 100 on seven dimensions: clarity, creativity, solvability, appropriateness, visual appeal, educational value, and fun. The daily run asks for a score of at least 70 and makes up to three attempts.

3.  **The Difficulty Calibrator:** AI is notoriously bad at judging how hard a puzzle is for humans. This step rates factors like visual ambiguity, cognitive steps, and cultural knowledge on 1-10 scales and combines them into a weighted difficulty score.

I also built a true multi-agent mode on the Vercel AI SDK, where generator, evaluator, and calibrator agents work with database tools, plus a fourth **Personalization Agent** that tailors puzzles to a signed-in player's skill level and history. It sat behind an experimental feature flag that was on in development and off in production unless explicitly enabled, so the steps above are what the default daily run used.

## The Generation Pipeline: Quality by Design

Every daily puzzle goes through a **five-stage pipeline** before it's saved. We don't publish raw AI output.

*   **Stage 1: Chain-of-Thought:** The AI maps out the logic and potential pitfalls before generating a single pixel or word.

*   **Stage 2: Uniqueness Validation:** Each rebus is compared with existing puzzles using a similarity score that blends how close the answers are with how many emoji they share. Above 0.8, it's rejected and regenerated. Other puzzle types skip this check.

*   **Stage 3: Difficulty Calibration:** The puzzle gets its weighted difficulty rating.

*   **Stage 4: Quality Assurance:** The evaluator scores it. On retries, an adversarial test also tries to "break" the puzzle, looking for multiple valid answers or unintended ambiguity. The first attempt skips that test to save API calls.

*   **Stage 5: Decision:** The puzzle is accepted for publishing or sent back for another attempt.

## Semantic Understanding & Vector Embeddings

Once a puzzle is saved, it gets a vector embedding, stored alongside it in MongoDB.

An API route could use those embeddings to find puzzles by meaning, ranking them by cosine similarity, but no page in the app called it yet. I also wrote a similarity-based cache for AI responses, meant to reuse results for near-identical requests and cut API costs, but nothing in the generation path used it.

## Continuous Learning

Each attempt record has room for whether the player solved it, how long it took, and how many hints they used.

From those, Rebuzzle could compute a puzzle's actual difficulty and flag problem puzzles, for example a "Medium" puzzle with a low solve rate. That analysis was available through an API route and as a tool for the experimental agents. It didn't yet write corrected difficulty back to puzzles or feed the daily generation run, so closing that loop was still ahead.

## Conclusion

Rebuzzle was my move from single prompts to **multi-step AI workflows**. By combining chain-of-thought generation, uniqueness checks, scored quality review, and difficulty calibration, I built a system that does more than generate content: it plans, checks, and scores what it makes before anything is published.

Visit [rebuzzle.byronwade.com](https://rebuzzle.byronwade.com) to start solving today's puzzle.

---

**Note:** I'm a huge vibecoder, and Claude Code is my AI of choice currently. This project was built with a lot of joy, experimentation, and collaboration with AI tools that understand the craft of coding.
