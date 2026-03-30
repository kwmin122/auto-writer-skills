export type SourceKind = "text" | "url" | "youtube" | "github" | "paper";
export type SourceStatus = "ready" | "needs_context";

export type NormalizedSourceItem = {
  id: string;
  raw: string;
  kind: SourceKind;
  label: string;
  title: string;
  excerpt: string;
  status: SourceStatus;
  needsManualContext: boolean;
  sourceUrl?: string;
  meta?: Record<string, string>;
};

type NormalizeSourceOptions = {
  fetchImpl?: typeof fetch;
};

const urlPattern = /^https?:\/\/\S+$/i;

export function splitSourceInput(rawInput: string): string[] {
  return rawInput
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .flatMap((chunk) => {
      if (!chunk) {
        return [];
      }

      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length > 1 && lines.every((line) => urlPattern.test(line))) {
        return lines;
      }

      return [chunk];
    });
}

export async function normalizeSourceItems(
  rawInput: string,
  options: NormalizeSourceOptions = {}
): Promise<NormalizedSourceItem[]> {
  const entries = splitSourceInput(rawInput);

  const items = await Promise.all(
    entries.map((entry, index) =>
      normalizeSourceItem(entry, index, options.fetchImpl ?? fetch)
    )
  );

  return items;
}

async function normalizeSourceItem(
  raw: string,
  index: number,
  fetchImpl: typeof fetch
): Promise<NormalizedSourceItem> {
  if (urlPattern.test(raw)) {
    return normalizeUrlSource(raw, index, fetchImpl);
  }

  return {
    id: `source-${index + 1}`,
    raw,
    kind: "text",
    label: "Text note",
    title: buildTextTitle(raw),
    excerpt: trimText(raw, 220),
    status: "ready",
    needsManualContext: false
  };
}

async function normalizeUrlSource(
  raw: string,
  index: number,
  fetchImpl: typeof fetch
): Promise<NormalizedSourceItem> {
  const url = new URL(raw);

  if (isYouTubeUrl(url)) {
    const videoId = getYouTubeId(url);

    return {
      id: `source-${index + 1}`,
      raw,
      kind: "youtube",
      label: "YouTube video",
      title: videoId ? `YouTube reference (${videoId})` : "YouTube reference",
      excerpt: "Video source captured from YouTube. Add personal context if the angle matters.",
      status: "ready",
      needsManualContext: false,
      sourceUrl: raw,
      meta: videoId ? { videoId } : undefined
    };
  }

  if (isGitHubUrl(url)) {
    const repoSlug = getGitHubRepoSlug(url);

    return {
      id: `source-${index + 1}`,
      raw,
      kind: "github",
      label: "GitHub repository",
      title: repoSlug ?? "GitHub repository",
      excerpt: repoSlug
        ? `Repository reference for ${repoSlug}.`
        : "GitHub repository reference.",
      status: "ready",
      needsManualContext: false,
      sourceUrl: raw,
      meta: repoSlug ? { repo: repoSlug } : undefined
    };
  }

  if (isPaperUrl(url)) {
    const paperId = getPaperId(url);

    return {
      id: `source-${index + 1}`,
      raw,
      kind: "paper",
      label: "Paper reference",
      title: paperId ? `Paper reference (${paperId})` : "Paper reference",
      excerpt: "Research or PDF source captured for attribution.",
      status: "ready",
      needsManualContext: false,
      sourceUrl: raw,
      meta: paperId ? { paperId } : undefined
    };
  }

  const snapshot = await readUrlSnapshot(raw, fetchImpl);

  return {
    id: `source-${index + 1}`,
    raw,
    kind: "url",
    label: "Web article",
    title: snapshot.title,
    excerpt: snapshot.excerpt,
    status: snapshot.status,
    needsManualContext: snapshot.status === "needs_context",
    sourceUrl: raw,
    meta: { host: url.hostname }
  };
}

async function readUrlSnapshot(url: string, fetchImpl: typeof fetch) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const response = await fetchImpl(url, {
      headers: {
        "User-Agent": "source-aware-writer/0.1"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Fetch failed with ${response.status}`);
    }

    const html = await response.text();
    const title = extractTitle(html) ?? new URL(url).hostname;
    const text = stripHtml(html);

    return {
      title,
      excerpt: trimText(text, 220) || "URL content was fetched but yielded no readable summary.",
      status: "ready" as const
    };
  } catch {
    return {
      title: new URL(url).hostname,
      excerpt:
        "This URL could not be read automatically. Add one or two lines about why it matters.",
      status: "needs_context" as const
    };
  }
}

function buildTextTitle(raw: string) {
  const compact = raw.replace(/\s+/g, " ").trim();
  const firstWords = compact.split(" ").slice(0, 6).join(" ");
  return firstWords.length > 0 ? firstWords : "Text note";
}

function trimText(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match?.[1]?.replace(/\s+/g, " ").trim();
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function isYouTubeUrl(url: URL) {
  return url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be");
}

function getYouTubeId(url: URL) {
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.split("/").filter(Boolean)[0] ?? "";
  }

  return url.searchParams.get("v") ?? "";
}

function isGitHubUrl(url: URL) {
  return url.hostname === "github.com";
}

function getGitHubRepoSlug(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]}/${parts[1]}`;
  }

  return "";
}

function isPaperUrl(url: URL) {
  return (
    url.hostname.includes("arxiv.org") ||
    url.pathname.toLowerCase().endsWith(".pdf") ||
    url.hostname.includes("doi.org")
  );
}

function getPaperId(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  return parts.at(-1) ?? url.hostname;
}
