import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * /api/ask in dev. Vite doesn't run the Vercel functions, so this hands the
 * request to the real handler when the keys are in .env.local, and otherwise
 * streams a canned answer so the inline UI can be worked on with no keys.
 */
function devAsk(): Plugin {
  const SAMPLE =
    'This is a stand-in answer so the layout can be judged before the real model is connected. Conner spent summer 2026 at Apple on the Screen Time team, and you can see more of his work at [fig](https://github.com/connergroth/fig) or email conner@lucence.so.';
  return {
    name: 'dev-ask',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''));
      server.middlewares.use('/api/ask', async (req, res) => {
        // A GET can't carry a body into Request(); answer it here like production does.
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end('{"code":"method"}');
        }
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const live =
          process.env.ANTHROPIC_API_KEY &&
          (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL);
        res.setHeader('Cache-Control', 'no-store');
        if (!live) {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          await new Promise((r) => setTimeout(r, 500));
          for (const w of SAMPLE.split(/(?<=\s)/)) {
            res.write(w);
            await new Promise((r) => setTimeout(r, 45));
          }
          return res.end();
        }
        const mod = await server.ssrLoadModule('/api/ask.ts');
        const out: Response = await mod.default(
          new Request(`http://${req.headers.host}/api/ask`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: Buffer.concat(chunks),
          })
        );
        res.statusCode = out.status;
        out.headers.forEach((v, k) => res.setHeader(k, v));
        if (out.body) {
          const reader = out.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        }
        res.end();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devAsk()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Force Rollup to use the JS implementation
      context: 'globalThis',
    }
  },
  optimizeDeps: {
    // Force Vite to use WASM version of Rollup
    needsInterop: ['rollup']
  }
});
