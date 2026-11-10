# SkillPath Guard

**Catch broken local resource links before shipping an Agent Skills package.**

An experimental, dependency-free, offline Node.js CLI and GitHub Action (latest release: [v0.3.0](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.3.0), pre-release). It checks `SKILL.md` references against the skill's own folder, detects filename-case and path-escape problems, and lets CI block new findings while you work through existing ones.

Relative links such as `[guide](references/guide.md)` are the form the [Agent Skills specification](https://agentskills.io/specification#file-references) recommends, and SkillPath Guard does not warn about them by default. `--cwd-hints` turns on the experimental `AMBIGUOUS_CWD` hint for runtimes you suspect resolve paths from the workspace; it does **not** prove a runtime failure. This is an independent MIT-licensed project, not an official Anthropic or Agent Skills validator.

## New here? Start with these three steps

1. Install Node.js 20 or newer (check with `node --version`).
2. Scan your skills straight from the release tag (npm downloads it from GitHub; nothing is installed globally):
   `npx --yes github:ClarrieO5/skillpath-guard#v0.3.0 scan path/to/your/skills`
3. Or download it once: `git clone --depth 1 --branch v0.3.0 https://github.com/ClarrieO5/skillpath-guard.git` and run `node skillpath-guard/src/cli.mjs scan path/to/your/skills`.

Reading the output: each line names a rule, a file and line, and what to fix. **error** findings (broken link, name mismatch) make the command exit 1; **warning** findings are worth reviewing. Rules are explained in "Checks and fixes" below. If a finding is wrong, please open an issue with the Markdown line that triggered it.

## Run in one minute

Requires Node.js 20, 22, or 24. No API key, npm dependency installation, or account is needed to run the CLI.

```sh
git clone https://github.com/ClarrieO5/skillpath-guard.git
cd skillpath-guard
npm test
node src/cli.mjs scan examples/valid
node src/cli.mjs scan examples/broken --format md
```

The valid fixture exits **0**. The deliberately broken fixture exits **1** and reports `MISSING_REFERENCE` (add `--cwd-hints` to see the optional working-directory hint). For your own library, replace `examples/valid` with its directory (quote paths containing spaces). Both a single skill directory and a parent containing many skills are supported.

## Use in CI (GitHub Actions)

SkillPath Guard is not on npm. Use the composite action, pinned to a release tag (or a full commit SHA):

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.3.0
  with:
    path: skills            # folder containing your SKILL.md files
    # baseline: baseline.json   # optional: fail only on NEW findings
```

Inputs: `path`, `baseline`, `strict`; since v0.3.0 also `exclude` (one path per line), `allow-shared`, `cwd-hints` and `summary` (a Markdown report in the job summary, on by default). GitHub shows only the first few annotations of each type per step, so the job summary is where large repositories see every finding.

If your repository is installed as one bundle (a plugin or a whole-repo install) and skills deliberately link to shared files such as `../shared/style.md`, set `allow-shared: 'true'`: those links become `SHARED_REFERENCE` warnings instead of `PATH_ESCAPE` errors. Links whose target is missing, or outside the repository, stay errors.

The action needs `v0.2.1` or later (`exclude`, `allow-shared`, `cwd-hints` and `summary` need `v0.3.0`); the older `V0.2.0` tag predates `action.yml`. Without the action: `git clone --depth 1 --branch v0.3.0 https://github.com/ClarrieO5/skillpath-guard.git "$RUNNER_TEMP/spg"` then `node "$RUNNER_TEMP/spg/src/cli.mjs" scan skills --github-annotations`. Pair it with the reference validator `skills-ref` for frontmatter checks: the tools check different things (see [docs/COMPARISON.md](docs/COMPARISON.md)).

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
| `--allow-shared` | Links that leave the skill folder but exist in the scanned repository become `SHARED_REFERENCE` warnings (next release) |
| `--cwd-hints` | Also report experimental `AMBIGUOUS_CWD` hints (off by default since the next release) |
| `--markdown-summary` | Append a Markdown report to a file, for example `"$GITHUB_STEP_SUMMARY"` (next release) |

Exit codes: **0** no blocking findings; **1** blocking findings; **2** invalid command, baseline, or filesystem failure. Baseline mode does not change the full report's counts.

```sh
node src/cli.mjs scan ./my-skills --format json --out baseline.json
# The first scan can exit 1: this intentionally records existing findings.
node src/cli.mjs scan ./my-skills --baseline baseline.json --fail-on-new
```

Use the same scan-root layout and tool version for both reports. Identity includes file path, rule, severity, target, and message, but excludes line number and absolute root. Moving a skill produces new findings; moving a checkout does not. Duplicate occurrences of the same finding within one file share an identity. A baseline is a reviewed exception list, not proof of correctness. Review it before accepting updates.

## Checks and fixes

| Rule | Severity | Next action |
|---|---|---|
| `MISSING_REFERENCE` | Error | Add the resource or correct its link |
| `CASE_MISMATCH` | Error | Match every path segment's exact spelling |
| `PATH_ESCAPE`, `SYMLINK_ESCAPE` | Error | Bundle the resource inside the skill folder |
| `SHARED_REFERENCE` | Warning | Only with `--allow-shared`: the link works when the whole repository is installed, not when this skill is installed alone |
| `SYMLINK_BROKEN` | Error | A `SKILL.md`, or a skill folder inside a `skills/` folder, is a symlink to something that does not exist: fix or remove the link |
| `ABSOLUTE_REFERENCE` | Error | Replace a machine-specific link with a packaged relative link |
| `FRONTMATTER_MISSING`, `NAME_MISSING`, `NAME_INVALID`, `DESCRIPTION_INVALID` | Error | Fix common required metadata |
| `FRONTMATTER_DUPLICATE`, `FRONTMATTER_UNSUPPORTED` | Error | Remove duplicate fields or simplify unsupported required YAML values |
| `NO_SKILLS` | Error | Point the CLI at a directory containing an exact `SKILL.md` filename |
| `AMBIGUOUS_CWD` | Warning | Only with `--cwd-hints`. Verify in your runtime: a 30-finding sample showed no defects (see `docs/ADOPTION_AUDIT_2026-11.md`) |
| `CASE_COLLISION` | Warning | Rename files that differ only by case |
| `BODY_EMPTY` | Warning | Add instructions |

### Silencing one line

When a flagged path is intentional (an example in a skill-writing guide, a file the skill tells the agent to create), mark that line rather than baselining or excluding the whole skill:

```markdown
Save the result to `references/notes.md`. <!-- skillpath-guard-ignore -->

<!-- skillpath-guard-ignore-next-line -->
Example: [my guide](references/your-guide.md)
```

Silenced findings are counted in the report summary (`suppressed`). The comment is part of the skill body, so agents see it too. Available on `main` (next release).

Errors reflect static packaging checks; warnings require review. A **false positive** is a flagged path that is intentionally illustrative or not a package dependency. An **unknown** is a warning whose runtime effect has not been established. File existence is not evidence of useful or safe instructions.

## CI

After checking out this tool and your skills, run:

```sh
node /path/to/skillpath-guard/src/cli.mjs scan ./skills --github-annotations
```

Run from the repository root so annotation paths point to the right files. For baseline adoption, add `--baseline baseline.json --fail-on-new`. The included quality workflow tests Node 20/22/24 on Linux, macOS, and Windows. See [validation evidence](docs/VALIDATION.md) for actual run status; a configured matrix is not a passing matrix.

## Scope and limitations

- Scans exact `SKILL.md` files recursively; does not parse linked documents or execute scripts. Directory symlinks are not followed during discovery, but a dangling symlink directly inside a folder named `skills/` is reported. `.git`, `node_modules`, `.next`, `dist`, and `build` are skipped.
- Supports ordinary inline Markdown links (including angle destinations, titles, URL-encoded spaces, and balanced parentheses), reference definitions (not GFM footnotes), and heuristic bare `references/`, `scripts/`, `assets/` paths (a `:line` or `:/container/path` suffix is ignored). Reference definitions are checked even if unused. Root-relative links that look like web routes (`/pricing`, no extension, not under a known OS root) are skipped. Complex/multiline Markdown and HTML links are unsupported.
- Prose and code examples can produce false positives; only `markdown`/`md` fenced blocks are skipped, so paths in other fences are still checked. Dynamic paths/globs, placeholder paths (`scripts/train_<variant>.py`) and external URI schemes are skipped. Outside code spans, extensionless prose such as "scripts/CI commands" is not treated as a path, an extensionless name that matches exactly one file (`./assets/card-builder` -> `card-builder.ts`) counts as found, and a file that exists in another skill named on the same or previous line is treated as a cross-skill mention. Bare paths outside the three resource folders are not detected; use Markdown links. References are checked for existence, not file type or anchor validity.
- Common frontmatter scalars and `>`/`|` blocks with optional chomping signs are supported, with the reference validator's Unicode-aware name rules. This is **not** a full YAML/spec validator: escapes, multiline quoted strings, complex types and optional fields are not fully validated. Use a standards-focused validator alongside it.
- Cwd hints (opt-in) use verbs and resolution hints on the **same line**. Context on other lines and actual agent behaviour are unknown. No automatic fix rewrites your instructions.
- No external links are fetched; no telemetry is sent. Reports contain local paths and excerpts: review them before sharing. Filesystem checks assume a stable checkout; see [SECURITY.md](SECURITY.md).

## Evidence, alternatives, and contribution

[Project status and next steps](docs/STATUS.md) · [Validation](docs/VALIDATION.md) · [Changelog](docs/CHANGELOG.md) · [Release procedure](docs/RELEASE.md) · [Architecture](docs/ARCHITECTURE.md) · [Impact log](docs/IMPACT_LOG.md)

Research: [first ten-skill audit](docs/RESEARCH_LOG.md) · [23-repository corpus check](docs/CORPUS_VALIDATION.md) · [38-repository contribution research](docs/CONTRIBUTION_RESEARCH_2026-11.md) · [contribution ledger](docs/CONTRIBUTION_LEDGER.md) · [launch kit](docs/LAUNCH.md)

Existing tools overlap substantially: `skills-ref` validates metadata; `agent-ecosystem/skill-validator` provides broader structure/content checks; the .NET validator also offers runtime evaluation. This project does not claim unique coverage or superior accuracy.

Please read [CONTRIBUTING.md](CONTRIBUTING.md). Code and documentation were developed with substantial AI assistance (Codex, then Claude Code); automated validation is recorded separately from human review and independent adoption. No affiliation, external adoption, or programme eligibility is claimed.
