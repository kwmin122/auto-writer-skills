"use client";

import { useState } from "react";

import type { WriterProfile } from "@/lib/writer-profile-schema";

import { ProfileSummaryCard } from "@/components/profile-summary-card";
import { ReconstructionWorkspace } from "@/components/reconstruction-workspace";
import { SourceInputExamples } from "@/components/source-input-examples";

type SessionStartShellProps = {
  profile: WriterProfile;
};

export function SessionStartShell({ profile }: SessionStartShellProps) {
  const [currentProfile, setCurrentProfile] = useState(profile);

  return (
    <div className="page-shell">
      <section className="hero panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Source-aware personal writing agent</p>
          <h1>Turn rough notes and saved links into writing that still sounds like you.</h1>
          <p className="lead">
            Start with messy material. The product will organize the core
            message, ask only the missing questions, and draft a source-aware
            LinkedIn post or blog post in your preferred tone.
          </p>
        </div>
        <div className="session-preview">
          <p className="hero-side-note">
            External sources stay visible in the final draft. Markdown emphasis
            markers and emoji-heavy copy stay out.
          </p>
          <div className="preview-row">
            <span>Current tone preview: {currentProfile.defaultTone}</span>
            <span>Current output preview: {currentProfile.defaultOutput}</span>
          </div>
          <div className="preview-row">
            <span>Writer memory: {currentProfile.editPreferences.length} saved signal(s)</span>
            <span>Profile: {currentProfile.displayName}</span>
          </div>
        </div>
      </section>

      <div className="content-grid">
        <ProfileSummaryCard profile={currentProfile} />
        <SourceInputExamples />
      </div>

      <ReconstructionWorkspace
        onProfileUpdate={setCurrentProfile}
        profile={currentProfile}
      />
    </div>
  );
}
