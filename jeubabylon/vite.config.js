// base: './', // C'est CA qui change tout !
//}

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  optimizeDeps: {
    include: ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/gui'],
  },
  build: {
    target: 'esnext', // permet de supporter les modules modernes de Babylon
  },
})