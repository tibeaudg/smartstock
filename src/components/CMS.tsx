import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Loader2,
  RefreshCcw,
  FilePlus,
  Save,
  ExternalLink,
  Copy,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type SeoPageSummary = {
  id: string;
  title: string;
  relativePath: string;
  slug: string;
  routePath: string;
  lastModified: string;
  size: number;
};

type SeoPageDetail = SeoPageSummary & { contents: string };

type ApiError = {
  ok: false;
  error: string;
};

type ListResponse = {
  ok: true;
  pages: SeoPageSummary[];
};

type DetailResponse = {
  ok: true;
  page: SeoPageDetail;
};

const TEMPLATE_OPTIONS = [
  { value: "basic", label: "SEO Layout (default)" },
  { value: "minimal", label: "Minimal" },
] as const;

type TemplateValue = (typeof TEMPLATE_OPTIONS)[number]["value"];

function formatBytes(size: number) {
  if (Number.isNaN(size) || !Number.isFinite(size)) return "0 B";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = await response.json();
  if (!response.ok || data?.ok === false) {
    const errorMessage = (data as ApiError)?.error || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }
  return data as T;
}

export default function CMS() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [editorValue, setEditorValue] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const [newPath, setNewPath] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newTemplate, setNewTemplate] = useState<TemplateValue>("basic");
  const [newContents, setNewContents] = useState("");

  const pagesQuery = useQuery({
    queryKey: ["cms-seo", "pages"],
    queryFn: () => fetchJson<ListResponse>("/api/cms/seo"),
  });

  const selectedPageQuery = useQuery({
    queryKey: ["cms-seo", "page", selectedPath],
    enabled: Boolean(selectedPath),
    queryFn: () =>
      fetchJson<DetailResponse>(
        `/api/cms/seo?path=${encodeURIComponent(selectedPath ?? "")}`
      ),
  });

  useEffect(() => {
    const detail = selectedPageQuery.data?.page;
    if (!detail) return;
    setEditorValue(detail.contents);
    setIsDirty(false);
  }, [selectedPageQuery.data?.page?.contents]);

  const pages: SeoPageSummary[] = useMemo(
    () => pagesQuery.data?.pages ?? [],
    [pagesQuery.data?.pages]
  );

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pages;
    return pages.filter((page) => {
      const haystack = [
        page.title,
        page.relativePath,
        page.slug,
        page.routePath,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [pages, searchQuery]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { path: string; contents: string }) => {
      return fetchJson<DetailResponse>("/api/cms/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Page saved",
        description: `${data.page.title} updated successfully.`,
      });
      setIsDirty(false);
      queryClient.setQueryData(["cms-seo", "page", data.page.relativePath], {
        ok: true,
        page: { ...data.page, contents: editorValue },
      } satisfies DetailResponse);
      queryClient.invalidateQueries({ queryKey: ["cms-seo", "pages"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to save page",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      path: string;
      template: string;
      title?: string;
      contents?: string;
    }) => {
      return fetchJson<DetailResponse>("/api/cms/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Page created",
        description: `${data.page.title} has been created.`,
      });
      setNewPath("");
      setNewTitle("");
      setNewContents("");
      queryClient.invalidateQueries({ queryKey: ["cms-seo", "pages"] });
      setSelectedPath(data.page.relativePath);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to create page",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const onEditorChange = useCallback(
    (value: string) => {
      setEditorValue(value);
      const original = selectedPageQuery.data?.page?.contents ?? "";
      setIsDirty(value !== original);
    },
    [selectedPageQuery.data?.page?.contents]
  );

  const onResetEditor = useCallback(() => {
    const original = selectedPageQuery.data?.page?.contents;
    if (original !== undefined) {
      setEditorValue(original);
      setIsDirty(false);
    }
  }, [selectedPageQuery.data?.page?.contents]);

  const handleCopy = useCallback(async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied`, description: value });
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  }, []);

  const handleSelectPage = useCallback(
    (relativePath: string) => {
      if (saveMutation.isPending) return;
      setSelectedPath(relativePath);
    },
    [saveMutation.isPending]
  );

  const currentSummary = useMemo(() => {
    if (!selectedPath) return undefined;
    return pages.find((page) => page.relativePath === selectedPath);
  }, [pages, selectedPath]);

  const currentDetail = selectedPageQuery.data?.page;

  const isSaving = saveMutation.isPending;
  const isCreating = createMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">SEO CMS Manager</h1>
        <p className="text-muted-foreground max-w-3xl">
          Discover, review, and edit SEO pages generated from the{" "}
          <code className="bg-muted px-1 py-0.5 rounded">src/pages/SEO</code>{" "}
          directory. Use the editor to safely update content or create new pages using predefined
          templates.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <Card className="h-[70vh] flex flex-col">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                SEO Pages
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => pagesQuery.refetch()}
                disabled={pagesQuery.isFetching}
              >
                {pagesQuery.isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
            <CardDescription>
              {pagesQuery.isLoading
                ? "Loading pages..."
                : `Showing ${filteredPages.length} of ${pages.length} pages`}
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, slug, or path..."
                className="pl-8"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-2">
                {pagesQuery.isLoading && (
                  <div className="flex h-32 items-center justify-center text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading SEO pages...
                  </div>
                )}
                {!pagesQuery.isLoading && filteredPages.length === 0 && (
                  <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    No SEO pages match the current filters.
                  </div>
                )}
                {filteredPages.map((page) => {
                  const isSelected = page.relativePath === selectedPath;
                  return (
                    <button
                      key={page.id}
                      onClick={() => handleSelectPage(page.relativePath)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50",
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-muted bg-card"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-sm text-foreground">{page.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {page.slug || "index"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{page.relativePath}</span>
                        <span>•</span>
                        <span>{formatBytes(page.size)}</span>
                        <span>•</span>
                        <span>{new Date(page.lastModified).toLocaleString()}</span>
                      </div>
                      {page.routePath && (
                        <div className="mt-2 flex items-center gap-2">
                          <a
                            href={page.routePath}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {page.routePath}
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCopy(page.routePath, "Route");
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="sr-only">Copy route</span>
                          </Button>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePlus className="h-5 w-5 text-green-600" />
                Create New SEO Page
              </CardTitle>
              <CardDescription>
                Generate a new TSX file inside <code>src/pages/SEO</code>. Include the desired
                folder structure and ensure the path ends with <code>.tsx</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-path">Relative path</Label>
                <Input
                  id="new-path"
                  placeholder="e.g. industries/new-retail-guide.tsx"
                  value={newPath}
                  onChange={(event) => setNewPath(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Path is relative to <code>src/pages/SEO</code>. Include the <code>.tsx</code>{" "}
                  extension.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-title">Title (optional)</Label>
                  <Input
                    id="new-title"
                    placeholder="Inventory Automation for Retail"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={newTemplate} onValueChange={(value) => setNewTemplate(value as TemplateValue)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-contents">Custom contents (optional)</Label>
                <Textarea
                  id="new-contents"
                  placeholder="Provide custom TSX to override the selected template..."
                  rows={8}
                  value={newContents}
                  onChange={(event) => setNewContents(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  When left blank, the system uses the selected template.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    createMutation.mutate({
                      path: newPath.trim(),
                      template: newTemplate,
                      title: newTitle.trim() || undefined,
                      contents: newContents.trim() || undefined,
                    })
                  }
                  disabled={
                    isCreating ||
                    !newPath.trim().endsWith(".tsx") ||
                    !newPath.trim()
                  }
                >
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create page
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[40vh]">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-purple-600" />
                  Editor
                </CardTitle>
                <CardDescription>
                  Edit the TSX source for the selected SEO page. Saving will write directly to disk.
                </CardDescription>
              </div>
              {currentSummary?.routePath && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a href={currentSummary.routePath} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open page
                  </a>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedPath && (
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                  Select a page from the left panel to start editing.
                </div>
              )}

              {selectedPath && (
                <>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{selectedPath}</span>
                    {currentSummary && (
                      <>
                        <span>•</span>
                        <span>{formatBytes(currentSummary.size)}</span>
                        <span>•</span>
                        <span>Last updated {new Date(currentSummary.lastModified).toLocaleString()}</span>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => handleCopy(selectedPath, "Path")}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy path</span>
                    </Button>
                  </div>

                  {selectedPageQuery.isLoading && (
                    <div className="flex h-48 items-center justify-center text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading file contents...
                    </div>
                  )}

                  {currentDetail && (
                    <>
                      <Textarea
                        value={editorValue}
                        onChange={(event) => onEditorChange(event.target.value)}
                        className="font-mono text-sm"
                        style={{ minHeight: "400px" }}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-muted-foreground">
                          Editing file size: {editorValue.length.toLocaleString()} characters
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!isDirty || isSaving}
                            onClick={onResetEditor}
                            className="gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={!isDirty || isSaving}
                            onClick={() =>
                              saveMutation.mutate({
                                path: currentDetail.relativePath,
                                contents: editorValue,
                              })
                            }
                            className="gap-2"
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Save changes
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedPageQuery.isError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
                      {(selectedPageQuery.error as Error)?.message || "Failed to load file contents"}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
