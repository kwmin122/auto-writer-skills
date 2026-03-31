export const supportedRuntimes = [
  "claude-code",
  "codex",
  "cursor",
  "antigravity"
] as const;

export type SupportedRuntime = (typeof supportedRuntimes)[number];
export type InstallScope = "global" | "local";

export type RuntimeManifest = {
  skillName: string;
  title: string;
  description: string;
  supportedRuntimes: SupportedRuntime[];
  rules: {
    requireSources: boolean;
    banMarkdownEmphasis: boolean;
    banEmoji: boolean;
    keepHumanTone: boolean;
  };
  usage: {
    acceptedInputs: string[];
    outputs: string[];
    tones: string[];
    invocationExamples: string[];
  };
  templates: {
    systemPrompt: string;
    followUpPolicy: string;
    rewritePolicy: string;
  };
};

export type ArtifactFile = {
  relativePath: string;
  content: string;
};

export type RuntimeAdapter = {
  runtime: SupportedRuntime;
  displayName: string;
  resolveTargetDir(input: ResolveInstallPlanInput): string;
  renderArtifacts(
    manifest: RuntimeManifest,
    input: ResolveInstallPlanInput
  ): ArtifactFile[];
  verifyCommand(targetDir: string, input: ResolveInstallPlanInput): string;
};

export type ResolveInstallPlanInput = {
  runtimes: SupportedRuntime[];
  scope: InstallScope;
  cwd?: string;
  homeDir?: string;
  targetRoot?: string;
};

export type InstallPlanEntry = {
  runtime: SupportedRuntime;
  displayName: string;
  targetDir: string;
  verifyCommand: string;
  artifacts: ArtifactFile[];
};

export type InstallPlan = {
  entries: InstallPlanEntry[];
};

export type RunInstallInput = ResolveInstallPlanInput & {
  dryRun?: boolean;
  overwrite?: boolean;
};

export type RunInstallEntry = InstallPlanEntry & {
  written: boolean;
  writtenFiles: string[];
};

export type RunInstallResult = {
  dryRun: boolean;
  entries: RunInstallEntry[];
};

export type ParsedInstallerArgs = {
  runtimes: SupportedRuntime[];
  scope: InstallScope | null;
  dryRun: boolean;
  force: boolean;
  yes: boolean;
  targetRoot?: string;
};
