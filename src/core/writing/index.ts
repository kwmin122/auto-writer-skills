import {
  applyProfileGuardrails
} from "../../lib/reconstruction-engine";
import { getDefaultWriterProfile } from "../../lib/writer-profile-schema";

export function applyWritingGuardrails(text: string) {
  return applyProfileGuardrails(text, getDefaultWriterProfile());
}
