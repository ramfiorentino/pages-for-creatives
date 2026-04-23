import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'

export default defineConfig({
  root: '.',
  base: '/pages-for-creatives/',
  appType: 'spa',
  plugins: [{
    name: 'copy-404',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    }
  }]
})
