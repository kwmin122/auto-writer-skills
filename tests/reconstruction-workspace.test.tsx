import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReconstructionWorkspace } from "@/components/reconstruction-workspace";
import type { WriterProfile } from "@/lib/writer-profile-schema";

const profile: WriterProfile = {
  displayName: "Min",
  defaultOutput: "linkedin",
  defaultTone: "professional",
  bannedMarkers: ["**", "emoji"],
  writingNotes: "Keep the prose grounded and human.",
  editPreferences: []
};

describe("ReconstructionWorkspace", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("runs the organize, draft, and edit-memory flow", async () => {
    const onProfileUpdate = vi.fn();
    const fetchMock = vi.fn(async (input: string | URL | RequestInfo) => {
      const href = String(input);

      if (href.includes("/api/reconstruct/analyze")) {
        return new Response(
          JSON.stringify({
            analysis: {
              items: [
                {
                  id: "source-1",
                  raw: "https://example.com/article",
                  kind: "url",
                  label: "Web article",
                  title: "Example Article",
                  excerpt: "An article about source-aware writing.",
                  status: "ready",
                  needsManualContext: false,
                  sourceUrl: "https://example.com/article"
                }
              ],
              requestedOutput: "linkedin",
              requestedTone: "professional",
              coreMessage: "Source attribution should stay visible in the final draft.",
              supportingPoints: [
                "Example Article: An article about source-aware writing."
              ],
              followUpQuestions: [
                "Why does this matter to you personally or professionally?"
              ],
              missingContext: []
            }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      if (href.includes("/api/reconstruct/draft")) {
        return new Response(
          JSON.stringify({
            draft: {
              content:
                "I reviewed the material and kept the attribution visible.\n\nSources\n\n1. Example Article — https://example.com/article",
              sourceLines: [
                "1. Example Article — https://example.com/article"
              ],
              mode: "heuristic"
            }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      if (href.includes("/api/profile/memory")) {
        return new Response(
          JSON.stringify({
            profile: {
              ...profile,
              editPreferences: ["Avoid ending drafts with a question."]
            },
            preferences: ["Avoid ending drafts with a question."]
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Unexpected request: ${href}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <ReconstructionWorkspace onProfileUpdate={onProfileUpdate} profile={profile} />
    );

    fireEvent.change(screen.getByLabelText(/source material/i), {
      target: {
        value:
          "I want to write about why unattributed AI summaries feel empty.\n\nhttps://example.com/article"
      }
    });
    fireEvent.click(screen.getByRole("button", { name: /organize material/i }));

    await screen.findByText(/Source attribution should stay visible/i);

    fireEvent.change(
      screen.getByLabelText(/Why does this matter to you personally or professionally/i),
      {
        target: {
          value: "It affects whether readers trust the work."
        }
      }
    );
    fireEvent.change(screen.getByLabelText(/rewrite request/i), {
      target: { value: "shorter" }
    });
    fireEvent.click(screen.getByRole("button", { name: /generate draft/i }));

    await screen.findByDisplayValue(/I reviewed the material and kept the attribution visible/i);

    fireEvent.change(screen.getByDisplayValue(/I reviewed the material/i), {
      target: {
        value:
          "I kept the attribution visible.\n\nSources\n\n1. Example Article — https://example.com/article"
      }
    });
    fireEvent.click(screen.getByRole("button", { name: /save edit memory/i }));

    await waitFor(() => {
      expect(onProfileUpdate).toHaveBeenCalledWith({
        ...profile,
        editPreferences: ["Avoid ending drafts with a question."]
      });
    });
  });
});
