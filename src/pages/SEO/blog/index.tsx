import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { getAllSeoPages, type PageMetadata } from "@/config/topicClusters";
import { getSeoRoutes } from "@/routes/seoRoutes";
import { Search } from "lucide-react";
import SeoPageLayout from "@/components/SeoPageLayout";
import SEO from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";

// Get original file paths to determine folder structure
// From src/pages/SEO/, ../ goes to src/pages/SEO/
// So ../**/*.tsx matches all .tsx files in src/pages/SEO/**/*
const seoFileModules = {
  ...(import.meta as any).glob("../**/*.tsx", { eager: false }),
};





export default function SeoBlogIndexPage() {
  usePageRefresh();
  const [searchQuery, setSearchQuery] = useState("");

  // Get all SEO pages - combine routes with metadata
  const allPages = useMemo(() => {
    const routes = getSeoRoutes();
    const metadataMap = new Map<string, PageMetadata>();
    
    // Create a map of metadata by path (normalize paths for matching)
    getAllSeoPages().forEach(page => {
      const normalizedPath = page.path.startsWith('/') ? page.path : `/${page.path}`;
      metadataMap.set(normalizedPath, page);
      // Also store without leading slash for flexible matching
      if (normalizedPath !== page.path) {
        metadataMap.set(page.path, page);
      }
    });

    // Helper to extract slug from file path (matching seoRoutes.tsx logic exactly)
    const getSlugFromFilePath = (filePath: string): string => {
      const withoutPrefix = filePath
        .replace(/^(\.\.\/)+/, "")
        .replace(/^pages\/(SEO|seo)\//, "");
      const withoutExtension = withoutPrefix.replace(/\.tsx$/, "");
      const segments = withoutExtension.split("/").filter(Boolean);

      if (segments.length === 0) return "";

      const lastSegment = segments[segments.length - 1];
      if (lastSegment === "index") {
        segments.pop();
      }

      if (segments.length === 0) return "";

      const legacyTopLevelSlugs = new Set([
        "asset-tracking",
        "inventory-management",
        "what-is-lead-time",
        "warehouse-management",
        "warehouse-management-system",
      ]);

      if (segments[0] === "glossary") {
        if (segments.length === 1) {
          return "glossary";
        }
        if (segments.length === 2 && legacyTopLevelSlugs.has(segments[1])) {
          return segments[1];
        }
        return segments.join("/");
      }

      return segments[segments.length - 1];
    };

    // Create a map from route path to category based on file folder structure
    // Key: route path (e.g., "/article"), Value: category (e.g., "blog")
    const routePathToCategoryMap = new Map<string, string>();
    
    // Build route path to category map from all file paths
    Object.keys(seoFileModules).forEach(filePath => {
      // Skip index files (they're category overview pages, not articles)
      const checkExt = filePath.replace(/\.tsx$/, "");
      const checkSegments = checkExt.split("/").filter(Boolean);
      const lastSegment = checkSegments[checkSegments.length - 1];
      if (lastSegment === "index") return;
      
      // Extract folder structure from original file path FIRST (before slug extraction)
      // Use the same normalization logic as getSlugFromFilePath to ensure consistency
      // This processes paths the same way as seoRoutes.tsx does
      const withoutPrefix = filePath
        .replace(/^(\.\.\/)+/, "")
        .replace(/^pages\/(SEO|seo)\//, "");
      
      const withoutExtension = withoutPrefix.replace(/\.tsx$/, "");
      const segments = withoutExtension.split("/").filter(Boolean);
      
      // Determine category from folder structure
      let category: string;
      if (segments.length === 0) {
        // Empty segments - shouldn't happen, but default to other
        category = 'other';
      } else if (segments.length === 1) {
        // File is directly in pages/SEO root - put in "other" category
        category = 'other';
      } else {
        // File is in a subfolder - first segment is the category
        category = segments[0];
      }
      
      // Filter out invalid category names (empty, ".", etc.)
      if (!category || category === '.' || category.trim() === '') {
        category = 'other';
      }
      
      // Extract slug using same logic as getSeoRoutes
      const slug = getSlugFromFilePath(filePath);
      if (!slug) return;
      
      // Map route path to category
      const routePath = `/${slug}`;
      routePathToCategoryMap.set(routePath, category);
      // Also store without leading slash for flexible matching
      const routePathNoSlash = routePath.replace(/^\//, '');
      if (routePathNoSlash !== routePath) {
        routePathToCategoryMap.set(routePathNoSlash, category);
      }
      
      // Debug logging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log(`File: ${filePath} -> Route: ${routePath} -> Category: ${category}`);
      }
    });
    
    // Debug: Log mapping statistics (development only)
    if (process.env.NODE_ENV === 'development') {
      const categoryCounts: Record<string, number> = {};
      routePathToCategoryMap.forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      console.log('Route to Category Map:', {
        totalMappings: routePathToCategoryMap.size,
        categoryDistribution: categoryCounts,
        sampleMappings: Array.from(routePathToCategoryMap.entries()).slice(0, 10)
      });
    }

    // Helper to get category from route path using the map
    const getCategoryFromRoutePath = (routePath: string): string => {
      const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
      const pathNoSlash = normalizedPath.replace(/^\//, '');
      
      // Try to find category in map (with and without leading slash)
      let category = routePathToCategoryMap.get(normalizedPath) || 
                     routePathToCategoryMap.get(pathNoSlash) ||
                     routePathToCategoryMap.get(routePath) ||
                     'other';
      
      // Ensure category is valid (filter out ".", empty, etc.)
      if (!category || category === '.' || category.trim() === '') {
        category = 'other';
      }
      
      return category;
    };

    // Helper to generate title from slug
    const generateTitleFromSlug = (slug: string): string => {
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Combine routes with metadata, creating basic metadata for pages without it
    const processedPages = routes
      .filter(route => route.path !== '') // Exclude this overview page itself
      .map(route => {
        const existingMetadata = metadataMap.get(route.path);
        
        // Get category from folder structure - this is the source of truth
        const folderCategory = getCategoryFromRoutePath(route.path);
        
        // Debug logging (development only)
        if (process.env.NODE_ENV === 'development' && folderCategory === 'other' && route.path !== '') {
          console.warn(`Route ${route.path} mapped to category "other". Available in map: ${routePathToCategoryMap.has(route.path)}`);
        }
        
        if (existingMetadata) {
          // Override category with folder-based category
          return {
            ...existingMetadata,
            category: folderCategory,
          };
        }

        // Derive metadata from path for pages not in topic clusters
        const pathSegments = route.path.split('/').filter(Boolean);
        const slug = pathSegments[pathSegments.length - 1] || '';
        
        // Generate title from slug
        const title = generateTitleFromSlug(slug);

        // Detect language from category
        const language: 'nl' | 'en' = folderCategory === 'dutch' ? 'nl' : 'en';

        return {
          path: route.path,
          title,
          language,
          category: folderCategory,
          description: `Learn more about ${title.toLowerCase()}`,
        } as PageMetadata;
      });

    return processedPages;
  }, []);

  // Group pages by category
  const pagesByCategory = useMemo(() => {
    const grouped: Record<string, PageMetadata[]> = {};
    allPages.forEach(page => {
      let category = page.category || 'other';
      // Filter out invalid category names
      if (!category || category === '.' || category.trim() === '') {
        category = 'other';
      }
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(page);
    });
    return grouped;
  }, [allPages]);

  // Get unique categories (filter out invalid ones)
  const categories = useMemo(() => {
    return Object.keys(pagesByCategory)
      .filter(cat => cat && cat !== '.' && cat.trim() !== '')
      .sort();
  }, [pagesByCategory]);

  // Filter pages based on search, category, and language
  const filteredPages = useMemo(() => {
    let filtered = allPages;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(page => 
        page.title.toLowerCase().includes(query) ||
        page.description?.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [allPages, searchQuery]);

  // Group filtered pages by category
  const filteredPagesByCategory = useMemo(() => {
    const grouped: Record<string, PageMetadata[]> = {};
    filteredPages.forEach(page => {
      let category = page.category || 'other';
      // Filter out invalid category names
      if (!category || category === '.' || category.trim() === '') {
        category = 'other';
      }
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(page);
    });
    return grouped;
  }, [filteredPages]);

  // Helper function to format category name for display
  const formatCategoryName = (category: string): string => {
    // Filter out invalid categories
    if (!category || category === '.' || category.trim() === '') {
      return 'Other';
    }
    
    // Handle special cases
    const specialCases: Record<string, string> = {
      'best-of': 'Best Of',
      'dutch': 'Dutch',
    };

    if (specialCases[category]) {
      return specialCases[category];
    }

    // Format regular category names (e.g., "industries" -> "Industries")
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get sorted categories for filtered pages (filter out invalid ones)
  const filteredCategories = useMemo(() => {
    return Object.keys(filteredPagesByCategory)
      .filter(cat => cat && cat !== '.' && cat.trim() !== '')
      .sort();
  }, [filteredPagesByCategory]);

  const totalPages = allPages.length;
  const filteredCount = filteredPages.length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Articles Overview - StockFlow",
    "description": "Explore our complete library of articles, guides, and resources. Find everything you need about inventory management, software comparisons, and industry insights.",
    "url": "https://www.stockflowsystems.com",
    "mainEntity": {
      "@type": "ItemList",
      "name": "StockFlow Articles",
      "numberOfItems": totalPages,
      "itemListElement": allPages.slice(0, 10).map((page, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": page.title,
        "url": `https://www.stockflowsystems.com${page.path}`
      }))
    }
  };

  return (
    <SeoPageLayout 
      title="Articles Overview"
      heroTitle="Articles Overview"
      description="Explore our complete library of articles, guides, and resources about inventory management."
    >
      <SEO
        title="Articles Overview - StockFlow | Inventory Management Blog"
        description="Explore our complete library of articles, guides, and resources. Find everything you need about inventory management, software comparisons, and industry insights."
        keywords="inventory management articles, inventory blog, stock management guides, inventory software articles, warehouse management resources"
        url="https://www.stockflowsystems.com"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />
      <section id="articles" className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
              Explore our complete library of articles, guides, and resources. Find everything you need about inventory management, software comparisons, and industry insights.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles by title, description, or path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            {/* Results Count */}
            {filteredCount !== totalPages && (
              <div className="text-sm text-gray-600">
                Showing {filteredCount} of {totalPages} articles
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles Grid by Category */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">

          
          <div className="space-y-12">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found. Check console for debugging info.</p>
              </div>
            ) : (
              filteredCategories.map((category) => {
                const pagesInCategory = filteredPagesByCategory[category];
                if (!pagesInCategory || pagesInCategory.length === 0) {
                  return null;
                }
                return (
                  <div key={category} className="space-y-6">
                    {/* Category Title */}
                    <div className="border-b border-gray-200 pb-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {formatCategoryName(category)}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {pagesInCategory.length} {pagesInCategory.length === 1 ? 'article' : 'articles'}
                      </p>
                    </div>

                    {/* Articles Grid for this Category */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pagesInCategory.map((page) => (
                        <Link
                          key={page.path}
                          to={page.path}
                          className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                        >
                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                            {page.title}
                          </h3>

                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
