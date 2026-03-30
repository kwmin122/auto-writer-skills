import type { WriterProfile } from "@/lib/writer-profile-schema";

import { ProfileSummaryCard } from "@/components/profile-summary-card";
import { SourceInputExamples } from "@/components/source-input-examples";

type SessionStartShellProps = {
  profile: WriterProfile;
};

export function SessionStartShell({ profile }: SessionStartShellProps) {
  return (
    <div className="page-shell">
      <section className="hero panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Source-aware personal writing agent</p>
          <h1>Turn rough notes and saved links into writing that still sounds like you.</h1>
          <p className="lead">
            Start with messy material. The product will later organize the core
            message, ask only the missing questions, and draft a source-aware
            LinkedIn post or blog post in your preferred tone.
          </p>
        </div>
        <div className="session-preview">
          <label className="field">
            <span>Session input</span>
            <textarea
              defaultValue="Paste notes and source links here. Phase 2 will start parsing this material."
              readOnly
              rows={8}
            />
          </label>
          <div className="preview-row">
            <span>Current tone preview: {profile.defaultTone}</span>
            <span>Current output preview: {profile.defaultOutput}</span>
          </div>
        </div>
      </section>

      <div className="content-grid">
        <ProfileSummaryCard profile={profile} />
        <SourceInputExamples />
      </div>
    </div>
  );
}
