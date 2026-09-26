import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' || isPreview ? '/cardback/' : '/',
}));
