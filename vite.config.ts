import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      // 代理1：处理/auth开头的认证接口
      '/auth': {
        target: 'http://localhost:11451',
        changeOrigin: true,
      },
      // 代理2：处理/api开头的数据接口
      '/api': {
        target: 'http://localhost:11451',
        changeOrigin: true,
      }
    }
  }
})