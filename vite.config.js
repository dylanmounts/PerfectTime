import copy from 'rollup-plugin-copy';

const path = require('path')

export default {
  plugins: [
    copy({
      targets: [
        { src: 'src/assets/fonts/*', dest: 'dist/fonts' }
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
  },
  server: {
    port: 8080
  }
}
