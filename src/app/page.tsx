import { SessionStartShell } from "@/components/session-start-shell";
import { loadWriterProfile } from "@/lib/writer-profile-store";

export default async function HomePage() {
  const profile = await loadWriterProfile();

  return <SessionStartShell profile={profile} />;
}
