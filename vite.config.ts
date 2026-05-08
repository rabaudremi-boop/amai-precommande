import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On GitHub Pages, the site lives under /<repo-name>/.
// The Actions workflow sets VITE_BASE accordingly; locally we keep "/".
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
  },
});
