import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // 👇 DEZE regel zorgt dat alle routes fallbacken naar index.html
    historyApiFallback: true,
    // Proxy API requests to the dev server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react({
      // Ensure proper React handling in production
      jsxRuntime: 'automatic',
    }),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            // Put ALL vendor libraries in a single chunk to avoid race conditions
            // This ensures React and all dependencies load together
            return 'vendor';
          }
          
          // Split large page components
          if (id.includes('/pages/SEO/') || id.includes('/pages/blog/')) {
            return 'pages-seo';
          }
          
          // Split admin components
          if (id.includes('/components/admin/') || id.includes('/pages/admin')) {
            return 'admin';
          }
          
          // Split analytics components
          if (id.includes('/components/analytics/')) {
            return 'analytics';
          }
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Enable modern build features
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug', 'console.trace'] : [],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    // Generate source maps for better debugging
    sourcemap: mode === 'development' ? true : 'hidden',
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    // Improve chunk size warnings (increased due to large app, but chunks are split)
    chunkSizeWarningLimit: 1500,
    // Enable module preloading
    modulePreload: {
      polyfill: true,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env'],
    force: true, // Force re-optimization
  },
  // Performance optimizations
  experimental: {
    renderBuiltUrl(filename: string) {
      // Use CDN for production assets (if applicable)
      return { relative: true };
    },
  },
  // Performance optimizations
  esbuild: {
    target: 'esnext',
  },
}));