---
name: lean-usage
description: Daniel's usage-efficiency rules for every Claude Code session on every machine — which model each subagent gets (coordinators on Opus 5.5 high), chosen by task with a cheaper model only when quality doesn't obviously drop (Opus 5.5 medium for code, UI and VFX; Gemini 4 Carbon for 3D builds and Gemini 4 Hydrogen for reading and retrieval as Clearboard role agents, with Opus 5.5 medium and Sonnet 5.5 where Gemini can't run or for built-in Claude subagents; no Fable for now), when to let long-term sessions work instead of subagents, keeping context small, compacting early, and ending long sessions. Use before spawning any subagent, planning parallel work, starting a long or multi-step task, reviewing screenshots/images, or when usage or limits come up.
---

# Lean usage

Daniel hit his session limit on 2026-10-21. The usage panel showed 92% of usage came from subagent-heavy
sessions and from turns above 150k context, and 74% from sessions active 8+ hours. These rules exist to cut that.
Quality still comes first: spend where it buys quality and nowhere else.

## 1. Pick the model by task (Daniel, 2026-10-29, 2026-10-31, 2026-11-10 and 2026-11-13)

Set `model` explicitly on every Agent call and every role agent. Choose by the task, never by cost alone: use a cheaper
model only where there would be no obvious decline in quality. There is no global default model for subagents, so
always set one.

| Work | Model |
|---|---|
| The main session and any coordinator session (Workspace and Project); design decisions; hard reasoning | Opus 5.5, high effort |
| Code, small or big: features, fixes, tests, scripts, architecture, debugging an unclear failure | Opus 5.5, medium effort; high only when the coordinator judges the task needs it |
| UI and visual work: Roblox UI, web heroes, screens, judging screenshots or contact sheets | Opus 5.5, medium effort |
| VFX | Opus 5.5, medium effort |
| 3D builds (Roblox, Unity, Blender) | Gemini 4 Carbon, medium (Clearboard role agent, provider `gemini`, slug `gemini-4-carbon-medium`) |
| Reading a lot of files, retrieval, searches, doc lookups, gathering context for memory | Gemini 4 Hydrogen, medium (`gemini-4-hydrogen-medium`); low for a quick lookup |

- **Fable 5.2:** no role for now. **Codex:** only when Daniel names it. Sonnet 5.5 and Haiku are replaced by Hydrogen.
- **Where Gemini can't run** (no agy signed in on that computer, Gemini's bucket at its limit, or a 3D agent on a PC, where Gemini can't run shell commands such as Blender yet): 3D runs on Opus 5.5 medium and retrieval on Sonnet 5.5, until Gemini is there or resets. Clearboard does this by itself and says so.
- **Built-in subagents** in a plain Claude Code session (the Agent tool) can only be Claude: retrieval and searches on Sonnet 5.5, 3D, UI, VFX and code on Opus 5.5 medium. Never Haiku for a task that edits anything, decides something or judges quality.

Evidence: Clearboard's `docs/design/bakeoff.md` and `docs/design/model-trials.md` (Daniel, q_6dcce6e0ef8d4957, q_580e9db0e36e4be8, q_e08b390e510945ff).

If an agent is already running on the "wrong" model, let it finish rather than restarting it.

## 2. Let long-term sessions do the work, not subagents

Quality comes first, cost second. Each subagent re-reads files and carries its own context, so it usually costs more than letting a session do the work itself.
- Where a workspace runs long-term sessions (a coordinator per project and a session per role), those sessions do the work themselves. When one grows too large, it writes a handoff and a fresh session replaces it. That keeps context small without subagents.
- Do it inline when it's one edit, a few commands, reading one or two files, or a quick check.
- Use a subagent only when it makes the work cheaper and the result is just as good: a wide search, or an audit that would flood your context.
- At most 2 running at once per session.
- One agent per batch of related items, not one per item.
- No forks; a fork copies your whole context. Use fresh agents with short briefs: files/area, what done looks like, constraints.
- Ask for short reports (≤150 words), with detail written to a notes file instead of pasted back.
- Never poll an agent or another session; wait for the notification.

## 3. Keep context small

- Read only the part of a file you need (offset/limit, grep first). Cap tool output (`head_limit`, `| head`, `tail`).
- Images are expensive. Use one contact sheet plus 1–2 zooms, not dozens of screenshots, and use `scale` ≤0.5 for browser screenshots when detail isn't needed.
- Don't re-read files you just edited, or images you've already judged.
- Every tool call is a request that re-reads the whole context. Put read-only steps that follow each other (reading files, searching, `git status`/`log`, listing) into one Bash call rather than one call each.
- While iterating, run only the checks for what you changed (the project's targeted check command, or the one test file); run the full suite once, before you report or hand off.
- Put long findings in files (notes folder, memory) and pass paths, not pastes.

## 4. Compact early, end long sessions

- Auto-compact is set to trigger around 400k (`autoCompactWindow`). Also compact by hand at natural breakpoints: after a task lands, before switching topics.
- Start a fresh session when the task changes, or when a session has run for many hours or is nearing the ~400k compaction point. Before ending it, write a handoff memory (state, decisions, open items) so the new session starts from that instead of a long history.
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
