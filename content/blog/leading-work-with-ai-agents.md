---
title: "How I Lead Work With AI Coding Agents"
date: 2026-10-16
draft: true
excerpt: "Across my projects, the useful part of working with agents is defining the job, keeping changes separate, and requiring evidence before I accept the result."
tags:
  - AI
  - Product engineering
  - Leadership
  - Workflow
---

When I give an AI coding agent a task, the first thing I need to settle is what finished means.

The agent can read a repository, write code, run commands, and explain its decisions. None of that tells it whether I wanted the feature it decided to build. A working implementation of the wrong idea is still work I have to undo.

I run the work as the lead. I define the goal, set the boundaries, inspect the evidence, and decide what belongs in the product. The agent gets room to solve the problem inside that agreement.

That is the approach I bring across Thorbis, Thorbis Design, Subfield, Hollowveil, and this site. The repositories need their own context. The handoff needs the same clarity.

## Write the acceptance criteria first

“Improve the contact form” leaves almost every important decision open.

A useful assignment says what should happen when someone submits it, what should happen when delivery fails, what information must stay private, and how I will check the result. It also says which parts of the site are outside the task.

On this site, that can mean preserving the visitor’s message after an error, showing the error beside the right field, and keeping delivery addressed only to me. Those are behaviors I can inspect. “Make it production ready” is not.

I want the agent to know the constraints before it starts choosing an implementation:

- Work on the assigned branch and in the assigned worktree.
- Read the repository instructions and search for existing behavior.
- Reuse the components and helpers that already own the problem.
- Run the required local checks and fix failures.
- Return a pull request with evidence and any remaining uncertainty.

The instructions also distinguish permission to edit from permission to publish. An agent can prepare a change without owning the decision to put it in front of users.

That boundary belongs in the task, not in a conversation after something ships.

## Give each job a place to work

I use Git worktrees to keep separate jobs in separate working directories and branches.

One task might change a contact flow while another prepares a post. Each needs to see its own changes clearly. I do not want either agent guessing whether an unfamiliar edit belongs to the other job.

The worktree gives the task a place. It does not remove dependencies.

If the shared design system changes a component contract, the work using that component still has to integrate the change. If main moves forward, the branch still has to catch up and run its checks again. Passing against an older checkout is evidence about that checkout.

I try to split work by ownership rather than file count. Two agents changing the same shared contract are coupled even if they begin in different files. A smaller assignment with a clear boundary is easier to review than a large assignment that keeps discovering new responsibilities.

## Keep the project context attached

Thorbis is field-service software. A change there needs to make sense for the customer, property, job, and person doing the work. A screen that looks reasonable can still represent the wrong relationship. I want the task to name the business behavior before it names the component.

Thorbis Design has a different responsibility: the shared decisions that products should inherit. When the task belongs there, I want the agent to inspect tokens, component contracts, and their consumers. Fixing the same behavior separately in every product would leave the underlying problem intact.

This site is adopting that foundation. For an ordinary content task, the right choice is to use its existing Markdown renderer and reading layout. A new post does not need a new visual system.

Subfield and Hollowveil need their own instructions and acceptance criteria too. I do not want an agent carrying assumptions from Thorbis into either repository simply because it worked on Thorbis last.

<!-- TODO Byron: Confirm how this workflow is currently used in Subfield and Hollowveil, and supply one concrete task from each before publication. No project capabilities or shipped outcomes are assumed here. -->

The reusable part is how I assign and verify work. The product decisions still belong to the project.

## Keep going until the evidence matches the goal

The loop is straightforward: plan, implement a small change, run checks, compare the result with the acceptance criteria, and fix what is missing.

The important part is the comparison. A successful command does not automatically mean the task is finished.

For this site, lint, type checking, unused-code detection, and a production build are local release gates. Contact changes also have regression tests. If a change affects the interface, I need to see the affected route and its relevant states in a browser.

A form can compile while losing someone’s message. A draft post can render correctly while accidentally appearing in the production feed. The check has to reach the behavior I asked for.

I ask for progress notes that name the last completed step, the actual check results, and the next action. If the session ends or another tool takes over, it should not have to reconstruct the task from a long chat.

A real blocker belongs in those notes too. Missing access or a product decision I have not made is different from a failing check the agent can investigate. “Should work” does not resolve either one.

## Route the work without losing the handoff

I move work between coding tools and models when the task calls for it. The repository and the written goal need to remain the reference point when the tool changes.

<!-- TODO Byron: Confirm the tools and models you want named, your current routing criteria, and one actual handoff. This draft deliberately makes no model ranking or cost claim. -->

The handoff should include the branch, the goal, what changed, what failed, and the evidence already collected. A new agent should read the current files and inspect the diff before continuing.

I do not treat a confident explanation from one model as something the next model has to preserve. It is a proposal to check against the code and the requirements.

Changing tools is useful only if the next step becomes clearer. Otherwise I have added another handoff without reducing the uncertainty.

## Review the result as the owner

The pull request is where I bring the work back together.

I want a plain explanation of the problem and the resulting behavior, screenshots when the interface changed, and the checks that actually ran. I want unresolved questions visible before I start reading the diff.

Then I review the code. Did the agent find the existing owner of the behavior? Did it add another source of truth? Did it handle the failure path? Did a narrow task turn into a refactor I did not ask for?

Passing checks help me answer mechanical questions. They do not decide whether the product makes sense or whether the writing sounds like me.

<!-- TODO Byron: Add one reviewed PR where you changed or rejected an agent's proposal, with the reason and outcome you are comfortable sharing. -->

My responsibility does not shrink because an agent wrote the first version. I still have to understand what I accept and what it will mean for the next change.

That is the part of building with agents I care about most: being precise enough about the work that I can delegate implementation and still own the result.
