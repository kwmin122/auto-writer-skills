import { NextResponse } from "next/server";

import { applyEditMemory, deriveEditPreferences } from "@/lib/edit-memory";
import { memoryRequestSchema } from "@/lib/reconstruct-contracts";
import {
  loadWriterProfile,
  saveWriterProfile
} from "@/lib/writer-profile-store";

export async function POST(request: Request) {
  try {
    const payload = memoryRequestSchema.parse(await request.json());
    const currentProfile = await loadWriterProfile();
    const preferences = deriveEditPreferences(payload);
    const updatedProfile = applyEditMemory({
      profile: currentProfile,
      preferences
    });
    const savedProfile = await saveWriterProfile(updatedProfile);

    return NextResponse.json({
      profile: savedProfile,
      preferences
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid edit memory request",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}
