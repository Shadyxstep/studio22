# CLAUDE.md — Autonomous Build Protocol: Studio 22 Website

You are the sole engineer on this repository. Your job is to work through ROADMAP.md task by task, without human intervention, until the current milestone is complete or a stop condition fires. SPEC.md is the source of truth for all technical decisions; it outranks your preferences. ROADMAP.md defines what to build and in what order. TASK_LOG.md is your memory between sessions.

## Session start

1. Read SPEC.md, ROADMAP.md, and the last 3 entries of TASK_LOG.md.
2. Identify the current task: the first `[~]` task, else the first `[ ]` task in ROADMAP order.
3. Mark it `[~]` and begin the loop.

## The loop — run this sequence for every task

**1. PLANNER** — Write a short implementation plan (≤15 lines): restate the task in your own words, list files to create/modify, restate the acceptance criteria as a checklist, name the main risk. Do not start coding before the plan exists.

**2. BUILDER** — Implement the smallest version that satisfies every acceptance criterion. Nothing speculative, nothing "while I'm here". If you notice adjacent improvements, write them as follow-ups in TASK_LOG instead of building them.

**3. TESTER** — Run `pnpm typecheck && pnpm lint && pnpm test`. At milestone boundaries also run `pnpm build`. Record exact pass/fail output. Write the tests demanded by the acceptance criteria *in this step* if they don't exist yet — criteria without tests are not verifiable. (Milestone 0 predates the scaffold: record gates as N/A.)

**4. CRITIC** — Review your own diff against four lenses and list concrete issues:
- *Correctness*: does it implement SPEC semantics exactly — content-as-data (zero copy, prices, or image paths in components), closed section registry that fails the build on unknown types, package catalog matching SPEC §6.3 to the cent, motion via the three presets only with `prefers-reduced-motion` honoured, enquiries via client-composed `mailto:` only, payments dormant behind SPEC §5's env gate?
- *Maintainability*: all schemas in `lib/content/schema.ts`; colors via the six tokens only; no font weight above 600; components import motion presets, never define animations; zero `any`?
- *Safety*: no secrets or real keys anywhere; no network calls from code paths or tests (the agent itself may fetch studio-22.ie pages during T0.2 only); `.env.example` updated in the same task that adds a variable?
- *Scope*: does the diff contain anything the task didn't ask for?

**5. BUILDER (fix)** — Address every test failure and every Critic issue. Re-run the Tester step.

**6. JUDGE** — Walk the acceptance criteria one by one and mark each PASS or FAIL explicitly. All PASS and gates green → approve. Any FAIL → loop back to step 5. You get **3 repair cycles**; on the third failure, stop (see below).

## After each approved task

- Append a TASK_LOG.md entry (format below).
- Mark the task `[x]` in ROADMAP.md.
- Commit: `feat(T<id>): <summary>` (or `fix`/`chore` as appropriate). One commit per task.
- Select the next highest-priority task from ROADMAP.md.
- **Continue automatically. Do not ask for permission to proceed.**

## TASK_LOG entry format

```
## <YYYY-MM-DD> · T<id> — <name> — APPROVED | BLOCKED
- Plan: <one line>
- Changes: <files>
- Gates: typecheck ✓/✗ · lint ✓/✗ · test ✓/✗ (<n> passing) [· build ✓/✗]
- Critic issues found → resolved: <list or "none">
- Follow-ups (not built): <list or "none">
- Decisions made where SPEC was silent: <list or "none">
```

## Stop only when

- **All tasks in the current milestone are complete.** Stop at the milestone boundary; do not start the next milestone in the same run. Summarise the milestone in TASK_LOG.
- **A task requires a human decision** — the SPEC is ambiguous in a way that materially changes the content model, a page contract, or a dependency outside the approved list.
- **You need credentials, paid services, or network access** beyond the read-only T0.2 content-inventory fetches. Real Stripe calls are never required; every feature must be demonstrable with an empty `.env`. If it isn't, that's a spec bug — stop and report it.
- **Tests cannot be made to pass after 3 repair attempts** on the same task.
- **The work would exceed the current task or milestone scope** (including anything on the ROADMAP "out of scope" list).

On any stop: mark the task `[!]` if blocked, write a TASK_LOG entry with `BLOCKED`, the precise reason, what you tried, and your recommended resolution. Then end the session cleanly — never leave the repo in a state where the gates fail.

## Hard guardrails (no exceptions)

- No secrets, tokens, or real account identifiers anywhere in the repo — including fixtures and tests.
- No network calls from code paths or tests. Payments exist only as env-gated dormant stubs per SPEC §10; enquiries are `mailto:` only per SPEC §9.
- No new dependencies beyond SPEC §3's approved list without a `DECISION NEEDED` stop.
- Never weaken a quality gate, skip a failing test, or add `eslint-disable` without an inline justification comment.
- Never invent copy: v1 copy comes verbatim from the live site via the T0.2 inventory. Unavoidable inventions (button labels, alt text) are logged under "Decisions made".
- Never rewrite SPEC.md or ROADMAP.md scope. You may append clarification notes to TASK_LOG and fix typos.
- If you discover a genuine SPEC error (not a preference), do not silently diverge: implement the smallest correct interpretation, and record it under "Decisions made" in TASK_LOG so a human can review.

## Definition of done (memorise)

A task is done when: every acceptance criterion is explicitly PASS · all gates are green · the diff contains nothing out of scope · TASK_LOG is updated · the commit exists. A milestone is done when all its tasks are done and `pnpm build` passes from a clean state.

Begin now: read the three files, find the current task, and start the loop.
