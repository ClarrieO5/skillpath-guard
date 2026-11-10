# Adoption plan and Claude for Open Source eligibility (drafts only; nothing has been sent)

## Official requirements (read from https://www.anthropic.com/claude-for-oss-terms on 2026-11-09; re-check before applying, terms can change)

Applicants must meet **one** of the Maintainer Track criteria (2.1) or be accepted under the discretionary Ecosystem Impact Track (2.2), **and** all general requirements (2.3). Anthropic decides in its sole discretion; meeting a threshold is not a promise.

- 2.1, any one of: 500+ dependent repositories or 100+ dependent packages (GitHub dependency graph or a registry); 200,000+ monthly downloads; listed committer/maintainer of a recognized foundation or language project; 100+ merged PRs into public repos you do not own in the last 12 months; 20+ unique external contributors with merged PRs in the last 12 months; OpenSSF criticality score >= 0.4. Trivial, duplicative or automated activity may be discounted.
- 2.3 general: natural person, 18+, in a supported country, GitHub account >= 2 years old, public contribution activity in the last 90 days, a project under an OSI licence (MIT qualifies), not Anthropic-affiliated.
- Apply at claude.com/open-source-max.

**Status:** SkillPath Guard currently meets none of the 2.1 thresholds (no known dependents, downloads or external contributors). Track 2.2 requires a written case for ecosystem significance, which needs real evidence below. Contributions to *other* projects (the 100-merged-PR criterion) count and may be the quickest honest route; I cannot assess whether you qualify through other work.

## Evidence worth collecting (genuine only)
1. Repos that adopt the Action or CLI in CI (search GitHub code for the workflow line); count unique repos, not stars.
2. Accepted fixes SkillPath Guard prompts in other skill repos (real bugs, e.g. `claude-api` description > 1024 chars in anthropics/skills, `../shared` references).
3. Issues filed by outside users; external PRs merged.
4. npm downloads only if an npm release is published (not done; needs your approval).
5. Independent human trial and more runtime tests (see `RUNTIME_EVIDENCE.md`).

## Plan
- Open focused, polite issues/PRs in repos where findings were verified true (after you approve each). Candidates from the corpus: anthropics/skills (`claude-api` description length), obsidian/other repos with verified MISSING_REFERENCE examples.
- Offer a copy-paste GitHub Actions snippet and a pre-commit hook; consider a SARIF output for code scanning (not built).
- Communities to consider once evidence exists: the Agent Skills spec repository discussions (agentskills/agentskills) and awesome-lists for skills, posted as a tool announcement per each community's rules.
- Measure: unique dependent repos, external issues/PRs, workflow usage found via code search; do not count self-generated activity.

## Outreach draft (do not send without approval)
> Hi, I maintain SkillPath Guard, an MIT, offline checker for relative-path and portability problems in SKILL.md packages (it complements `skills-ref`, which validates frontmatter). Running it on your repository found: <verified finding with file:line>. Happy to open a PR if useful. It is experimental (v0.x); false-positive reports welcome.

## Launch and feedback plan (v0.2.x)
1. Before any outreach: ~~merge the action and tag it~~ (done: v0.2.1, release check passed); confirm `uses: ClarrieO5/skillpath-guard@v0.2.1` works from a separate clean repository (still not verified outside this repo). See `docs/LAUNCH.md`.
2. File the verified, high-confidence items in `CONTRIBUTION_CANDIDATES.md` as helpful issues or PRs (needs your approval per item); cite the exact line and how to reproduce.
3. Share once in the Agent Skills spec repo discussions and one skills community after at least a few external users have tried it; ask for false-positive reports.
4. Adoption evidence to record (verifiable only): unique repos using the action (GitHub code search for `ClarrieO5/skillpath-guard@`), external issues/PRs, stars from non-affiliated accounts, release asset or clone traffic from the repo's Insights page. Do not count your own repos, test runs or this project's CI.
5. Suggested next improvements that would drive usage: SARIF/code-scanning output, following in-repo SKILL.md symlinks, an `--ignore` option for mirrored trees, a `skill-portability` rule split for `../sibling` links.
