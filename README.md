# claude-skills

Daniel's personal agent skills, shared across his computers and usable from both Claude Code and Codex.

| Plugin | What it does |
|---|---|
| `lean-usage` | Usage-efficiency rules: model per subagent, fewer subagents, small context, early compaction, time-limited waits. |

## Set up or update a computer (paste this to your agent)

Paste this block into Claude Code or Codex on the machine. The same block works for the first setup and for every later update.

```text
Set up (or update) my agent skills from https://github.com/dallen2021/claude-skills.
Clone it to ~/claude-skills (or git pull --ff-only if it is already there), then read
setup/SETUP.md and setup/manifest.json in it and follow them for the agent you are and
this machine and workspace. Back up every file before editing it, change only what the
guide lists, ask me before overwriting a setting that differs, never touch credentials,
and finish with a short report of what you installed, changed and skipped.
```

The agent:
- **Installs the skills:** the plugins through the `daniel-skills` marketplace on Claude Code, or the skill folders into `~/.codex/skills/` on Codex.
- **Applies the settings:** it merges them non-destructively.
- **Writes the instruction lines:** between `<!-- claude-skills:begin/end -->` markers, in `~/.claude/CLAUDE.md` or `~/.codex/AGENTS.md`.
- **Tailors the result to your workspace:** it flags any project rules that conflict, and fixes paths and tools for this machine.
- **Records the installed version:** in `~/.claude-skills-installed.json`, so the next run can report what changed.

## Adding a skill

1. Add `plugins/<plugin>/` with `.claude-plugin/plugin.json` and `skills/<skill>/SKILL.md`.
2. List it in `.claude-plugin/marketplace.json`.
3. Add it to `setup/manifest.json`: its skills, settings and instruction lines for each agent.
4. Push.

Each machine picks it up the next time the block is pasted.

## Manual install (Claude Code)

```bash
claude plugin marketplace add dallen2021/claude-skills
claude plugin install lean-usage@daniel-skills --scope user
```

`setup/manifest.json` lists the settings and the `CLAUDE.md` line.

## License and contributing

MIT licensed (see `LICENSE`). Suggestions are welcome as issues or pull requests; see `CONTRIBUTING.md`.
