import fs from "node:fs/promises";
import path from "node:path";

import {
  getDefaultWriterProfile,
  normalizeWriterProfileInput,
  type WriterProfile
} from "@/lib/writer-profile-schema";

const DATA_DIR = path.join(process.cwd(), ".data");
export const DEFAULT_PROFILE_STORE_PATH = path.join(
  DATA_DIR,
  "writer-profile.json"
);

export async function loadWriterProfile(
  storePath: string = DEFAULT_PROFILE_STORE_PATH
): Promise<WriterProfile> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    return normalizeWriterProfileInput(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return getDefaultWriterProfile();
    }

    throw error;
  }
}

export async function saveWriterProfile(
  input: unknown,
  storePath: string = DEFAULT_PROFILE_STORE_PATH
): Promise<WriterProfile> {
  const profile = normalizeWriterProfileInput(input);

  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(profile, null, 2), "utf8");

  return profile;
}
