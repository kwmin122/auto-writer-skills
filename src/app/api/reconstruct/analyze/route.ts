import { NextResponse } from "next/server";

import { analyzeRequestSchema } from "@/lib/reconstruct-contracts";
import { buildReconstructionAnalysis } from "@/lib/reconstruction-engine";
import { normalizeSourceItems } from "@/lib/source-normalization";
import { loadWriterProfile } from "@/lib/writer-profile-store";

export async function POST(request: Request) {
  try {
    const payload = analyzeRequestSchema.parse(await request.json());
    const profile = await loadWriterProfile();
    const items = await normalizeSourceItems(payload.rawInput);
    const analysis = buildReconstructionAnalysis({
      items,
      profile,
      requestedOutput: payload.requestedOutput ?? profile.defaultOutput,
      requestedTone: payload.requestedTone ?? profile.defaultTone
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid analyze request",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}
