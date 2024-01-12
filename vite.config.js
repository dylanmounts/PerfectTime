import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    plugins: [
      copy({
        targets: [
          { src: 'fonts/*', dest: 'dist/fonts' }
        ],
        hook: 'writeBundle'
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const directories = id.split('/');
              const name = directories[directories.lastIndexOf('node_modules') + 1];
              return name;
            }
          }
        }
      },
      chunkSizeWarningLimit: 600
    }
  });
