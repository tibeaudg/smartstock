const path = require("path");
const fs = require("fs/promises");

const SEO_ROOT = path.resolve(process.cwd(), "src", "pages", "SEO");
const LEGACY_TOP_LEVEL_SLUGS = new Set([
  "asset-tracking",
  "inventory-management",
  "what-is-lead-time",
  "warehouse-management",
  "warehouse-management-system",
]);

function ensureWithinSeoRoot(filePath) {
  if (!filePath.startsWith(SEO_ROOT)) {
    throw new Error("Path is outside of SEO directory");
  }
}

function normalizeRelativePath(relativePath) {
  if (typeof relativePath !== "string" || !relativePath.trim()) {
    throw new Error("Path must be a non-empty string");
  }
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized.endsWith(".tsx")) {
    throw new Error("SEO pages must have a .tsx extension");
  }
  return normalized;
}

function resolveSeoPath(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const absolute = path.resolve(SEO_ROOT, normalized);
  ensureWithinSeoRoot(absolute);
  return { absolute, relative: normalized };
}

function getSlugFromRelativePath(relativePath) {
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
  if (slugSegments[0] === "glossary") {
    if (slugSegments.length === 1) {
      return "glossary";
    }
    if (
      slugSegments.length === 2 &&
      LEGACY_TOP_LEVEL_SLUGS.has(slugSegments[1])
    ) {
      return slugSegments[1];
    }
    return slugSegments.join("/");
  }
  return slugSegments[slugSegments.length - 1];
}

function slugToTitle(slug) {
  if (!slug) return "Untitled SEO Page";
  return slug
    .split("/")
    .pop()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildSummary(relativePath, stats) {
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

async function walkSeoDirectory(directory, accumulator) {
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

async function listSeoPages() {
  const summaries = [];
  await walkSeoDirectory(SEO_ROOT, summaries);
  return summaries.sort((a, b) => a.routePath.localeCompare(b.routePath));
}

async function readSeoPage(relativePath) {
  const { absolute } = resolveSeoPath(relativePath);
  return fs.readFile(absolute, "utf8");
}

async function writeSeoPage(relativePath, contents) {
  const { absolute } = resolveSeoPath(relativePath);
  await fs.writeFile(absolute, contents, "utf8");
}

async function deleteSeoPage(relativePath) {
  const { absolute } = resolveSeoPath(relativePath);
  await fs.unlink(absolute);
}

async function createSeoPage(relativePath, contents) {
  const { absolute } = resolveSeoPath(relativePath);
  try {
    await fs.access(absolute);
    throw new Error("File already exists");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, contents, "utf8");
}

async function getSeoPageSummary(relativePath) {
  const { absolute, relative } = resolveSeoPath(relativePath);
  const stats = await fs.stat(absolute);
  return buildSummary(relative, stats);
}

const exportsObject = {
  SEO_ROOT,
  resolveSeoPath,
  getSlugFromRelativePath,
  listSeoPages,
  readSeoPage,
  writeSeoPage,
  deleteSeoPage,
  createSeoPage,
  getSeoPageSummary,
};

module.exports = exportsObject;
module.exports.default = exportsObject;

