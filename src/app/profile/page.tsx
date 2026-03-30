import { WriterProfileForm } from "@/components/writer-profile-form";
import { loadWriterProfile } from "@/lib/writer-profile-store";

export default async function ProfilePage() {
  const profile = await loadWriterProfile();

  return (
    <div className="page-shell profile-page">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Profile</p>
          <h1>Set the defaults the writing flow should carry forward.</h1>
          <p className="lead">
            Save the baseline name, tone, output target, and style guardrails the
            app should apply before later phases start rewriting content.
          </p>
        </div>

        <WriterProfileForm profile={profile} />
      </section>
    </div>
  );
}
