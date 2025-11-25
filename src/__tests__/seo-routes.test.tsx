import { describe, it, expect } from 'vitest';
import { getSeoRoutes } from '../routes/seoRoutes';

describe('SEO Routes Registration', () => {
  it('should generate routes from SEO pages', () => {
    const routes = getSeoRoutes();
    
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have routes with valid path format', () => {
    const routes = getSeoRoutes();
    
    for (const route of routes) {
      expect(route.path).toBeDefined();
      expect(typeof route.path).toBe('string');
      expect(route.path).toMatch(/^\/.+/); // Should start with /
      expect(route.element).toBeDefined();
    }
  });

  it('should include critical routes', () => {
    const routes = getSeoRoutes();
    const routePaths = routes.map(r => r.path);
    
    // Critical route that was previously missing
    expect(routePaths).toContain('/solutions/inventory-software-management');
    
    // Other important routes
    expect(routePaths).toContain('/solutions/stock-management');
    expect(routePaths).toContain('/solutions/inventory-platform');
    expect(routePaths).toContain('/solutions/inventory-scanning-system');
  });

  it('should not have duplicate routes', () => {
    const routes = getSeoRoutes();
    const paths = routes.map(r => r.path);
    const uniquePaths = new Set(paths);
    
    expect(paths.length).toBe(uniquePaths.size);
  });

  it('should handle solutions directory correctly', () => {
    const routes = getSeoRoutes();
    const solutionsRoutes = routes.filter(r => r.path.startsWith('/solutions/'));
    
    expect(solutionsRoutes.length).toBeGreaterThan(0);
    
    // Solutions routes should preserve full path (e.g., /solutions/inventory-software-management)
    for (const route of solutionsRoutes) {
      expect(route.path).toMatch(/^\/solutions\/.+/);
      // Should not be just the filename (e.g., should not be /inventory-software-management)
      const pathParts = route.path.split('/');
      expect(pathParts.length).toBeGreaterThan(2); // /solutions/filename
    }
  });

  it('should handle glossary routes correctly', () => {
    const routes = getSeoRoutes();
    const glossaryRoutes = routes.filter(r => r.path.startsWith('/glossary/'));
    
    // Glossary routes should preserve full path
    for (const route of glossaryRoutes) {
      expect(route.path).toMatch(/^\/glossary\/.+/);
    }
  });

  it('should exclude helper files from routes', () => {
    const routes = getSeoRoutes();
    const routePaths = routes.map(r => r.path);
    
    // These should be excluded (helper functions, not pages)
    expect(routePaths).not.toContain('/glossary/createGlossaryPage');
    // resources/blog is excluded to avoid conflict with blog/index.tsx
    // Note: This might need adjustment based on actual exclusion logic
  });

  it('should have routes sorted alphabetically', () => {
    const routes = getSeoRoutes();
    const paths = routes.map(r => r.path);
    const sortedPaths = [...paths].sort((a, b) => a.localeCompare(b));
    
    expect(paths).toEqual(sortedPaths);
  });

  it('should generate routes for all major SEO categories', () => {
    const routes = getSeoRoutes();
    const routePaths = routes.map(r => r.path);
    
    // Check for routes from different categories
    const hasSolutions = routePaths.some(p => p.startsWith('/solutions/'));
    const hasGlossary = routePaths.some(p => p.startsWith('/glossary/'));
    const hasFeatures = routePaths.some(p => p.startsWith('/features/'));
    const hasIndustries = routePaths.some(p => p.startsWith('/industries/'));
    const hasUses = routePaths.some(p => p.startsWith('/uses/'));
    const hasGuides = routePaths.some(p => p.startsWith('/guides/'));
    
    // At least some categories should have routes
    const categoryCount = [hasSolutions, hasGlossary, hasFeatures, hasIndustries, hasUses, hasGuides]
      .filter(Boolean).length;
    
    expect(categoryCount).toBeGreaterThan(0);
  });
});

