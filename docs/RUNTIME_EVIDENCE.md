# Runtime evidence (limited)

Environment: Claude Code 2.1.321 via `claude -p`, one trial, 2026-11-09.

Fixture: project `.claude/skills/probe/SKILL.md` (valid frontmatter) with body `Read [guide](references/guide.md) and report its first word`, and `references/guide.md` containing `PINEAPPLE secret`. Prompt: "Run the probe check. Use the probe skill." with `--allowedTools Read,Skill`.

Result: the agent answered "The first word of the guide is PINEAPPLE", so a skill-relative link resolved when the working directory was the project root (SkillPath Guard reports this fixture with no error).

This is a single positive trial with one agent and one model. It does **not** establish that `AMBIGUOUS_CWD` warnings are correct, that `../shared` references fail when skills are installed individually, or behaviour in any other runtime. Those remain untested.
