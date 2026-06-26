import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://suri-firuvet-ios-damii-api.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/soap': {
        target: 'https://suri-firuvet-api-soap.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@routers':path.resolve(__dirname,'src/routers'),
      '@styles':path.resolve(__dirname,'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@appTypes': path.resolve(__dirname, 'src/@types'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@config': path.resolve(__dirname, 'src/config'),

    }
  }
})
