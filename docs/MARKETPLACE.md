# GitHub Marketplace listing (prepared 2026-11-10; NOT listed)

Requirements read from the `github/docs` source (docs.github.com is not reachable from the session): [publish-in-github-marketplace.md](https://raw.githubusercontent.com/github/docs/main/content/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace.md).

## Checklist

| Requirement | State | How checked |
|---|---|---|
| Public repository | OK | repository is public |
| Single `action.yml` at the root | OK | `action.yml` is the only metadata file; examples contain none |
| `name` unique: not an existing Marketplace action, GitHub user/org, category or reserved feature name | **UNVERIFIED** | The session cannot query users/orgs or the Marketplace (HTTP 403). Repository search found only this account's two repos. The "Draft a release" page reports problems with the name before you publish |
| Marketplace Developer Agreement accepted, 2FA on | **UNVERIFIED** | Account setting. The "Publish this Action" checkbox is disabled until accepted |
| `branding` valid | OK | `icon: link` is in the supported Feather list (not among the omitted icons), `color: blue` is allowed |
| Repository holds "only what the action needs" (docs recommendation) | Not met | The repository also contains research, drafts and patches for other projects. Allowed, but it will be visible on the listing's source repo. Consider moving `docs/drafts`, `docs/patches` and contribution research to a separate repo before listing |
| Consumer run from another repository at a tag | OK | [run 42794375114](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42794375114) at `@v0.3.0`: 6 jobs green |

## Proposed listing

- **Name:** SkillPath Guard (as in `action.yml`)
- **Description (action.yml):** Offline static checks for Agent Skills resource paths and portability.
- **Primary category:** Code quality (alternative: Continuous integration). Optional second category: the other of the two.
- **Listing text:** the Marketplace shows `README.md`. Its first screen already has the install snippet and inputs; the README links to launch and research notes lower down. Move those under a "Project maintenance notes" heading before listing (suggested in the adoption audit).
- **Version shown:** the release you tick the box on. The existing `v0.3.0` pre-release can be edited to tick **Publish this Action to the GitHub Marketplace** (no new tag needed). Whether GitHub lists a pre-release prominently is **not verified**; if it does not appear, publish `v0.3.1` as a normal release.
- **Release body:** the `v0.3.0` release body is GitHub's auto-generated "What's Changed", not `docs/RELEASE_NOTES_v0.3.0.md`. Replace it before listing (it holds the migration notes).

## Steps (maintainer, needs approval; nothing here was done)

1. Account: github.com > Settings > accept the Marketplace Developer Agreement if prompted; confirm 2FA.
2. Open `action.yml` on `main`; click **Draft a release** in the banner (or edit the existing release `v0.3.0`).
3. Tick **Publish this Action to the GitHub Marketplace**; fix anything the page flags (name, description).
4. Pick Primary category **Code quality**; keep **Set as a pre-release** while the project is experimental.
5. Paste `docs/RELEASE_NOTES_v0.3.0.md` as the body; **Update release** / **Publish release**.
6. Afterwards search the Marketplace for the name, open the listing and check the README renders. Record the URL in `docs/VALIDATION.md`.
7. To withdraw: edit each listed release and untick the box.

Recommendation: list only after the first external user, or together with the README reorder. The listing adds little discovery for a v0.x tool with no users, and it makes the research docs more visible.
