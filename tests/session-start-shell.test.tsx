import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SessionStartShell } from "@/components/session-start-shell";

describe("SessionStartShell", () => {
  it("renders the saved profile summary and supported source examples", () => {
    render(
      <SessionStartShell
        profile={{
          displayName: "Min",
          defaultOutput: "blog",
          defaultTone: "professional",
          bannedMarkers: ["**", "emoji"],
          writingNotes: "Prefer clear transitions.",
          editPreferences: ["Prefer shorter drafts."]
        }}
      />
    );

    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText(/default tone/i)).toBeInTheDocument();
    expect(screen.getByText(/default output/i)).toBeInTheDocument();
    expect(screen.getByText(/short note/i)).toBeInTheDocument();
    expect(screen.getByText(/^YouTube$/i)).toBeInTheDocument();
    expect(screen.getByText(/^GitHub$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Paper$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /organize material/i })).toBeInTheDocument();
  });
});
