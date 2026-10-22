# Agent setup and maintenance

These are instructions for a coding agent (Claude Code or Codex), not for a human. The user pasted the block from the README. Follow every step on this machine. Running it again later is the update: each step is safe to repeat.

## Rules for the whole run

- **Back up, and change only what is listed here.** Before editing any file outside this repo, copy it to `<file>.bak-<YYYYMMDD-HHMMSS>`, unless an identical backup from this run already exists.
- **Preserve what the user already has.**
  - Merge JSON or TOML settings key by key, and never drop keys this guide doesn't name.
  - In instruction files (`CLAUDE.md`, `AGENTS.md`), only replace the text between this repo's markers (`<!-- claude-skills:begin -->` … `<!-- claude-skills:end -->`). Add the markers if they are missing.
- **Ask the user before:**
  - overwriting a setting that already has a different value;
  - removing anything;
  - installing outside the user's home folder.
- **Never** read, print or copy credentials or tokens (`auth.json`, `.credentials*`, API keys).
- **Use the user's machine as it is:** the OS, its shell, and the real home and config paths. Don't assume the author's paths.
- **Time-limit everything:** every command that waits gets a timeout. No bare wait loops.
- **Finish with a short report:** what was installed or updated, which files were edited, where the backups are, and anything skipped and why.

## 1. Find the agent, the machine and this repo

1. **Which agent are you?**
   - **Claude Code:** you have the `claude` CLI, or `~/.claude/` exists, and you are Claude.
   - **Codex:** you are Codex, `~/.codex/` exists, or the `codex` CLI is present.
   - If both are installed, set up the one you are, then offer to set up the other.
2. **Note the OS and shell**, and the home folder: `$HOME`, or `%USERPROFILE%` on Windows.
3. **Find this repo.** Use the clone the user pointed you at. Otherwise use `~/claude-skills`: clone `https://github.com/dallen2021/claude-skills` there if it's missing, or `git pull --ff-only` if it exists. If the pull can't fast-forward, stop and ask.
4. **Read the manifest,** `setup/manifest.json`. It lists every plugin with the skills, settings and instruction lines it needs, so read it rather than guessing from this file.

## 2. Install the skills

### Claude Code

- **Add or refresh the marketplace:**
  - `claude plugin marketplace add dallen2021/claude-skills`
  - If it's already added: `claude plugin marketplace update daniel-skills`
- **Install each plugin in the manifest at user scope:** `claude plugin install <plugin>@daniel-skills --scope user`.
  - If it's already installed, update it instead. Use `claude plugin update`, or uninstall and reinstall if your version has no update command.
- **If the CLI isn't on PATH** (for example, you are running inside the desktop app), say so. Then use the app's plugin UI if you have a tool for it, or tell the user the two commands to run.

### Codex

Codex reads skills from `~/.codex/skills/<skill>/SKILL.md`.
- For each skill in the manifest, copy the folder `plugins/<plugin>/skills/<skill>/` to `~/.codex/skills/<skill>/`.
- If a different version is already there, back it up first.
- Where the skill text is Claude-specific, keep the file as it is; the Codex instruction line in step 4 maps it to Codex terms:
  - the subagent `model` names;
  - `/compact`;
  - the Agent tool.

## 3. Apply the settings

Apply the manifest's `settings` for your agent:
- **Claude Code:** `~/.claude/settings.json`.
- **Codex:** `~/.codex/config.toml`.

Merge key by key. If a key already has a different value, show both and ask. If the agent has no equivalent for a setting, skip it and say so; for example, Codex has no `autoCompactWindow`.

## 4. Add the instruction lines

Write the manifest's `instructions` for your agent between the markers, in the user-level instruction file:
- **Claude Code:** `~/.claude/CLAUDE.md`.
- **Codex:** `~/.codex/AGENTS.md`.

Create the file if it's missing. Keep everything outside the markers unchanged.

**A machine set up by hand may already carry a line for a skill outside the markers.** For example, the `lean-usage` usage line on an older install. Don't add the same line a second time:
- If you find an equivalent line, move it inside the markers, replacing it with the manifest's current wording.
- Say that you did so in the report.

The same applies to settings that are already present with the manifest's values: leave them as they are, and count them as done.

## 5. Tailor it to this workspace

Look at the user's current workspace: the folder the agent was started in, plus any other folders the user names.
- **Project instruction files:** if `CLAUDE.md`, `AGENTS.md` or `.claude/` already contain rules that contradict an installed skill, list each conflict, and ask which should win. Don't edit project files on your own.
- **Real values:** if a skill refers to paths, ports or tools, check they exist on this machine.
  - Rewrite a value only in the user-level instruction block from step 4, never inside the skill files.
  - Where a value doesn't apply here, write the local equivalent or drop the line, and say which.
- **Ports between agents:** if this machine has both agents, offer to make the same setup for the other one.

## 6. Check, and record the version

1. **Check that each skill is visible to the agent:**
   - **Claude Code:** list the plugins with `claude plugin list`, or check that the skill shows up.
   - **Codex:** check that each file exists under `~/.codex/skills/`.
2. **Record what was installed.** Write `~/.claude-skills-installed.json` with the repo commit (`git rev-parse HEAD`), the agent, the date, and the plugin versions. On the next run, compare against it and report what changed since last time.
3. **Report**, as described under "Rules for the whole run".

## Maintenance

Running the README block again is the update, because every step above is safe to repeat. To change what gets installed, edit this repo: add a plugin under `plugins/`, list it in `.claude-plugin/marketplace.json` and in `setup/manifest.json`, then push. Every machine picks it up on its next run.
