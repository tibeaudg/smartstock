import path from "node:path";
import fs from "node:fs/promises";

const SEO_ROOT = path.resolve(process.cwd(), "src", "pages", "SEO");

export type SeoPageSummary = {
  id: string;
  title: string;
  relativePath: string;
  slug: string;
  routePath: string;
  lastModified: string;
  size: number;
};

function ensureWithinSeoRoot(filePath: string) {
  if (!filePath.startsWith(SEO_ROOT)) {
    throw new Error("Path is outside of SEO directory");
  }
}

function normalizeRelativePath(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized.endsWith(".tsx")) {
    throw new Error("SEO pages must have a .tsx extension");
  }
  return normalized;
}

function resolveSeoPath(relativePath: string) {
  const normalized = normalizeRelativePath(relativePath);
  const absolute = path.resolve(SEO_ROOT, normalized);
  ensureWithinSeoRoot(absolute);
  return { absolute, relative: normalized };
}

export function getSlugFromRelativePath(relativePath: string) {
  const withoutExtension = relativePath.replace(/\.tsx$/, "");
  const segments = withoutExtension.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }
  const slugSegments = [...segments];
  if (slugSegments[slugSegments.length - 1] === "index") {
    slugSegments.pop();
  }
  if (slugSegments.length === 0) {
    return "";
  }
  const legacyTopLevelSlugs = new Set([
    "asset-tracking",
    "inventory-management",
    "what-is-lead-time",
    "warehouse-management",
    "warehouse-management-system",
  ]);
  if (slugSegments[0] === "glossary") {
    if (slugSegments.length === 1) {
      return "glossary";
    }
    if (slugSegments.length === 2 && legacyTopLevelSlugs.has(slugSegments[1])) {
      return slugSegments[1];
    }
    return slugSegments.join("/");
  }
  return slugSegments[slugSegments.length - 1];
}

function slugToTitle(slug: string) {
  return slug
    .split("/")
    .pop()
    ?.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) ?? slug;
}

function buildSummary(relativePath: string, stats: Awaited<ReturnType<typeof fs.stat>>): SeoPageSummary {
  const slug = getSlugFromRelativePath(relativePath);
  return {
    id: relativePath,
    title: slugToTitle(slug || relativePath.replace(/\.tsx$/, "")),
    relativePath,
    slug,
    routePath: slug ? `/${slug}` : "",
    lastModified: stats.mtime.toISOString(),
    size: stats.size,
  };
}

async function walkSeoDirectory(directory: string, accumulator: SeoPageSummary[]) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (
      entry.isDirectory() &&
      entry.name !== "node_modules" &&
      entry.name !== ".git"
    ) {
      await walkSeoDirectory(absolutePath, accumulator);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".tsx")) {
      continue;
    }
    const relativePath = path.relative(SEO_ROOT, absolutePath).replace(/\\/g, "/");
    const stats = await fs.stat(absolutePath);
    accumulator.push(buildSummary(relativePath, stats));
  }
}

export async function listSeoPages(): Promise<SeoPageSummary[]> {
  const summaries: SeoPageSummary[] = [];
  await walkSeoDirectory(SEO_ROOT, summaries);
  return summaries.sort((a, b) => a.routePath.localeCompare(b.routePath));
}

export async function readSeoPage(relativePath: string): Promise<string> {
  const { absolute } = resolveSeoPath(relativePath);
  return fs.readFile(absolute, "utf8");
}

export async function writeSeoPage(relativePath: string, contents: string) {
  const { absolute } = resolveSeoPath(relativePath);
  await fs.writeFile(absolute, contents, "utf8");
}

export async function createSeoPage(relativePath: string, contents: string) {
  const { absolute } = resolveSeoPath(relativePath);
  try {
    await fs.access(absolute);
    throw new Error("File already exists");
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, contents, "utf8");
}

export async function getSeoPageSummary(relativePath: string): Promise<SeoPageSummary> {
  const { absolute, relative } = resolveSeoPath(relativePath);
  const stats = await fs.stat(absolute);
  return buildSummary(relative, stats);
}

