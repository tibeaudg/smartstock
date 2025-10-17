import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

  build: {
    // Optimize bundle size with better chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // UI libraries
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
          ],
          // Data and state management
          'data-vendor': [
            '@tanstack/react-query',
            '@tanstack/query-sync-storage-persister',
            '@tanstack/react-query-persist-client',
            '@supabase/supabase-js',
          ],
          // Form and validation
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          // Charts and visualization
          'chart-vendor': [
            'recharts',
            'react-simple-maps',
          ],
          // Other large libraries
          'utils-vendor': [
            'framer-motion',
            'date-fns',
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'lucide-react',
            'sonner',
            'vaul',
            'cmdk',
            'input-otp',
            'qrcode.react',
            'react-qr-code',
            'react-day-picker',
            'react-resizable-panels',
            'embla-carousel-react',
            'xlsx',
            '@zxing/library',
          ],
        },
      },
    },
    
    // Enable modern build features
    target: 'es2020',
    minify: 'esbuild', // Faster than terser
    esbuildOptions: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    
    // Disable source maps in production to reduce size
    sourcemap: false,
    
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
    
    // Reduce asset inlining threshold for better caching
    assetsInlineLimit: 4096,
    
    // Chunk size warning
    chunkSizeWarningLimit: 800,
    
    // Enable module preloading for better performance
    modulePreload: {
      polyfill: true,
    },
    
    // Enable reportCompressedSize for build analysis
    reportCompressedSize: true,
  },

  // ESBuild configuration for optimal builds
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true,
  },
  
  // Performance optimizations
  experimental: {
    renderBuiltUrl(filename) {
      // Use CDN for static assets if configured
      return filename;
    },
  },
}));


