# Comparison with other Agent Skills validators (measured 2026-11-10)

## Summary

- **Measured:** two comparators, [`skills-ref`](https://pypi.org/project/skills-ref/) 0.1.1 (the reference validator, PyPI) and `@vibe-agent-toolkit/cli` 0.1.42 (`vat audit`, npm), on a labelled 19-case fixture suite and (skills-ref only) on the 25-repository corpus.
- **Not measured, blocked:** `agent-ecosystem/skill-validator` (Go; the permission system refused to build it from source) and `skillspec-check` 1.0.1 (npm; installed with `--ignore-scripts`, but the permission system refused to run it). The goal was three or more comparators; **only two were run.** Nothing is claimed about the other two.
- **Result in one line:** the three tools mostly check different things. On the fixtures SkillPath Guard caught 13 of 14 seeded defects with 0 false positives on 4 clean controls; skills-ref caught the 9 metadata defects and none of the 5 reference defects; `vat audit` caught 8 of 14. The fixtures were written by the author of SkillPath Guard, there are only 19 of them, so this shows overlap and gaps, not general accuracy.

## Method (reproducible)

```sh
node docs/evidence/comparison/make-fixtures.mjs fx          # 19 labelled cases
python3 -m venv v && v/bin/pip install skills-ref==0.1.1
npm i skillpath-guard@0.3.2 @vibe-agent-toolkit/cli@0.1.42 --ignore-scripts
docs/evidence/comparison/run-fixtures.sh "$PWD/fx" node_modules/skillpath-guard/src/cli.mjs v/bin/python3 "$PWD"
```
Labels: 14 `defect` (a validator should report it), 4 `clean` controls (it should not), 1 `strict` (a field the spec does not list; deliberately not scored). A tool "detects" a case when it reports any finding for it; I did not score whether the message was right. Raw output: [`fixture-results-v0.3.2.tsv`](evidence/comparison/fixture-results-v0.3.2.tsv). `vat audit <dir>` was run with its defaults (no `vibe-agent-toolkit.config.yaml`), so its `skills validate` mode and `skill review` were not exercised. `skills-ref` validates one skill folder and never checks referenced files.

## Fixture results (v0.3.2 behaviour)

| Case | SkillPath Guard 0.3.2 | skills-ref 0.1.1 | vat audit 0.1.42 |
|---|---|---|---|
| clean skill, valid link, link syntax in code, external URL (4 controls) | no findings | no findings | no findings |
| name differs from folder | detected | detected | **missed** |
| name uppercase | detected | detected | detected |
| name missing | detected | detected | **missed** |
| description missing | detected | detected | **missed** |
| description over 1024 | detected | detected | detected |
| compatibility over 500 | detected | detected | **missed** |
| unterminated quote in YAML | **missed** (fixed on this branch) | detected | detected (reported as missing frontmatter) |
| no frontmatter | detected | detected | detected |
| name with `--` | detected | detected | detected |
| link to missing file | detected | not in scope | detected |
| link where only the case differs | detected as `CASE_MISMATCH` | not in scope | detected as a broken link |
| `../` link leaving the skill | detected | not in scope | detected |
| absolute path in prose | detected | not in scope | **missed** |
| missing `scripts/run.py` in prose | detected | not in scope | **missed** |
| `argument-hint: [file]` (valid YAML, not in spec) | no finding | **"Invalid YAML"** | no finding |
| Detected / 14 defects | **13** | 9 (0 of 5 reference cases) | 8 |
| False positives / 4 controls | 0 | 0 | 0 |

Misses by SkillPath Guard: one (unterminated quote), fixed in the same branch with a regression test. Findings about the *other* tools are limited to these fixtures and defaults and could change with configuration.

## Corpus (25 repositories, 1,797 skills): SkillPath Guard vs skills-ref

Details in [REAL_WORLD_VALIDATION.md](REAL_WORLD_VALIDATION.md).

- Metadata: skills-ref reported 110 skills with errors: 82 for fields outside the spec's list (`argument-hint`, `disable-model-invocation`, `version`, `type`...), 25 directory-name mismatches, 1 over-long description, 1 missing description, 2 "Invalid YAML". SkillPath Guard flagged all 27 skills with a name/description problem that skills-ref flagged as a spec violation, and **none that skills-ref did not**. It deliberately does not check for unknown fields, so those 82 are not comparable.
- skills-ref's 2 "Invalid YAML" cases are YAML flow sequences (`allowed-tools: ['A','B']`), which are valid YAML; its `strictyaml` dependency rejects them. Treated as a skills-ref false positive.
- Reference checks (broken links, case, escapes, symlinks): 304 `PATH_ESCAPE`, 63 `MISSING_REFERENCE` (9 genuine by my reading), 3 `CASE_MISMATCH`, 10 `SYMLINK_BROKEN`. skills-ref does not examine these at all.
- False-positive rate: not computable. For `MISSING_REFERENCE`, 54 of 63 (86%) were intentional or illustrative by my single-reviewer reading, so on this corpus a "genuine" precision of about 14% for that rule. `NAME_INVALID`/`DESCRIPTION_INVALID`: every finding was confirmed by skills-ref.

## Speed, installation, usability

| | SkillPath Guard | skills-ref | vat |
|---|---|---|---|
| Install | `npx skillpath-guard@0.3.2` (no dependencies) | `pip install skills-ref` (CLI is named `agentskills`, not `skills-ref`; 4 dependencies) | `npm i @vibe-agent-toolkit/cli` (pulls many transitive packages, including `markdown-link-check`, `handlebars`) |
| Input | any directory (recursive) | one skill folder per call | a path; plugin/marketplace aware |
| 25-repo corpus, wall clock | 5.5 s total (includes Node start per repo, 0.05 s to 0.80 s each) | 2.9 s in-process total (library call, excludes interpreter start) | `kepano` 2.5 s, `vercel-labs` 1.8 s, `obra/superpowers` 28.9 s; `anthropics/skills` was still running after 120 s and I stopped it (cause not investigated) |
| Output | text, JSON, Markdown, GitHub annotations, baselines | plain error strings | YAML report with codes and a `fix` hint |
| GitHub Action | composite action in this repo; consumer run verified | none seen (not investigated further) | not investigated |
| Message quality (observed) | now names the actual value and failed check | clear for metadata | clear for links, with a fix hint |

Timing is one run on one container; single numbers, not a benchmark. The vat repo-level runs scan different file sets than the other tools, so they are not like-for-like.

## What stays true

- Use `skills-ref` (or any real YAML validator) for frontmatter fidelity and the allowed-field list. SkillPath Guard parses a YAML subset.
- SkillPath Guard's distinct value on this evidence is reference integrity: case, escapes, symlinks, absolute paths and bare `scripts/x` mentions. `vat audit` covers broken links and more (size, packaging); it missed absolute paths and bare script mentions here.
- No claim is made about superiority or false-positive rate outside these fixtures and this corpus.

## Earlier source-reading notes (2026-11-09)

`vat`'s source names error codes for description style, size, unreferenced files, packaging and marketplace validation, beyond anything SkillPath Guard does. `skills-ref` normalises names with NFKC and requires Unicode letters, as SkillPath Guard now does.
