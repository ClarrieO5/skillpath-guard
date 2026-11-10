# GitHub Marketplace readiness (2026-11-10)

**Nothing was published, tagged or listed.** Requirements come from the `github/docs` source file [publish-in-github-marketplace.md](https://raw.githubusercontent.com/github/docs/main/content/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace.md), re-read today (docs.github.com itself is not reachable from the session). Earlier notes: [MARKETPLACE.md](MARKETPLACE.md). Listing is optional and says nothing about eligibility for any programme or benefit.

## Requirements already satisfied

| Requirement | Evidence |
|---|---|
| Public repository | Public |
| One action metadata file at the root | `action.yml` is the only one (examples contain none) |
| Valid `branding` | `icon: link`, `color: blue` (both on GitHub's allowed lists) |
| `name` and `description` present | `SkillPath Guard`; description is 70 characters |
| Inputs documented, with defaults | Seven inputs, each with `description` and `default`; all documented in the README |
| No secrets, minimal permissions | The action reads files only. A consumer needs `permissions: contents: read` (the README example sets it). No network, token or telemetry |
| Safe handling of inputs | Inputs are passed through `env:` and quoted, never interpolated into the shell script, so a crafted `path`/`exclude` value cannot inject commands. Annotation text is escaped (regression test) |
| Release tags exist and match `package.json` | `v0.3.2` (also `v0.2.1`, `v0.2.2`, `v0.3.0`, `v0.3.1`); a test and the `quality` workflow enforce that tag and version agree |
| Action works from the published tag | `release-check` runs `ClarrieO5/skillpath-guard@v0.3.2` (valid skill passes, broken skill fails). Separate consumer repo ran green at `@v0.3.0` ([run 42794375114](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42794375114)) |
| README is a usable listing page | Rewritten on this branch: purpose, quick start, workflow example (YAML parses; commands run), input table, results table, limitations, bug reporting |

## Requirements not yet satisfied or not verifiable from a session

| Item | State |
|---|---|
| `name` is unique on Marketplace, not a user/org name, not a category or reserved feature name | **Unverified.** GitHub's user and Marketplace lookups are blocked from the session (HTTP 403). The release page warns about name problems before publishing |
| Marketplace Developer Agreement accepted; 2FA on | **Owner-only.** The "Publish this Action" checkbox stays disabled until accepted |
| Repository contains "only what the action needs" (docs recommendation, not one of the listed hard requirements) | **Not met.** `docs/` holds research, drafts and patches written for other projects. Allowed, but visible from the listing |
| Consumer run at the newest tag | Last recorded consumer run is `@v0.3.0`. `release-check` covers `@v0.3.2` from inside this repository only. Re-run the consumer repo after the next tag |
| Floating major tag (`v0`) so consumers can follow fixes | Not created. GitHub's guidance favours it; for a 0.x project, pinning to exact tags is a defensible choice. Owner decision |
| Action `outputs` (for example finding counts) | None. Not required; consumers read the exit code and job summary |
| Self-hosted runner / Windows without bash | The action needs `bash` and `node` 20+. Hosted runners have both; self-hosted ones may not. Documented in the README, not enforced |

## Changes made on this branch

- `action.yml`: boolean inputs (`strict`, `allow-shared`, `cwd-hints`, `summary`) are case-insensitive, and an invalid value (for example `yes`) fails the step with `::error` and exit 2. Before, `strict: 'True'` silently did nothing, which would make a strict gate pass when the owner thought it was on. Regression test runs the action's actual shell script (skipped on Windows, where the hosted action smoke tests cover it).
- `README.md`: restructured for first-time users; removed stale "(next release)" notes for features shipped in 0.3.0; added the permissions block and the Node/bash requirement; research links moved under "Project maintenance notes".
- No change to the name, description, branding, inputs or defaults.

## Outstanding blockers (all owner-side)

1. Name uniqueness check and Marketplace Developer Agreement/2FA (a few clicks on the release page).
2. Decision on repository noise: move `docs/drafts`, `docs/patches` and the contribution research to another repository before listing, or accept it.
3. A new release that contains the `action.yml` and README changes above (see below). The Marketplace shows the README and metadata of the release you tick the box on.

## Exact steps for the owner (needs your approval; none were run)

1. Review and merge the pull request from this branch.
2. Prepare the next version by following [RELEASE.md](RELEASE.md) (suggested `0.3.3`: bump `package.json`, `src/cli.mjs` (two places), `src/core.mjs`, `tests/cli.test.mjs`, the pinned tag in `.github/workflows/release-check.yml`, the README pins, add `docs/RELEASE_NOTES_v0.3.3.md`). `npm test` has a test that fails if these disagree.
3. Account: GitHub > Settings > make sure two-factor authentication is on; accept the GitHub Marketplace Developer Agreement if the release page offers it.
4. Open `action.yml` on `main` and click **Draft a release** (or draft a release from Releases). Tag `v0.3.3` (lowercase `v`), target `main`.
5. Tick **Publish this Action to the GitHub Marketplace**. Fix anything it flags (name, description). Wait for "Everything looks good!".
6. Primary category: **Code quality** (alternative: Continuous integration). Paste the release notes as the body. Keep **Set as a pre-release** while the project is experimental. Whether a pre-release is shown on the Marketplace page is not verified; if the listing does not appear, publish as a normal release.
7. Click **Publish release** (asks for 2FA).
8. Afterwards: search the Marketplace for `SkillPath Guard`, open the listing, check the README renders; run the consumer-test repository at `@v0.3.3`; record both in `docs/VALIDATION.md`.
9. To withdraw: edit each listed release and untick the box.

Recommendation: list only when you are ready for the repository's research files to be visible, and after the consumer repository passes at the new tag.
