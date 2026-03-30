import {
  normalizeWriterProfileInput,
  type WriterProfile
} from "@/lib/writer-profile-schema";

type EditMemoryInput = {
  originalDraft: string;
  editedDraft: string;
};

type ApplyEditMemoryInput = {
  profile: WriterProfile;
  preferences: string[];
};

export function deriveEditPreferences({
  originalDraft,
  editedDraft
}: EditMemoryInput) {
  const preferences = new Set<string>();
  const originalLength = originalDraft.trim().length;
  const editedLength = editedDraft.trim().length;

  if (originalLength > 0 && editedLength < originalLength * 0.88) {
    preferences.add("Prefer shorter drafts.");
  }

  if (
    originalDraft.trim().endsWith("?") &&
    !editedDraft.trim().endsWith("?")
  ) {
    preferences.add("Avoid ending drafts with a question.");
  }

  if (averageParagraphLength(editedDraft) < averageParagraphLength(originalDraft)) {
    preferences.add("Prefer shorter paragraphs.");
  }

  if (countFirstPerson(editedDraft) > countFirstPerson(originalDraft)) {
    preferences.add("Lean into first-person voice when the material supports it.");
  }

  return [...preferences];
}

export function applyEditMemory({
  profile,
  preferences
}: ApplyEditMemoryInput): WriterProfile {
  const nextPreferences = [...profile.editPreferences];

  for (const preference of preferences) {
    if (!nextPreferences.includes(preference)) {
      nextPreferences.push(preference);
    }
  }

  return normalizeWriterProfileInput({
    ...profile,
    editPreferences: nextPreferences.slice(-12)
  });
}

function averageParagraphLength(value: string) {
  const paragraphs = value
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return 0;
  }

  return (
    paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0) /
    paragraphs.length
  );
}

function countFirstPerson(value: string) {
  return (value.match(/\b(I|my|me|mine)\b/gi) ?? []).length;
}
