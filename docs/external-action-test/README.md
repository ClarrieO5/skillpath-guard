# Consumer test kit for the SkillPath Guard Action

Purpose: run the Action from a **separate repository**, as a real user would (never done yet). Status: **not yet run on GitHub**; see `docs/VALIDATION.md` for the local simulation only.

## Steps
1. Create a new public repository under your account, e.g. `skillpath-guard-consumer-test` (empty, no README).
2. Copy this folder's contents into it, renaming `dot-github` to `.github`:
   `skills/`, `shared/`, `broken/`, `vendored/`, `.github/workflows/skillpath-guard.yml`.
3. Push to `main`. The workflow runs on push (or use **Actions > skillpath-guard-consumer-test > Run workflow**).
4. After the v0.3.0 tag exists, change `@main` to `@v0.3.0` in the workflow and run again.

## Expected (every job green; "fails" jobs assert the Action step failed)
| Job | Checks |
|---|---|
| `valid-passes` | valid skill: Action succeeds |
| `broken-fails` | broken link: Action step fails, annotation `MISSING_REFERENCE references/missing.md` on `broken/broken-skill/SKILL.md` line 8 |
| `shared-default-fails-allow-shared-passes` | `../../shared/common.md`: `PATH_ESCAPE` error by default, `SHARED_REFERENCE` warning with `allow-shared: 'true'` |
| `exclude-works` | `vendored/` fails alone; passes when excluded (blank-padded line is trimmed) |
| `summary-on-off` | default writes the job summary; `summary: 'false'` adds nothing |

Record each run URL and the actual result in `docs/VALIDATION.md`. If a job is red, record that too.
