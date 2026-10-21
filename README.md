# claude-skills

Daniel's personal Claude Code plugins, shared across his computers.

| Plugin | What it does |
|---|---|
| `lean-usage` | Usage-efficiency rules: model per subagent, fewer subagents, small context, early compaction. |

## Install on a computer

```bash
claude plugin marketplace add dallen2021/claude-skills
claude plugin install lean-usage@daniel-skills --scope user
```

Also add these to `~/.claude/settings.json` on that machine:

```json
"autoCompactWindow": 200000,
"env": { "CLAUDE_CODE_SUBAGENT_MODEL": "sonnet" }
```

and this line to `~/.claude/CLAUDE.md`:

```
- Usage: follow the `lean-usage` skill. Explicit `model` on every subagent (Opus for visual/3D/UI/hard reasoning, Sonnet for code, Haiku for search); do small jobs inline; at most 2 subagents at once; no forks; contact sheets, not piles of screenshots; compact at breakpoints and start a fresh session with a handoff memory when the task changes.
```

## Update

```bash
claude plugin marketplace update daniel-skills
```
