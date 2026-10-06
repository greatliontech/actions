# greatliontech/actions

Reusable GitHub Actions workflows the organization's Go repositories
call, so a change to a shared contract lands in every repository at
once. Callers reference `@main`: the gate is whatever `main` holds at
run time, and every caller's secrets reach it, so `main` is protected
(no force push, no deletion, the lint check required on a pull
request), only the organization's owners push to it, and `lint.yml`
runs actionlint on every change. The repository is public because its
callers are.

## Workflows

- `go-gate.yml` — the release gate: the plain tier (build, vet, the
  fast `-short` tier, the full tier under the caller's measured
  timeout), the race tier (opt-in: the repository's own race
  selection), the records tier (opt-in: the requirement corpus compiles
  and every binding is current and resolved). The caller pins
  `go-version` to a listed toolchain, never `stable`, and a race
  caller passes its own measured budget (`race-timeout`,
  `race-job-minutes`) — the gate refuses a race tier without one.
  Inputs are documented in the file.
- `go-release.yml` — the release: called on `workflow_run` of the gate
  (completed, on main) under a serializing concurrency group; cuts a
  tag only for a push run of the caller's own repository whose judged
  commit is still the tip of main, targeting that commit; the caller
  passes `secrets: inherit` and `permissions: contents: write`, and
  holds `GLT_RELEASER_APP_ID` as a variable.
- `go-next.yml` — the early-warning legs, never a gate: `next-rc`
  under a published Go release candidate, `next-stable` (the fast tier
  alone) under the current stable release.

A caller (the shape every repository carries):

```yaml
jobs:
  gate:
    uses: greatliontech/actions/.github/workflows/go-gate.yml@main
    with:
      go-version: "1.27.1"
      full-timeout: 30m
      race: true
      records: true
```

The repository's own `renovate.yaml` runs the organization's Renovate
app.
