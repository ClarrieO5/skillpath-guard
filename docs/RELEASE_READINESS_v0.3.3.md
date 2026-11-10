# Release-readiness report: proposed v0.3.3 (2026-11-10)

Status: **not released, not tagged, not published.** v0.3.2 is the current release (GitHub pre-release and npm). Everything below is on branch `claude/sharp-wright-mamcij` and awaits your review.

## Changes implemented

| Change | Why (evidence) | Test |
|---|---|---|
| Unterminated quoted frontmatter value is reported (`FRONTMATTER_UNSUPPORTED`); multi-line quoted values are read whole | False negative on the labelled fixture suite: v0.3.2 accepted `description: "unterminated`, skills-ref and vat reject it | 2 regression tests |
| `NAME_INVALID` / `DESCRIPTION_INVALID` / `COMPATIBILITY_INVALID` messages name the actual value, length and failed check | The old message listed four conditions without saying which failed; 25 NAME_INVALID findings in the corpus all needed the user to open the file | 2 regression tests |
| Those three rules ignore the message in baseline identity | Keeps v0.3.2 baselines valid after the rewording | 1 regression test |
| Action: case-insensitive booleans, clear error on invalid values | `strict: 'True'` was silently ignored | 1 regression test that runs the action's real shell script |
| README rewrite; new reports | Phases 2, 3, 5, 6 | README commands and workflow YAML run/parsed by hand (below) |

Tests: 90 to 96 passing. Each new behavioural test was confirmed to fail on the previous code (3 of the 4 behaviour tests fail without the source change; the baseline-compatibility test passes either way by design, it guards against regression).

## Test results (this machine: Linux, Node 22.23.4)

- `npm test`: 96 pass, 0 fail, 0 skipped. `npm run verify`: passes. `npm pack --dry-run`: 8 files, 58 kB.
- Not run here: the hosted `quality` matrix (Linux/macOS/Windows x Node 20/22/24) and the composite-action steps. They run when the pull request is opened; **their result is unknown until then.** The new action test is skipped on Windows by design.
- The pre-existing "1 skipped" test mentioned in the task brief is not present: this checkout reports 0 skipped.
- README examples run: `npx skillpath-guard@0.3.2` on `examples/valid` (exit 0); clone at tag `v0.3.2` and scan `examples/valid`/`examples/broken` (exit 0/1, output pasted verbatim); baseline then `--fail-on-new` (exit 1 then 0); ignore comments honoured; workflow YAML parses.

## Real-world validation

25 public repositories, 1,797 `SKILL.md` files, exact SHAs, published v0.3.2: [REAL_WORLD_VALIDATION.md](REAL_WORLD_VALIDATION.md). 407 findings, 18 repositories fail; with `--allow-shared` errors drop to 113. 27 name/description violations, all confirmed by skills-ref. Of 63 `MISSING_REFERENCE`, 9 are genuine by my single-reviewer reading. No new parser defect in the corpus. The branch's changes alter no corpus output (407 findings before and after).

## Comparison

[COMPARISON.md](COMPARISON.md): two comparators measured (skills-ref, vat). The two others I tried (`agent-ecosystem/skill-validator`, `skillspec-check`) were blocked by the permission system and are **not** measured, so the "three comparators" goal is not met. Fixtures are author-written and small (19); they show overlap and gaps, not accuracy.

## Remaining bugs and gaps

1. `MISSING_REFERENCE` false positives (about 86% of findings in this corpus by my reading): illustrative text, agent-created files, plugin-root scripts, placeholders. Needs semantic cues; only `<!-- skillpath-guard-ignore -->` exists. A "script lives one level above the skill (plugin root)" cue would address trailofbits' 4 but was not implemented.
2. No allowed-field check (skills-ref flags 82 skills for runtime-extension fields). Deliberate; policy decision.
3. YAML is a subset parser; strict-parser rejections (other than the quote case now fixed) are still undetected.
4. PATH_ESCAPE (304) was not re-triaged line by line this round.
5. `AMBIGUOUS_CWD` still has no precision check.

## Compatibility

Node 20/22/24 declared; only Node 22 tested here. CLI flags, exit codes, JSON schema and rule names unchanged. Message text changed for three rules (consumers matching on message text would break; baselines are protected). New error possible on skills with unterminated quotes (previously green).

## Marketplace readiness

[MARKETPLACE_READINESS.md](MARKETPLACE_READINESS.md): technical requirements met; name uniqueness, Developer Agreement and 2FA are owner-side and unverified.

## Recommended next version

**0.3.3** (patch): no API change; one new error class that only fires on YAML a strict parser also rejects. If you consider a newly failing CI gate a breaking change, use 0.4.0 instead.

## Risks before release

- Hosted CI on this branch has not run.
- A previously green repository with an unterminated quote will turn red (0 of 25 scanned repositories).
- Documentation numbers come from one run by one reviewer; re-run `docs/evidence/comparison/` scripts before quoting them.
- Version bump touches five files plus README pins; `npm test` guards the agreement.
- Releasing requires your approval for merge, tag, npm publish and any Marketplace step.
