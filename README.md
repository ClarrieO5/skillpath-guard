# SkillPath Guard

**Catch broken file references in Agent Skills before you ship them.**

SkillPath Guard is a small, dependency-free command-line tool and GitHub Action. It reads every `SKILL.md` in a folder, checks that the files each skill points to (`references/guide.md`, `scripts/run.py`, ...) really exist inside that skill, and checks the basic frontmatter rules (`name`, `description`). It works offline and sends no data anywhere.

Latest release: [v0.3.2](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.3.2) (pre-release, also on npm as `skillpath-guard`). Independent MIT-licensed project, not an official Anthropic or Agent Skills tool. Experimental: expect false positives (see "Limitations").

## Why you might want it

A skill is a folder. If `SKILL.md` links to `references/api.md` and that file is missing, misspelled in a different case (works on macOS, breaks on Linux), or lives outside the folder (`../shared/api.md`, breaks when only that skill is installed), the agent fails at run time with no build error. Metadata validators such as [`skills-ref`](https://github.com/agentskills/agentskills) check frontmatter but not the files a skill refers to; SkillPath Guard checks the files and covers only the basics of the frontmatter, so use both. See the [measured comparison](docs/COMPARISON.md).

## Quick start

Requires Node.js 20 or newer. Nothing is installed globally:

```sh
npx --yes skillpath-guard@0.3.2 scan path/to/your/skills
```

Exit code **0** means no blocking findings, **1** means errors were found, **2** means a usage or filesystem problem. Try it on a broken example (clone this repository first, or make a folder with a `SKILL.md` that links to a missing file):

```sh
git clone --depth 1 --branch v0.3.2 https://github.com/ClarrieO5/skillpath-guard.git
cd skillpath-guard
node src/cli.mjs scan examples/valid     # exit 0
node src/cli.mjs scan examples/broken    # exit 1
```

Output of the second command:

```text
SkillPath Guard | 1 skills | 1 errors | 0 warnings
ERROR MISSING_REFERENCE demo-skill/SKILL.md:9 Referenced file does not exist: references/not-there.md
```

Each finding is `SEVERITY RULE file:line message`. Fix the link or add the file. Other ways to install: `npm install --save-dev skillpath-guard` then `npx skillpath-guard scan skills`; or straight from the tag, `npx --yes github:ClarrieO5/skillpath-guard#v0.3.2 scan path/to/your/skills`. Point it at one skill folder or at a parent folder with many skills.

## Use in GitHub Actions

```yaml
name: skills
on: [push, pull_request]
permissions:
  contents: read
jobs:
  skillpath-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ClarrieO5/skillpath-guard@v0.3.2
        with:
          path: skills            # folder containing your SKILL.md files
          # baseline: baseline.json   # optional: fail only on NEW findings
```

Findings appear as annotations on the pull request, and a full Markdown report is added to the job summary (GitHub only shows the first few annotations per step). Pin to a release tag or a full commit SHA. The action is a composite action that runs `node`, so the runner needs Node.js 20+ and `bash` (GitHub-hosted runners have both). It needs no secrets and only `contents: read`.

| Input | Default | Meaning |
|---|---|---|
| `path` | `.` | Folder containing `SKILL.md` files |
| `baseline` | | A previous JSON report; only new findings fail |
| `strict` | `false` | Treat warnings as failures |
| `exclude` | | Paths to skip, one per line (mirrored or vendored skill trees) |
| `allow-shared` | `false` | Treat links to files elsewhere in the repository as warnings, not errors (see below) |
| `cwd-hints` | `false` | Also report the experimental `AMBIGUOUS_CWD` hint |
| `summary` | `true` | Write the report to the job summary |

Boolean inputs accept `true` or `false` in any letter case; any other value fails the step with a clear message (on `main`; v0.3.2 silently ignores them). `exclude`, `allow-shared`, `cwd-hints` and `summary` need v0.3.0 or later.

If your repository is installed as one bundle (a plugin or a whole-repo install) and skills deliberately link to shared files such as `../shared/style.md`, set `allow-shared: 'true'`: those links become `SHARED_REFERENCE` warnings instead of `PATH_ESCAPE` errors. Links whose target is missing, or outside the repository, stay errors.

Without the action: `git clone --depth 1 --branch v0.3.2 https://github.com/ClarrieO5/skillpath-guard.git "$RUNNER_TEMP/spg"` then `node "$RUNNER_TEMP/spg/src/cli.mjs" scan skills --github-annotations`.

## Reading the results

| Rule | Severity | Meaning and next action |
|---|---|---|
| `MISSING_REFERENCE` | Error | A linked or `references/`/`scripts/`/`assets/` path does not exist. Add the file or fix the link |
| `CASE_MISMATCH` | Error | The file exists with different capitalisation. Match the exact spelling |
| `PATH_ESCAPE`, `SYMLINK_ESCAPE` | Error | The link leaves the skill folder. Bundle the file inside the skill, or use `--allow-shared` if the repository is installed as one bundle |
| `SHARED_REFERENCE` | Warning | Only with `--allow-shared`: works when the whole repository is installed, not when this skill is installed alone |
| `SYMLINK_BROKEN` | Error | A `SKILL.md` or skill folder is a symlink to something that does not exist |
| `ABSOLUTE_REFERENCE` | Error | A machine-specific path such as `/home/me/x.md` or `C:\Users\me\x.md` |
| `FRONTMATTER_MISSING`, `NAME_MISSING`, `NAME_INVALID`, `DESCRIPTION_INVALID`, `COMPATIBILITY_INVALID` | Error | Required metadata is missing or breaks the specification (the message names the actual value and which check failed) |
| `FRONTMATTER_DUPLICATE`, `FRONTMATTER_UNSUPPORTED` | Error | Duplicate field, an unterminated quote, or YAML this tool cannot read |
| `NO_SKILLS` | Error | No file named exactly `SKILL.md` was found under the path |
| `CASE_COLLISION`, `BODY_EMPTY` | Warning | Files differing only by case; a skill with no instructions |
| `AMBIGUOUS_CWD` | Warning | Only with `--cwd-hints`. Experimental; it does not prove a runtime failure |

**Errors** are static packaging problems and make the command exit 1. **Warnings** need a human decision and fail only with `--strict`. A finding can be a **false positive**: the path may be an illustration, a file the skill tells the agent to create, or a placeholder. On 25 public repositories, 54 of 63 `MISSING_REFERENCE` findings were of that kind ([details](docs/REAL_WORLD_VALIDATION.md)), so read a finding before "fixing" it, and silence intentional ones (below).

## CLI

```text
node src/cli.mjs scan <directory> [--format text|json|md] [--out filename]
    [--baseline report.json] [--fail-on-new] [--strict] [--github-annotations]
    [--allow-shared] [--cwd-hints] [--markdown-summary file]
node src/cli.mjs --help
node src/cli.mjs --version
```

| Option | Behaviour |
|---|---|
| `--exclude` | Skip a root-relative path (see `--help`) |
| `--format` | Text by default; JSON for automation or Markdown for review |
| `--out` | Save the report, creating parent directories |
| `--baseline` | Compare a previous SkillPath Guard JSON report |
| `--fail-on-new` | With a baseline, fail only on new errors; add `--strict` for new warnings |
| `--strict` | Treat warnings as failures |
| `--github-annotations` | Emit escaped Actions diagnostics to **stderr**, keeping JSON stdout valid |
| `--allow-shared` | Links that leave the skill folder but exist in the scanned repository become `SHARED_REFERENCE` warnings |
| `--cwd-hints` | Also report experimental `AMBIGUOUS_CWD` hints (off by default) |
| `--markdown-summary` | Append a Markdown report to a file, for example `"$GITHUB_STEP_SUMMARY"` |

The examples below use `node src/cli.mjs` from a clone; with the npm package, replace it with `npx skillpath-guard`.

Exit codes: **0** no blocking findings; **1** blocking findings; **2** invalid command, baseline, or filesystem failure. Baseline mode does not change the full report's counts.

```sh
node src/cli.mjs scan ./my-skills --format json --out baseline.json
# The first scan can exit 1: this intentionally records existing findings.
node src/cli.mjs scan ./my-skills --baseline baseline.json --fail-on-new
```

Use the same scan-root layout and tool version for both reports. Identity includes file path, rule, severity, target, and message, but excludes line number and absolute root. Moving a skill produces new findings; moving a checkout does not. Duplicate occurrences of the same finding within one file share an identity. For `NAME_INVALID`, `DESCRIPTION_INVALID` and `COMPATIBILITY_INVALID` the message is not part of the identity (their wording changed after v0.3.2), so a v0.3.2 baseline keeps working. A baseline is a reviewed exception list, not proof of correctness. Review it before accepting updates.

## Silencing a finding

When a flagged path is intentional (an example in a skill-writing guide, a file the skill tells the agent to create), mark that line rather than baselining or excluding the whole skill:

```markdown
Save the result to `references/notes.md`. <!-- skillpath-guard-ignore -->

<!-- skillpath-guard-ignore-next-line -->
Example: [my guide](references/your-guide.md)
```

Silenced findings are counted in the report summary (`suppressed`). The comment is part of the skill body, so agents see it too.

## Limitations and supported use

Supported: any folder tree with `SKILL.md` files (one skill or hundreds), Linux/macOS/Windows, Node 20/22/24, text/JSON/Markdown reports, GitHub annotations. Not supported: runtime behaviour, linked documents beyond the skill's own files, full YAML. Details:


- Scans exact `SKILL.md` files recursively; does not parse linked documents or execute scripts. Directory symlinks are not followed during discovery, but a dangling symlink directly inside a folder named `skills/` is reported. `.git`, `node_modules`, `.next`, `dist`, and `build` are skipped.
- Supports ordinary inline Markdown links (including angle destinations, titles, URL-encoded spaces, and balanced parentheses), reference definitions (not GFM footnotes), and heuristic bare `references/`, `scripts/`, `assets/` paths (a `:line` or `:/container/path` suffix is ignored). Reference definitions are checked even if unused. Root-relative links that look like web routes (`/pricing`, no extension, not under a known OS root) are skipped. Complex/multiline Markdown and HTML links are unsupported.
- Prose and code examples can produce false positives; only `markdown`/`md` fenced blocks are skipped, so paths in other fences are still checked. Dynamic paths/globs, placeholder paths (`scripts/train_<variant>.py`) and external URI schemes are skipped. Outside code spans, extensionless prose such as "scripts/CI commands" is not treated as a path, an extensionless name that matches exactly one file (`./assets/card-builder` -> `card-builder.ts`) counts as found, and a file that exists in another skill named on the same or previous line is treated as a cross-skill mention. Bare paths outside the three resource folders are not detected; use Markdown links. References are checked for existence, not file type or anchor validity.
- Common frontmatter scalars and `>`/`|` blocks with optional chomping signs are supported, with the reference validator's Unicode-aware name rules. This is **not** a full YAML/spec validator: escapes, multiline quoted strings, complex types and optional fields are not fully validated. Use a standards-focused validator alongside it.
- Cwd hints (opt-in) use verbs and resolution hints on the **same line**. Context on other lines and actual agent behaviour are unknown. No automatic fix rewrites your instructions.
- No external links are fetched; no telemetry is sent. Reports contain local paths and excerpts: review them before sharing. Filesystem checks assume a stable checkout; see [SECURITY.md](SECURITY.md).

## Reporting bugs and contributing

- **A finding looks wrong?** Open an [issue](https://github.com/ClarrieO5/skillpath-guard/issues) with the exact Markdown line, the finding text, and the version (`skillpath-guard --version`). False positives are the most useful reports.
- **Fixing something?** Read [CONTRIBUTING.md](CONTRIBUTING.md). Every behaviour change needs a regression test in `tests/regressions.test.mjs`; run `npm test` and `npm run verify` (Node 20+, no dependencies).
- **Security issue?** See [SECURITY.md](SECURITY.md).

## Project maintenance notes

[Project status](docs/STATUS.md) · [Real-world validation](docs/REAL_WORLD_VALIDATION.md) · [Comparison with other validators](docs/COMPARISON.md) · [Marketplace readiness](docs/MARKETPLACE_READINESS.md) · [Validation evidence](docs/VALIDATION.md) · [Changelog](docs/CHANGELOG.md) · [Release procedure](docs/RELEASE.md) · [Architecture](docs/ARCHITECTURE.md) · [Earlier research](docs/CORPUS_VALIDATION.md)

Existing tools overlap substantially: `skills-ref` validates metadata; `agent-ecosystem/skill-validator` and `vat audit` provide broader structure and content checks. This project does not claim unique coverage or superior accuracy.

Code and documentation were developed with substantial AI assistance (Codex, then Claude Code); automated validation is recorded separately from human review and independent adoption. No affiliation, external adoption, or programme eligibility is claimed.
