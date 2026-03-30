import { NextResponse } from "next/server";

import { draftRequestSchema } from "@/lib/reconstruct-contracts";
import { buildDraft } from "@/lib/reconstruction-engine";
import { loadWriterProfile } from "@/lib/writer-profile-store";

export async function POST(request: Request) {
  try {
    const payload = draftRequestSchema.parse(await request.json());
    const profile = await loadWriterProfile();
    const draft = buildDraft({
      analysis: payload.analysis,
      profile,
      requestedOutput: payload.analysis.requestedOutput,
      requestedTone: payload.analysis.requestedTone,
      answers: payload.answers,
      rewriteInstruction: payload.rewriteInstruction
    });

    return NextResponse.json({ draft });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid draft request",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}
