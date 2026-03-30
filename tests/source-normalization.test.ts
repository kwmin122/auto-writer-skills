import { describe, expect, it, vi } from "vitest";

import { normalizeSourceItems } from "@/lib/source-normalization";

describe("normalizeSourceItems", () => {
  it("classifies mixed source types and marks unreadable URLs for follow-up", async () => {
    const fetchMock = vi.fn(async (input: string | URL | RequestInfo) => {
      const href = String(input);

      if (href.includes("example.com")) {
        return new Response(
          "<html><head><title>Example Article</title></head><body><p>This article explains source-aware writing.</p></body></html>",
          { status: 200, headers: { "Content-Type": "text/html" } }
        );
      }

      throw new Error("network blocked");
    });

    const items = await normalizeSourceItems(
      [
        "https://example.com/article",
        "https://youtu.be/abcd1234",
        "https://github.com/kwmin122/auto-writer-skills",
        "https://unknown.example/failure",
        "I want to write about why source attribution matters."
      ].join("\n\n"),
      { fetchImpl: fetchMock as typeof fetch }
    );

    expect(items.map((item) => item.kind)).toEqual([
      "url",
      "youtube",
      "github",
      "url",
      "text"
    ]);
    expect(items[0]?.title).toContain("Example Article");
    expect(items[1]?.title).toContain("YouTube");
    expect(items[2]?.title).toContain("kwmin122/auto-writer-skills");
    expect(items[3]?.status).toBe("needs_context");
    expect(items[4]?.status).toBe("ready");
  });
});
