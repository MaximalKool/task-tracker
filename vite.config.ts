import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` must match the GitHub Pages repo path so built asset URLs resolve.
export default defineConfig({
  base: '/task-tracker/',
  plugins: [react()],
});
