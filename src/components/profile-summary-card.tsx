import type { WriterProfile } from "@/lib/writer-profile-schema";

type ProfileSummaryCardProps = {
  profile: WriterProfile;
};

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <section className="panel profile-summary-card">
      <div className="panel-header">
        <p className="eyebrow">Writer profile</p>
        <h2>{profile.displayName}</h2>
      </div>

      <dl className="profile-summary-grid">
        <div>
          <dt>Default tone</dt>
          <dd>{profile.defaultTone}</dd>
        </div>
        <div>
          <dt>Default output</dt>
          <dd>{profile.defaultOutput}</dd>
        </div>
        <div>
          <dt>Banned markers</dt>
          <dd>{profile.bannedMarkers.join(", ")}</dd>
        </div>
        <div>
          <dt>Writing notes</dt>
          <dd>{profile.writingNotes}</dd>
        </div>
        <div>
          <dt>Edit memory</dt>
          <dd>
            {profile.editPreferences.length > 0
              ? profile.editPreferences.join(" | ")
              : "No saved edit preferences yet."}
          </dd>
        </div>
      </dl>
    </section>
  );
}
