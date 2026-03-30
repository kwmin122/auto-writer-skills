import { z } from "zod";

import { outputTargets, toneOptions } from "@/lib/writer-profile-schema";

export const sourceItemSchema = z.object({
  id: z.string().min(1),
  raw: z.string().min(1),
  kind: z.enum(["text", "url", "youtube", "github", "paper"]),
  label: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  status: z.enum(["ready", "needs_context"]),
  needsManualContext: z.boolean(),
  sourceUrl: z.string().url().optional(),
  meta: z.record(z.string()).optional()
});

export const reconstructionAnalysisSchema = z.object({
  items: z.array(sourceItemSchema),
  requestedOutput: z.enum(outputTargets),
  requestedTone: z.enum(toneOptions),
  coreMessage: z.string().min(1),
  supportingPoints: z.array(z.string().min(1)).max(5),
  followUpQuestions: z.array(z.string().min(1)).max(4),
  missingContext: z.array(z.string().min(1))
});

export const analyzeRequestSchema = z.object({
  rawInput: z.string().trim().min(1).max(12000),
  requestedOutput: z.enum(outputTargets).optional(),
  requestedTone: z.enum(toneOptions).optional()
});

export const draftRequestSchema = z.object({
  analysis: reconstructionAnalysisSchema,
  answers: z.array(z.string().trim().max(400)).max(4).default([]),
  rewriteInstruction: z.string().trim().max(160).optional().default("")
});

export const memoryRequestSchema = z.object({
  originalDraft: z.string().trim().min(1),
  editedDraft: z.string().trim().min(1)
});
