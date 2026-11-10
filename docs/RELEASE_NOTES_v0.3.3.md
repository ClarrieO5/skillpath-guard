# SkillPath Guard v0.3.3 (experimental)

Diagnostics and Action hardening found by validating v0.3.2 on 25 public repositories and a labelled fixture suite (see `docs/REAL_WORLD_VALIDATION.md` and `docs/COMPARISON.md`). Scanning those 25 repositories gives the same 407 findings before and after this release.

## Install

```sh
npx --yes skillpath-guard@0.3.3 scan path/to/your/skills
npm install --save-dev skillpath-guard   # then: npx skillpath-guard scan skills
```

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.3.3
  with:
    path: skills
```

## What changed
- **New error:** an unterminated quoted frontmatter value (`description: "oops`) is reported as `FRONTMATTER_UNSUPPORTED`. v0.3.2 accepted it silently; the reference validator `skills-ref` rejects it. Multi-line quoted values are now read whole instead of being truncated. A repository with such a value will newly fail.
- **Clearer messages:** `NAME_INVALID`, `DESCRIPTION_INVALID` and `COMPATIBILITY_INVALID` now name the actual value or length and which check failed (for example `name 'other' does not match the folder name 'demo'`). Anything matching on the old message text will need updating.
- **Baselines:** those three rules ignore the message in baseline identity, so baselines written by v0.3.2 keep working.
- **Action:** boolean inputs (`strict`, `allow-shared`, `cwd-hints`, `summary`) are case-insensitive; any other value fails the step with exit 2 and a clear error. In v0.3.2, `strict: 'True'` was silently ignored.
- README rewritten for new users; new validation, comparison and Marketplace documents.

## Migrating
From 0.3.2: no flag, exit code, JSON field or rule name changed. Check that your workflows pass only `true`/`false` (any case) to the boolean inputs. The JSON `version` reads `0.3.3`; pin `@v0.3.3`.

## Known limitations
See the README and `docs/REAL_WORLD_VALIDATION.md`: most `MISSING_REFERENCE` findings on public repositories were intentional or illustrative paths (use `<!-- skillpath-guard-ignore -->`), YAML is parsed as a subset, and no allowed-field check exists.
