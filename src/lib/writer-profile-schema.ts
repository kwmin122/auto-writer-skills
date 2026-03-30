import { z } from "zod";

export const outputTargets = ["linkedin", "blog"] as const;
export const toneOptions = [
  "professional",
  "insight-driven",
  "story-driven",
  "casual",
  "persuasive"
] as const;

const bannedMarkerSchema = z.string().trim().min(1);

export const writerProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  defaultOutput: z.enum(outputTargets),
  defaultTone: z.enum(toneOptions),
  bannedMarkers: z.array(bannedMarkerSchema).max(10),
  writingNotes: z.string().trim().max(400),
  editPreferences: z.array(z.string().trim().min(1)).max(12)
});

export type WriterProfile = z.infer<typeof writerProfileSchema>;

export function getDefaultWriterProfile(): WriterProfile {
  return {
    displayName: "Your name",
    defaultOutput: "linkedin",
    defaultTone: "professional",
    bannedMarkers: ["**", "emoji"],
    writingNotes: "Keep the language direct, natural, and grounded in sources.",
    editPreferences: []
  };
}

export function normalizeWriterProfileInput(
  input: unknown
): WriterProfile {
  const defaults = getDefaultWriterProfile();
  const object = (typeof input === "object" && input !== null
    ? input
    : {}) as Record<string, unknown>;
  const displayName = object.displayName;
  const defaultOutput = object.defaultOutput;
  const defaultTone = object.defaultTone;
  const bannedMarkers = object.bannedMarkers;
  const writingNotes = object.writingNotes;
  const editPreferences = object.editPreferences;

  return writerProfileSchema.parse({
    displayName:
      typeof displayName === "string" && displayName.trim().length > 0
        ? displayName
        : defaults.displayName,
    defaultOutput: defaultOutput ?? defaults.defaultOutput,
    defaultTone: defaultTone ?? defaults.defaultTone,
    bannedMarkers: Array.isArray(bannedMarkers)
      ? bannedMarkers
      : defaults.bannedMarkers,
    writingNotes:
      typeof writingNotes === "string"
        ? writingNotes
        : defaults.writingNotes,
    editPreferences: Array.isArray(editPreferences)
      ? editPreferences
      : defaults.editPreferences
  });
}
