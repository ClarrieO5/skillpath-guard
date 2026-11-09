# SkillPath Guard

**Catch broken local resource links before shipping an Agent Skills package.**

An experimental, dependency-free, offline Node.js CLI. It checks `SKILL.md` references against the skill's own folder, detects filename-case and path-escape problems, and lets CI block new findings while you work through existing ones.

A file can exist yet an agent may look for it in the wrong working directory. `AMBIGUOUS_CWD` highlights instructions worth reviewing; it does **not** prove a runtime failure. This is an independent MIT-licensed project, not an official Anthropic or Agent Skills validator.

## Run in one minute

Requires Node.js 20, 22, or 24. No API key, npm dependency installation, or account is needed to run the CLI.

```sh
git clone https://github.com/ClarrieO5/skillpath-guard.git
cd skillpath-guard
npm test
node src/cli.mjs scan examples/valid
node src/cli.mjs scan examples/broken --format md
```

The valid fixture exits **0**. The deliberately broken fixture exits **1**, reports `MISSING_REFERENCE`, and demonstrates a working-directory warning. For your own library, replace `examples/valid` with its directory (quote paths containing spaces). Both a single skill directory and a parent containing many skills are supported.

## Use in CI (GitHub Actions)

SkillPath Guard is not published to npm. Pin a release tag and run it from a checkout; this needs no dependencies:

```yaml
- uses: actions/setup-node@v4
  with: {node-version: 22}
- run: git clone --depth 1 --branch v0.2.0 https://github.com/ClarrieO5/skillpath-guard.git "$RUNNER_TEMP/spg"
- run: node "$RUNNER_TEMP/spg/src/cli.mjs" scan skills --baseline baseline.json --fail-on-new --github-annotations
```

(`v0.2.0` exists only after the release is published; use `v0.1.0` or a commit SHA until then.) Pair it with the reference validator `skills-ref` for frontmatter checks: the two tools check different things (see [docs/COMPARISON.md](docs/COMPARISON.md)).

## CLI

```text
node src/cli.mjs scan <directory> [--format text|json|md] [--out filename]
    [--baseline report.json] [--fail-on-new] [--strict] [--github-annotations]
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
| `ABSOLUTE_REFERENCE` | Error | Replace a machine-specific link with a packaged relative link |
| `FRONTMATTER_MISSING`, `NAME_MISSING`, `NAME_INVALID`, `DESCRIPTION_INVALID` | Error | Fix common required metadata |
| `FRONTMATTER_DUPLICATE`, `FRONTMATTER_UNSUPPORTED` | Error | Remove duplicate fields or simplify unsupported required YAML values |
| `NO_SKILLS` | Error | Point the CLI at a directory containing an exact `SKILL.md` filename |
| `AMBIGUOUS_CWD` | Warning | Verify in your runtime; explain resolution relative to the installed skill directory |
| `CASE_COLLISION` | Warning | Rename files that differ only by case |
| `BODY_EMPTY` | Warning | Add instructions |

Errors reflect static packaging checks; warnings require review. A **false positive** is a flagged path that is intentionally illustrative or not a package dependency. An **unknown** is a warning whose runtime effect has not been established. File existence is not evidence of useful or safe instructions.

## CI

After checking out this tool and your skills, run:

```sh
node /path/to/skillpath-guard/src/cli.mjs scan ./skills --github-annotations
```

Run from the repository root so annotation paths point to the right files. For baseline adoption, add `--baseline baseline.json --fail-on-new`. The included quality workflow tests Node 20/22/24 on Linux, macOS, and Windows. See [validation evidence](docs/VALIDATION.md) for actual run status; a configured matrix is not a passing matrix.

## Scope and limitations

- Scans exact `SKILL.md` files recursively; does not parse linked documents or execute scripts. Directory symlinks are not followed during discovery. `.git`, `node_modules`, `.next`, `dist`, and `build` are skipped.
- Supports ordinary inline Markdown links (including angle destinations, titles, URL-encoded spaces, and balanced parentheses), reference definitions, and heuristic bare `references/`, `scripts/`, `assets/` paths. Reference definitions are checked even if unused. Complex/multiline Markdown and HTML links are unsupported.
- Prose and code examples can produce false positives; only `markdown`/`md` fenced blocks are skipped, so paths in other fences are still checked. Dynamic paths/globs and external URI schemes are skipped. Bare paths outside the three resource folders are not detected; use Markdown links. References are checked for existence, not file type or anchor validity.
- Common frontmatter scalars and `>`/`|` blocks with optional chomping signs are supported, with the reference validator's Unicode-aware name rules. This is **not** a full YAML/spec validator: escapes, multiline quoted strings, complex types and optional fields are not fully validated. Use a standards-focused validator alongside it.
- Cwd warnings use verbs and resolution hints on the **same line**. Context on other lines and actual agent behaviour are unknown. No automatic fix rewrites your instructions.
- No external links are fetched; no telemetry is sent. Reports contain local paths and excerpts: review them before sharing. Filesystem checks assume a stable checkout; see [SECURITY.md](SECURITY.md).

## Evidence, alternatives, and contribution

[Research and ten-skill audit](docs/RESEARCH_LOG.md) · [Validation](docs/VALIDATION.md) · [Changelog](docs/CHANGELOG.md) · [Release checklist](docs/RELEASE.md) · [Architecture](docs/ARCHITECTURE.md) · [Impact log](docs/IMPACT_LOG.md)

Existing tools overlap substantially: `skills-ref` validates metadata; `agent-ecosystem/skill-validator` provides broader structure/content checks; the .NET validator also offers runtime evaluation. This project does not claim unique coverage or superior accuracy.

Please read [CONTRIBUTING.md](CONTRIBUTING.md). Code and documentation were developed with substantial Codex assistance; automated validation is recorded separately from human review and independent adoption. No affiliation, external adoption, or programme eligibility is claimed.
