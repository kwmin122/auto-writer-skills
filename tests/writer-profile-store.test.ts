import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  loadWriterProfile,
  saveWriterProfile
} from "@/lib/writer-profile-store";

describe("writer profile store", () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("saves and reloads the single-user writer profile", async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "writer-profile-store-"));
    const storePath = path.join(tempDir, "writer-profile.json");

    await saveWriterProfile(
      {
        displayName: "Min",
        defaultOutput: "linkedin",
        defaultTone: "insight-driven",
        bannedMarkers: ["**", "emoji"],
        writingNotes: "Keep the language direct and cite sources."
      },
      storePath
    );

    const profile = await loadWriterProfile(storePath);

    expect(profile).toEqual({
      displayName: "Min",
      defaultOutput: "linkedin",
      defaultTone: "insight-driven",
      bannedMarkers: ["**", "emoji"],
      writingNotes: "Keep the language direct and cite sources."
    });
  });
});
