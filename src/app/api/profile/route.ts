import { NextResponse } from "next/server";

import {
  normalizeWriterProfileInput,
  type WriterProfile
} from "@/lib/writer-profile-schema";
import {
  loadWriterProfile,
  saveWriterProfile
} from "@/lib/writer-profile-store";

function parseBannedMarkers(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function parseRequestBody(request: Request): Promise<WriterProfile> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return normalizeWriterProfileInput(await request.json());
  }

  const formData = await request.formData();

  return normalizeWriterProfileInput({
    displayName: formData.get("displayName"),
    defaultOutput: formData.get("defaultOutput"),
    defaultTone: formData.get("defaultTone"),
    bannedMarkers: parseBannedMarkers(formData.get("bannedMarkers")),
    writingNotes: formData.get("writingNotes")
  });
}

export async function GET() {
  const profile = await loadWriterProfile();

  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  try {
    const profile = await parseRequestBody(request);
    const savedProfile = await saveWriterProfile(profile);

    if ((request.headers.get("content-type") ?? "").includes("application/json")) {
      return NextResponse.json(savedProfile);
    }

    const redirectUrl = new URL("/profile?saved=1", request.url);
    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid writer profile payload",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}
