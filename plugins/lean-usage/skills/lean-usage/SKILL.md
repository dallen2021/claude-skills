---
name: lean-usage
description: Daniel's usage-efficiency rules for every Claude Code session on every machine — which model each subagent gets (Opus for visual/3D/UI/hard reasoning, Sonnet for code, Haiku for search), when to use subagents at all, keeping context small, compacting early, and ending long sessions. Use before spawning any subagent, planning parallel work, starting a long or multi-step task, reviewing screenshots/images, or when usage or limits come up.
---

# Lean usage

Daniel hit his session limit on 2026-10-21. The usage panel showed 92% of usage came from subagent-heavy
sessions and from turns above 150k context, and 74% from sessions active 8+ hours. These rules exist to cut that.
Quality still comes first: spend where it buys quality and nowhere else.

## 1. Pick the model per agent

Set `model` explicitly on every Agent call. The default for subagents is Sonnet
(`CLAUDE_CODE_SUBAGENT_MODEL=sonnet` in user settings), so an omitted `model` means Sonnet.

| Work | Model |
|---|---|
| The main session and any coordinator session; design decisions; hard reasoning | Opus |
| Anything visual: 3D models, textures, UI and screens, icons, judging screenshots or contact sheets, build aesthetics | Opus |
| Code: ports, refactors, tests, parity checks, generators, scripts, merges, migrations, config | Sonnet |
| Searches, file sweeps, listings, size surveys, doc lookups | Haiku (or Sonnet if it must reason about what it finds) |

If an agent is already running on the "wrong" model, let it finish rather than restarting it.

## 2. Use fewer subagents

Each subagent re-reads files and carries its own context, so it costs much more than doing the same work inline.
- Do it inline when it's one edit, a few commands, reading one or two files, or a quick check.
- Use a subagent only for work that is large and self-contained, or needs a different model, or must run while you keep going.
- At most 2 running at once per session.
- One agent per batch of related items, not one per item.
- No forks; a fork copies your whole context. Use fresh agents with short briefs: files/area, what done looks like, constraints.
- Ask for short reports (≤150 words), with detail written to a notes file instead of pasted back.
- Never poll an agent or another session; wait for the notification.

## 3. Keep context small

- Read only the part of a file you need (offset/limit, grep first). Cap tool output (`head_limit`, `| head`, `tail`).
- Images are expensive. Use one contact sheet plus 1–2 zooms, not dozens of screenshots, and use `scale` ≤0.5 for browser screenshots when detail isn't needed.
- Don't re-read files you just edited, or images you've already judged.
- Put long findings in files (notes folder, memory) and pass paths, not pastes.

## 4. Compact early, end long sessions

- Auto-compact is set to trigger around 200k (`autoCompactWindow`). Also compact by hand at natural breakpoints: after a task lands, before switching topics.
- Start a fresh session when the task changes, or when a session has run for many hours or passed ~400k tokens. Before ending it, write a handoff memory (state, decisions, open items) so the new session starts from that instead of a long history.
- Long-running coordinator/loop sessions are the most expensive kind. Make sure they are intentional, keep their turns short, and restart them from a handoff at least daily.

## 5. No hung background tasks

- Every background or wait command has a time limit: `timeout 600 …`, or a loop with a maximum count. Never write a bare `until …; do sleep; done`, which spins forever if the file never appears.
- Never leave a command that can block on stdin, e.g. a broken heredoc feeding `python -`. Write the script to a file and run the file.
- When a background task's purpose is over (the build finished, the agent ended), stop it. Check for leftovers at the end of a task.

## 6. Talk less between sessions

- Batch cross-session messages; no acknowledgements; don't reply to acks.
- Message only for a result ready to review, a question for the user, or a request.

## 7. Effort

Routine work (edits, ports, relays, status) doesn't need maximum effort. Keep the highest effort for design,
visual judgement and hard debugging, and say so when a task deserves more.
