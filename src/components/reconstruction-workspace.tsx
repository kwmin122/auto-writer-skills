"use client";

import { useState } from "react";

import {
  outputTargets,
  toneOptions,
  type WriterProfile
} from "@/lib/writer-profile-schema";
import type { DraftResult, ReconstructionAnalysis } from "@/lib/reconstruction-engine";

type ReconstructionWorkspaceProps = {
  profile: WriterProfile;
  onProfileUpdate: (profile: WriterProfile) => void;
};

type BusyState = "idle" | "analyzing" | "drafting" | "saving-memory";

export function ReconstructionWorkspace({
  profile,
  onProfileUpdate
}: ReconstructionWorkspaceProps) {
  const [rawInput, setRawInput] = useState("");
  const [requestedOutput, setRequestedOutput] = useState(profile.defaultOutput);
  const [requestedTone, setRequestedTone] = useState(profile.defaultTone);
  const [analysis, setAnalysis] = useState<ReconstructionAnalysis | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState<DraftResult | null>(null);
  const [editedDraft, setEditedDraft] = useState("");
  const [rewriteInstruction, setRewriteInstruction] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Paste messy notes and links. The app will organize them before drafting."
  );
  const [modeNote, setModeNote] = useState(
    "Drafts currently run in heuristic mode, but the product rules still enforce source lines and human-readable style."
  );
  const [busyState, setBusyState] = useState<BusyState>("idle");

  async function handleAnalyze() {
    if (!rawInput.trim()) {
      setStatusMessage("Add notes or links first.");
      return;
    }

    setBusyState("analyzing");
    setStatusMessage("Organizing source material...");

    try {
      const response = await fetch("/api/reconstruct/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rawInput,
          requestedOutput,
          requestedTone
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Analyze request failed");
      }

      setAnalysis(payload.analysis);
      setAnswers(payload.analysis.followUpQuestions.map(() => ""));
      setDraft(null);
      setEditedDraft("");
      setRewriteInstruction("");
      setStatusMessage("Material organized. Review the core message and fill any missing context.");
      setModeNote(
        "Every external source will remain visible in the generated draft. Markdown emphasis markers and emoji-heavy copy stay out."
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not organize the material."
      );
    } finally {
      setBusyState("idle");
    }
  }

  async function handleGenerateDraft() {
    if (!analysis) {
      setStatusMessage("Organize the material before generating a draft.");
      return;
    }

    setBusyState("drafting");
    setStatusMessage("Generating draft...");

    try {
      const response = await fetch("/api/reconstruct/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          analysis,
          answers,
          rewriteInstruction
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Draft request failed");
      }

      setDraft(payload.draft);
      setEditedDraft(payload.draft.content);
      setStatusMessage("Draft ready. You can revise it directly, or ask for a shorter or sharper rewrite.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not generate the draft."
      );
    } finally {
      setBusyState("idle");
    }
  }

  async function handleSaveEditMemory() {
    if (!draft) {
      setStatusMessage("Generate a draft before saving edit memory.");
      return;
    }

    if (editedDraft.trim() === draft.content.trim()) {
      setStatusMessage("Make at least one meaningful edit before saving memory.");
      return;
    }

    setBusyState("saving-memory");
    setStatusMessage("Saving edit memory...");

    try {
      const response = await fetch("/api/profile/memory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          originalDraft: draft.content,
          editedDraft
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Memory request failed");
      }

      onProfileUpdate(payload.profile);
      setStatusMessage(
        payload.preferences.length > 0
          ? `Saved ${payload.preferences.length} reusable edit preference${payload.preferences.length > 1 ? "s" : ""}.`
          : "No recurring edit pattern was detected, so the memory profile stayed the same."
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not save edit memory."
      );
    } finally {
      setBusyState("idle");
    }
  }

  return (
    <section className="panel workspace-panel">
      <div className="panel-header">
        <p className="eyebrow">Reconstruction workspace</p>
        <h2>Turn mixed notes and links into a source-aware draft.</h2>
        <p className="lead">
          Start rough. The app will classify the material, propose the core point,
          ask only the missing questions, and draft against your saved style defaults.
        </p>
      </div>

      <div className="workspace-grid">
        <div className="workspace-form">
          <label className="field">
            <span>Source material</span>
            <textarea
              name="rawInput"
              onChange={(event) => setRawInput(event.target.value)}
              placeholder="Example: AI summaries keep flattening my point.\n\nhttps://youtu.be/abcd1234\n\nhttps://github.com/kwmin122/auto-writer-skills"
              rows={14}
              value={rawInput}
            />
          </label>

          <div className="field-grid compact-grid">
            <label className="field">
              <span>Output</span>
              <select
                onChange={(event) =>
                  setRequestedOutput(event.target.value as WriterProfile["defaultOutput"])
                }
                value={requestedOutput}
              >
                {outputTargets.map((target) => (
                  <option key={target} value={target}>
                    {target === "linkedin" ? "LinkedIn post" : "Blog post"}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Tone</span>
              <select
                onChange={(event) =>
                  setRequestedTone(event.target.value as WriterProfile["defaultTone"])
                }
                value={requestedTone}
              >
                {toneOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="workspace-actions">
            <button
              className="primary-button"
              disabled={busyState !== "idle"}
              onClick={handleAnalyze}
              type="button"
            >
              {busyState === "analyzing" ? "Organizing..." : "Organize material"}
            </button>
            <p className="helper-text">
              External-source-based drafts will always keep a source list at the end.
            </p>
          </div>

          {analysis ? (
            <div className="workspace-card">
              <div className="panel-header">
                <p className="eyebrow">Clarifying questions</p>
                <h2>Fill only the missing gaps.</h2>
              </div>
              {analysis.followUpQuestions.length > 0 ? (
                <div className="question-list">
                  {analysis.followUpQuestions.map((question, index) => (
                    <label className="field" key={question}>
                      <span>{question}</span>
                      <textarea
                        onChange={(event) =>
                          setAnswers((current) =>
                            current.map((answer, answerIndex) =>
                              answerIndex === index ? event.target.value : answer
                            )
                          )
                        }
                        rows={3}
                        value={answers[index] ?? ""}
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <p className="helper-text">
                  The current material is already specific enough to draft.
                </p>
              )}

              <label className="field">
                <span>Rewrite request</span>
                <input
                  onChange={(event) => setRewriteInstruction(event.target.value)}
                  placeholder="Examples: shorter, sharper, more like me"
                  value={rewriteInstruction}
                />
              </label>

              <div className="workspace-actions">
                <button
                  className="primary-button"
                  disabled={busyState !== "idle"}
                  onClick={handleGenerateDraft}
                  type="button"
                >
                  {busyState === "drafting" ? "Generating..." : "Generate draft"}
                </button>
                <p className="helper-text">
                  Short rewrite notes reuse the same material and direction.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="workspace-results">
          {analysis ? (
            <>
              <div className="workspace-card">
                <div className="panel-header">
                  <p className="eyebrow">Material view</p>
                  <h2>What the system found</h2>
                </div>
                <ul className="source-item-list">
                  {analysis.items.map((item) => (
                    <li className="source-item-card" key={item.id}>
                      <div className="source-item-header">
                        <strong>{item.title}</strong>
                        <span
                          className={`status-badge status-badge-${item.status}`}
                        >
                          {item.status === "ready" ? "Ready" : "Needs context"}
                        </span>
                      </div>
                      <p className="helper-text">
                        {item.label}
                        {item.sourceUrl ? ` | ${item.sourceUrl}` : " | personal note"}
                      </p>
                      <p className="source-item-excerpt">{item.excerpt}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="workspace-card">
                <div className="panel-header">
                  <p className="eyebrow">Direction</p>
                  <h2>{analysis.coreMessage}</h2>
                </div>
                <ul className="supporting-points">
                  {analysis.supportingPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {analysis.missingContext.length > 0 ? (
                  <p className="helper-text">
                    Missing context: {analysis.missingContext.join(" ")}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="empty-state-card">
              <div className="panel-header">
                <p className="eyebrow">Waiting for material</p>
                <h2>Paste notes, drafts, URLs, YouTube, GitHub, or paper links.</h2>
              </div>
              <p className="lead">
                Once the material is organized, you will see the source list, core
                message, follow-up questions, and the draft editor here.
              </p>
            </div>
          )}

          <div className="workspace-card">
            <div className="panel-header">
              <p className="eyebrow">Draft</p>
              <h2>Editable output</h2>
            </div>
            <textarea
              onChange={(event) => setEditedDraft(event.target.value)}
              placeholder="The generated draft will appear here."
              rows={18}
              value={editedDraft}
            />
            <div className="workspace-actions">
              <button
                className="secondary-button"
                disabled={busyState !== "idle" || !draft}
                onClick={handleSaveEditMemory}
                type="button"
              >
                {busyState === "saving-memory" ? "Saving memory..." : "Save edit memory"}
              </button>
              <p className="helper-text">{statusMessage}</p>
            </div>
            <p className="helper-text">{modeNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
