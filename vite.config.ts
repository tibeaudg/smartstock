import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
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

  // vite.config.js
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },


  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Leave React and all React-dependent UI libraries in the main bundle
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('@radix-ui') ||
            id.includes('framer-motion') ||
            id.includes('lucide-react')
          ) {
            return; // do not split
          }
        
          // Other vendor chunking
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        
          // Page/component chunking
          if (id.includes('/pages/')) {
            return 'pages';
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
    chunkSizeWarningLimit: 2000,
    // Enable module preloading
    modulePreload: {
      polyfill: true,
    },
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