const express = require("express");
const path = require("path");
const {
  listSeoPages,
  readSeoPage,
  writeSeoPage,
  deleteSeoPage,
  createSeoPage,
  getSeoPageSummary,
  getSlugFromRelativePath,
} = require("./seoFs.cjs");

const router = express.Router();

const DEFAULT_TEMPLATE_KEY = "basic";

function ensureString(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw Object.assign(new Error(`${fieldName} is required`), { statusCode: 400 });
  }
  return value.trim();
}

function slugToTitle(slug) {
  return slug
    .split("/")
    .pop()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toComponentName(filePath) {
  const filename = path.basename(filePath, path.extname(filePath));
  return filename
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function escapeDoubleQuotes(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function generateTemplate(relativePath, templateKey = DEFAULT_TEMPLATE_KEY, explicitTitle) {
  const baseTitle = explicitTitle || slugToTitle(relativePath.replace(/\.tsx$/, ""));
  const safeTitle = escapeDoubleQuotes(baseTitle);
  const componentName = toComponentName(relativePath);
  const slug = getSlugFromRelativePath(relativePath);
  const publicPath = slug ? `/${slug}` : "";

  switch (templateKey) {
    case "minimal":
      return `import SEO from "@/components/SEO";

export default function ${componentName}() {
  return (
    <>
      <SEO
        title="${safeTitle}"
        description="${safeTitle} page description"
        url="${slug ? `https://www.stockflow.be${publicPath}` : "https://www.stockflow.be/seo"}"
      />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">${safeTitle}</h1>
          <p className="text-gray-600">Start building your content here.</p>
        </div>
      </main>
    </>
  );
}
`;
    case DEFAULT_TEMPLATE_KEY:
    default:
      return `import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";

export default function ${componentName}() {
  return (
    <SeoPageLayout title="${safeTitle}">
      <SEO
        title="${safeTitle}"
        description="${safeTitle} page description"
        url="${slug ? `https://www.stockflow.be${publicPath}` : "https://www.stockflow.be/seo"}"
      />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">${safeTitle}</h1>
          <p className="text-lg text-gray-600">Write engaging content for ${safeTitle}.</p>
        </div>
      </section>
    </SeoPageLayout>
  );
}
`;
  }
}

router.get("/", async (req, res) => {
  try {
    const requestedPath = req.query.path;
    if (typeof requestedPath === "string" && requestedPath.trim()) {
      const contents = await readSeoPage(requestedPath);
      const summary = await getSeoPageSummary(requestedPath);
      res.json({ ok: true, page: { ...summary, contents } });
      return;
    }

    const pages = await listSeoPages();
    res.json({ ok: true, pages });
  } catch (error) {
    console.error("[cms-seo] GET error:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ ok: false, error: error.message || "Failed to load SEO pages" });
  }
});

router.put("/", async (req, res) => {
  try {
    const relativePath = ensureString(req.body?.path, "path");
    const contents = ensureString(req.body?.contents, "contents");

    await writeSeoPage(relativePath, contents);
    const summary = await getSeoPageSummary(relativePath);

    res.json({ ok: true, page: summary });
  } catch (error) {
    console.error("[cms-seo] PUT error:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ ok: false, error: error.message || "Failed to save SEO page" });
  }
});

router.post("/", async (req, res) => {
  try {
    const relativePath = ensureString(req.body?.path, "path");
    const templateKey = (req.body?.template || DEFAULT_TEMPLATE_KEY).toString();
    const providedContents = req.body?.contents;
    const providedTitle =
      typeof req.body?.title === "string" ? req.body.title.trim() : undefined;

    const contents =
      typeof providedContents === "string" && providedContents.trim().length > 0
        ? providedContents
        : generateTemplate(relativePath, templateKey, providedTitle);

    await createSeoPage(relativePath, contents);
    const summary = await getSeoPageSummary(relativePath);

    res.status(201).json({ ok: true, page: summary });
  } catch (error) {
    console.error("[cms-seo] POST error:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ ok: false, error: error.message || "Failed to create SEO page" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const relativePath = ensureString(req.body?.path, "path");
    await deleteSeoPage(relativePath);
    res.json({ ok: true, path: relativePath });
  } catch (error) {
    console.error("[cms-seo] DELETE error:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ ok: false, error: error.message || "Failed to delete SEO page" });
  }
});

router.all("/", (req, res) => {
  res.set("Allow", "GET,POST,PUT,DELETE");
  res.status(405).json({ ok: false, error: "Method not allowed" });
});

module.exports = router;
module.exports.default = router;


