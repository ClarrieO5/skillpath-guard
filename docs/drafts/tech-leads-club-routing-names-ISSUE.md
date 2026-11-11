<!-- Draft ISSUE for tech-leads-club/agent-skills. NOT submitted. Prepared 2026-11-10 against main 8658b66.
The repo is issue-first for non-members (CONTRIBUTING.md): open an issue, not a PR. Agent involvement must be disclosed (done below).
Duplicate check (2026-11-10): issues and PRs searched for "accessibility", "web-accessibility", "technical-design-doc",
"render-deploy", "skill name folder", "routing description". Nothing reports the description names.
Open PR #226 (head bf60fac) already turns the dead `../performance/SKILL.md` and `assets/` links into plain text, so those are
deliberately left out of this issue. Neither #226 nor #254 changes the four descriptions below (checked in both PR heads).
How names were checked: every "(use X)" in a description in packages/skills-catalog/skills-registry.json was compared with the
registry's skill names. The installer (libs/core/src/lib/services/installer.service.ts) installs into
<skillsDir>/<sanitizeName(skill.name)>, so the frontmatter name, not the folder, is what an agent and the CLI see.
The 5th mismatch the script found, "(use linters)" in component-common-domain-detection, is generic advice, not a skill name, so it is omitted.
Copy everything below the TITLE/BODY markers. -->

TITLE:
Four skill descriptions route agents to skill names that don't exist (web-accessibility, create-technical-design-doc)

BODY:
Several descriptions end with a "Do NOT use for X (use Y)" hint, which is how an agent picks the next skill. In four of them, `Y` is the skill's **folder** name rather than its `name:`. The installer installs skills under their `name:`, so the skill the hint points to doesn't exist under that name:

| Skill | Hint in its description | Actual skill name (folder) |
|---|---|---|
| `seo` | `(use web-accessibility)` | `accessibility` (`(quality)/web-accessibility`) |
| `best-practices` | `(use web-accessibility)` | `accessibility` (`(quality)/web-accessibility`) |
| `tlc-generative-engine-optimization` | `(use web-accessibility)` | `accessibility` (`(quality)/web-accessibility`) |
| `skill-architect` | `(use create-technical-design-doc)` | `technical-design-doc-creator` (`(creation)/create-technical-design-doc`) |

So an agent following the hint looks for a skill that isn't installed, and `npx @tech-leads-club/agent-skills install -s web-accessibility` prints `Skill "web-accessibility" not found` (the CLI matches `s.name`, in `packages/cli/src/cli/install.ts`).

**Suggested fix:** change the four hints to `(use accessibility)` and `(use technical-design-doc-creator)`. It's a description-only change, so nothing that is already installed moves. The other option is renaming the two skills to match their folders, but that changes installed skill names, so the description fix seems safer.

For context, three skills have a `name:` that differs from their folder: `web-accessibility` → `accessibility`, `web-best-practices` → `best-practices`, `create-technical-design-doc` → `technical-design-doc-creator`. That's fine for your installer, but it is probably where the stale names came from.

(The dead `../performance/SKILL.md` and `assets/` links in `core-web-vitals`, `web-quality-audit` and `render-deploy` are left out on purpose: open PR #226 already fixes them.)

If this looks right, I'm happy to open the PR, or you can make the change directly; it's four lines.

Found by comparing the registry's names with the "(use …)" hints, after a scan with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard). Prepared with an AI coding assistant (Claude Code); I checked each row against the skill files and the installer code.
