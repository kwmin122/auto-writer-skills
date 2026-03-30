"use client";

import { useState } from "react";

import {
  outputTargets,
  toneOptions,
  type WriterProfile
} from "@/lib/writer-profile-schema";

type WriterProfileFormProps = {
  profile: WriterProfile;
};

export function WriterProfileForm({ profile }: WriterProfileFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    setMessage("");

    const payload = {
      displayName: String(formData.get("displayName") ?? ""),
      defaultOutput: String(formData.get("defaultOutput") ?? ""),
      defaultTone: String(formData.get("defaultTone") ?? ""),
      bannedMarkers: String(formData.get("bannedMarkers") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      writingNotes: String(formData.get("writingNotes") ?? ""),
      editPreferences: String(formData.get("editPreferences") ?? "")
        .split(/\n|,/g)
        .map((item) => item.trim())
        .filter(Boolean)
    };

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("Could not save the writer profile. Review the fields and try again.");
      return;
    }

    setStatus("saved");
    setMessage("Writer profile saved.");
  }

  return (
    <form
      className="profile-form"
      action={handleSubmit}
    >
      <div className="field-grid">
        <label className="field">
          <span>Display name</span>
          <input defaultValue={profile.displayName} name="displayName" />
        </label>

        <label className="field">
          <span>Default output</span>
          <select defaultValue={profile.defaultOutput} name="defaultOutput">
            {outputTargets.map((target) => (
              <option key={target} value={target}>
                {target === "linkedin" ? "LinkedIn post" : "Blog post"}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Default tone</span>
          <select defaultValue={profile.defaultTone} name="defaultTone">
            {toneOptions.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Banned markers</span>
        <input
          defaultValue={profile.bannedMarkers.join(", ")}
          name="bannedMarkers"
        />
      </label>

      <label className="field">
        <span>Writing notes</span>
        <textarea
          defaultValue={profile.writingNotes}
          name="writingNotes"
          rows={5}
        />
      </label>

      <label className="field">
        <span>Edit memory</span>
        <textarea
          defaultValue={profile.editPreferences.join("\n")}
          name="editPreferences"
          rows={4}
        />
      </label>

      <div className="form-footer">
        <p className="helper-text">
          The saved profile becomes the default style context for later generation
          phases. Add one reusable edit preference per line if you want to tune the
          memory manually.
        </p>
        <button className="primary-button" disabled={status === "saving"} type="submit">
          {status === "saving" ? "Saving..." : "Save profile"}
        </button>
      </div>

      {message ? <p className={`status status-${status}`}>{message}</p> : null}
    </form>
  );
}
