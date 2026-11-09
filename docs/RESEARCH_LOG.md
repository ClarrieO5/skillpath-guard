# Research log — 9 November 2026

## Real developer problem

- [anthropics/skills #1153](https://github.com/anthropics/skills/issues/1153): open when checked. Reporter describes Claude Code resolving a bundled reference from the workspace and Claude.ai rejecting a relative path. This is a report by another developer, **not our independent reproduction**.
- [dotnet/skills #1008](https://github.com/dotnet/skills/issues/1008): closed as completed on 2 September 2026. Describes workspace-scoped searches missing installed skill resources and silent fallback. Historical evidence, not an assertion of an unfixed current defect.
- [Specification](https://agentskills.io/specification): skill directory contains SKILL.md and optional bundled resources. Our tool is a subset checker, not certification of compliance.

## Alternatives

| Tool / inspected version | Evidence | Findings | Verification level |
|---|---|---|---|
| [skills-ref](https://github.com/agentskills/agentskills/tree/83021e2be457a9b6679148719c1f6074f0ad975e/skills-ref) | README, parser.py, validator.py; installed in a disposable Python environment | Metadata validation with strictyaml; all ten selected skills and our broken-reference fixture returned exit 0 | Executed `skills-ref validate` on the same ten skills and broken fixture; does not establish anything about unrelated capabilities |
| [agent-ecosystem/skill-validator](https://github.com/agent-ecosystem/skill-validator/tree/899dba96e0d0d7d964308ac4df9657c68f581347) | README, links code, contribution rules | Internal links, file reachability including prose/code mentions, structure/content checks, GitHub annotations, optional external link checks and LLM scoring | Documentation/source review only; not executed. Significant overlap, no superiority claim |
| [.NET skill-validator](https://github.com/dotnet/skills/blob/main/eng/skill-validator/src/README.md) | README fetched 9 November 2026 | Static `check`; authenticated agent evaluations with comparative judging and reusable evaluation baselines | Documentation review only; not executed. Runtime baselines are different from our finding baselines |

## Ten-skill public corpus

Source: [anthropics/skills at 2c5958e](https://github.com/anthropics/skills/tree/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills). All ten selected directories contain Apache-2.0 LICENSE.txt files, inspected before audit. Upstream source is not redistributed in this project. We scanned the complete local directories, never executed their scripts, and inspected every emitted diagnostic against its source line. Selection is a convenience sample, not a representative benchmark.

Reproduce after downloading that exact revision:

```sh
node scripts/audit-corpus.mjs /path/to/anthropics-skills/skills
skills-ref validate /path/to/anthropics-skills/skills/webapp-testing
# Repeat skills-ref validate for each named skill below.
```

| Skill | Errors | Warnings | Manual classification |
|---|---:|---:|---|
| webapp-testing | 0 | 2 | Lines 25 and 41 contain real bundled `scripts/with_server.py` commands. Both are plausible cwd risks; runtime effects **uncertain** |
| mcp-builder | 0 | 3 | Lines 58, 151 and 166 refer to existing local guides. Lines 58/166 ask to view/load; line 151 combines a run instruction with a guide link and may be an overbroad association. All **uncertain**, not confirmed defects |
| slack-gif-creator | 0 | 0 | No findings in this scanner's scope |
| internal-comms | 0 | 0 | No findings in this scanner's scope |
| theme-factory | 0 | 0 | No findings in this scanner's scope |
| frontend-design | 0 | 0 | No findings in this scanner's scope |
| doc-coauthoring | 0 | 0 | No findings in this scanner's scope |
| algorithmic-art | 0 | 0 | No findings in this scanner's scope |
| canvas-design | 0 | 0 | No findings in this scanner's scope |
| web-artifacts-builder | 0 | 0 | No findings in this scanner's scope |

Raw scanner reports and skills-ref outcomes: [corpus.json](evidence/corpus.json). Confirmed true-positive runtime defects: **0**; confirmed false positives from these five warnings: **0**; uncertain warnings: **5**. False negatives were not exhaustively audited, so recall and accuracy cannot be calculated. Zero findings does not certify a skill. In contrast, original regression fixtures reproduced ten failures in the prototype before the corresponding fixes; these are our scanner defects, not upstream bugs or adoption.

## Hypothesis status and decision

| Hypothesis | Result | Next evidence needed |
|---|---|---|
| H1 runtime cwd mismatch | Historical reports support plausibility; independent live test not run | Versioned source-vs-installed runtime experiment |
| H2 prose checks add value | Inconclusive: skills-ref misses our broken fixture, but agent-ecosystem already covers prose reachability | Same-fixture execution against broader competitor; real confirmed missed dependency |
| H3 baseline adoption | Mechanism tested locally; user demand unverified | Two willing maintainers' feedback |
| H4 no-dependency convenience | Local verification needs Node only; independent usability untested | Two independent clean-machine trials |
| H5 case portability | Regression asserts exact case; CI evidence recorded separately | Ongoing OS matrix results |
| H6 upstream preferred | No maintainer invitation or external contribution | Specific welcome contribution after confirmed reproduction |

Decision: retain a narrow experimental offline tool, with warnings non-blocking by default. Do not market uniqueness or a superior detection rate. Improve the bounded parser and baseline reliability before adding platform-specific features. Do not infer endorsement from silence.

## Contribution rules checked

[Agent Skills CONTRIBUTING](https://github.com/agentskills/agentskills/blob/83021e2be457a9b6679148719c1f6074f0ad975e/CONTRIBUTING.md) explicitly does **not** accept reference-library code contributions at present; issues/discussions are welcome and AI assistance must be disclosed. No upstream PR was sent. The existing cwd report already covers the general issue, so no duplicate report was filed.

[agent-ecosystem CONTRIBUTING](https://github.com/agent-ecosystem/skill-validator/blob/899dba96e0d0d7d964308ac4df9657c68f581347/CONTRIBUTING.md) expects tested, understood changes and review of AI-generated code. No confirmed new bug was established there. No outreach, testimonials, or maintainer replies are claimed.
