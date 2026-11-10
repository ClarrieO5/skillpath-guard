# Adoption audit, 2026-11-10 (session 5)

Question: would a real Agent Skills maintainer adopt SkillPath Guard, and what stops them? This audit is about usefulness, not GitHub activity. Nothing was published, released, merged or sent to anyone.

## Method

- Reviewed v0.2.2 (tag `v0.2.2` = cc739d3, pre-release published 2026-11-10) and its evidence: CI green on `main` and on the tag, `release-check` against the published tag passed (links in `docs/VALIDATION.md`).
- Clean-install tests with an empty `HOME` and npm cache (Node 22.23, npm 10.9).
- **First-run test:** fresh `git clone --depth 1` of 12 public skill repositories, scanned with default settings, as a maintainer trying the tool would. Commits: anthropics/skills 2c5958e, cloudflare/skills 6eb6c78, expo/skills a9e5bd3, getsentry/skills e94f222, github/awesome-copilot 227949a, googleworkspace/cli cd3697e, huggingface/skills 25910b3, obra/superpowers 22f0b46, openai/skills 49f948f, remotion-dev/skills 1af7e69, supabase/agent-skills c9be0e9, trailofbits/skills e4dd0bb.
- Agent Skills specification read at agentskills/agentskills 83021e2.
- The remaining errors (NAME_INVALID, MISSING_REFERENCE, CASE_MISMATCH) were hand-triaged in rounds 3-4 (`docs/CORPUS_VALIDATION.md`) and were **not** re-triaged here.

## The five biggest reasons a maintainer would not use it

### 1. It fails their CI on day one for things they did on purpose

With v0.2.2 defaults, **9 of 12** repositories exit 1 on the first scan. The largest share are `PATH_ESCAPE` errors: **196 in 6 repositories, and all 196 point to files that exist inside the same repository** (googleworkspace 75, trailofbits 84, openai 23, cloudflare 7, awesome-copilot 4, superpowers 3). These links break when one skill is installed on its own, but work when the repository is installed as a plugin or bundle, which is how several of these projects ship. A maintainer who ships a bundle reads them as false positives and removes the tool. The baseline option hides them but does not explain them.

**Fix (tested):** opt-in `--allow-shared` / Action `allow-shared: 'true'`. A link whose target exists inside the scanned repository becomes a `SHARED_REFERENCE` warning. Missing targets, targets outside the repository, and symlinks that resolve outside stay errors (three regression tests). Without the flag, the `PATH_ESCAPE` message now says the file exists and names the flag.
**Measured:** with `--allow-shared`, googleworkspace (75 -> 0 errors) and cloudflare (7 -> 0) pass. trailofbits drops from 88 to 4 errors and openai from 37 to 14. Repositories failing: 9 -> 7. The remaining errors are of rule types triaged in earlier rounds. The default is unchanged, because whether shared links are acceptable is the maintainer's decision.

### 2. Its default warning contradicts the specification

The spec says: "When referencing other files in your skill, use relative paths from the skill root" (`specification.mdx`) and "The agent resolves these paths automatically" (`using-scripts.mdx`). Its client guide tells runtimes to resolve against the skill directory. `AMBIGUOUS_CWD` warned on exactly that pattern: **594 warnings in 10 of 12 repositories**. In a seeded sample of 30 (seed 20261110), all 30 were the spec-recommended form. At least 5 were triggered by a verb that is not an instruction to open that file ("Read-heavy key-value access", "runs them in batches", a table cell "Read the user's project roots"). None showed a defect, and the only runtime trial (`docs/RUNTIME_EVIDENCE.md`) resolved such a link correctly. It also made `--strict` unusable: any spec-conforming skill failed. A maintainer who knows the spec would read this as the tool not knowing the spec.

**Fix (tested):** `AMBIGUOUS_CWD` is opt-in (`--cwd-hints`). Measured: 594 warnings removed. Every other finding is identical (checked by fingerprint), and exit codes without `--strict` are unchanged.

### 3. No way to silence one known false positive

The known false-positive classes (illustrative paths in skill-writing guides, files the skill tells the agent to create, placeholders, optional files) need human judgement. The only escape hatches were excluding a whole path or keeping a baseline file, both too coarse for a single example line.

**Fix (tested):** `<!-- skillpath-guard-ignore -->` on the line, or `<!-- skillpath-guard-ignore-next-line -->` alone on the line above. Silenced findings are counted (`summary.suppressed`) and shown in the Markdown report. Trade-off: the comment is part of the skill body that agents read.

### 4. The Action hides most findings and cannot be configured

GitHub shows only a limited number of annotations per step, so a repository with 30+ findings saw a fraction of them. The Action also had no `exclude` input, so repositories with mirrored or vendored skill trees could not use it.

