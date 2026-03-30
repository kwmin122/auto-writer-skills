import { describe, expect, it } from "vitest";

import { applyEditMemory, deriveEditPreferences } from "@/lib/edit-memory";
import { getDefaultWriterProfile } from "@/lib/writer-profile-schema";

describe("edit memory", () => {
  it("captures reusable preferences from a user's rewrite and applies them back to the profile", () => {
    const originalDraft =
      "This idea keeps showing up in my notes.\n\nIt matters for anyone publishing with AI help.\n\nWhat do you think?";
    const editedDraft =
      "This idea keeps showing up in my notes.\n\nIt matters for anyone publishing with AI help.";

    const preferences = deriveEditPreferences({
      originalDraft,
      editedDraft
    });

    expect(preferences).toContain("Avoid ending drafts with a question.");

    const updatedProfile = applyEditMemory({
      profile: getDefaultWriterProfile(),
      preferences
    });

    expect(updatedProfile.editPreferences).toContain(
      "Avoid ending drafts with a question."
    );
  });
});
