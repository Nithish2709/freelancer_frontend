import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        proxy: {
            '/api': 'https://freelancer-backend-xp3g.onrender.com'
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.js',
        css: false
    }
})
