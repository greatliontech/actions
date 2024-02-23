module.exports = {
  onboarding: false,
  requireConfig: "optional",
  platform: "github",
  platformCommit: true,
  autodiscover: true,
  username: "glt-renovate[bot]",
  gitAuthor: "Renovate Bot <145806311+jinius-renovate[bot]@users.noreply.github.com>",
  packageRules: [
    {
      matchUpdateTypes: ["minor", "patch", "pin", "digest"],
      automerge: true
    }
  ]
};