**Fix (tested locally, CI step added):** inputs `exclude` (one path per line, whitespace trimmed), `allow-shared`, `cwd-hints`, and `summary` (default on: the full Markdown report goes to the job summary, capped at 500 rows to stay under GitHub's size limit). `--markdown-summary <file>` on the CLI. The Action's shell was run locally with these inputs; the new CI step runs it on the hosted matrix.

### 5. Install and trust friction

- The README said "clone the repository". But `npx --yes github:ClarrieO5/skillpath-guard#v0.2.2 scan skills` already works from a clean machine (verified), with no npm publication. Now documented.
- The npm tarball would have shipped 38 files (182 kB), including the contribution drafts and patches written for **other** projects. It now ships 8 files (48 kB). A regression test guards this.
- Trust cannot be fixed with code: one maintainer, substantially AI-written, v0.x pre-release, **0 known users**, overlap with `skills-ref` and other validators. The README prominently links a "launch kit" and contribution research about other people's repositories, which can read as an outreach campaign. Suggested (not done, your call): move those links under a "Project maintenance notes" heading below the user documentation.

## npm readiness

| Item | State |
|---|---|
| Name `skillpath-guard` | Unclaimed on the registry (404, 2026-11-10) |
| `private: true` | Kept on purpose. Note: `npm publish --dry-run` succeeds anyway, so the dry run does not test the flag |
| `bin` | `src/cli.mjs`, mode 100755, `#!/usr/bin/env node`. The installed shim works (`npx skillpath-guard --version`) |
| Contents | 8 files, 48 kB, no dependencies, no install scripts (`npm audit`: 0 vulnerabilities) |
| Licence | MIT, `LICENSE` included |
| Metadata | Added keywords, homepage, bugs, `git+https` repository URL; `prepublishOnly: npm run verify` |
| Security | No network, telemetry or code execution. `SECURITY.md` included. No `exports` field: the JS API is not a supported interface |
| Steps to publish | `docs/RELEASE.md`, "npm publication" |

Recommendation: npm is not urgent. `npx github:` covers CLI users, and the Action covers CI. Publish once there is at least one external user who asks for it, or alongside the next release if you want `npx skillpath-guard` to be the documented path.

## GitHub Marketplace readiness

Requirements read from the `github/docs` source (docs.github.com is blocked from this environment): public repo ✅; single `action.yml` at the root ✅; unique `name` ⚠️ (no GitHub user or org is named `skillpath-guard`; the Marketplace listing itself could not be checked from here); Developer Agreement and 2FA ❓ (your account; I cannot check). `branding` was added in this PR. GitHub also recommends that the repository holds only what the action needs. Here, most of the repository is research docs. That is allowed but noticeable.

Missing before listing it is worthwhile: one run from a separate repository (still never done), and a release that contains this PR's Action inputs.

## Clean-environment installation (verified)

| Route | Result |
|---|---|
| `npm install ./skillpath-guard-0.2.2.tgz` in an empty project, then `npx skillpath-guard --version` and a scan of `examples/broken` | `0.2.2`, exit 1 with the expected finding |
| `npx --yes github:ClarrieO5/skillpath-guard#v0.2.2 scan skills` on the valid fixture, empty npm cache | exit 0 |
| `npx skillpath-guard@0.2.2` | 404 (not published, expected) |
| Composite Action from another repository | **Not tested** (needs a throwaway repo you create) |

## Adoption plan (honest version)

1. **Prove it once outside this repo.** Create a throwaway public repo with one skill and `uses: ClarrieO5/skillpath-guard@<next tag>`. Confirm a pass, then a failure with annotations and a job summary. Record the run URLs.
2. **Lead with fixes, not the tool.** The useful thing this project has produced is real bugs found in other repositories (`docs/CONTRIBUTION_LEDGER.md`). Each fix stands on its own. Mention the tool only as "found with", and suggest CI only if a maintainer asks how to prevent a repeat.
3. **Ask for feedback where it is welcome.** One post in the spec's own community (agentskills/agentskills discussions, if tool announcements are welcome there), asking specifically for false-positive reports. Do not post in several places at once.
4. **Ask two people to try it from the README alone** and write down where they got stuck. Record it with their permission, including "didn't find it useful".
5. **Measure only real use:** unique external repositories with the workflow line (GitHub code search), external issues and PRs, and npm downloads if published. Never count this repo, its CI, or your own test repos. Today: 0 external repositories (searched 2026-11-10).
6. **Stop condition:** if after a few months nobody outside uses it, offer the useful checks upstream (for example, link-target checks for `skills-ref`, if its maintainers want them) instead of growing a parallel tool.
