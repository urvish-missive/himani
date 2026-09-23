import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Serves the Vercel Functions in /api during `npm run dev`, so server-only
 * features (like AI blog drafting) work locally the same way as on Vercel.
 */
function devApi(env: Record<string, string>): Plugin {
  const routes: Record<string, string> = {
    '/api/generate-post': '/api/generate-post.ts',
  };
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0] ?? '';
        const file = routes[path];
        if (!file) return next();
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: {
              'content-type': String(req.headers['content-type'] ?? ''),
              authorization: String(req.headers.authorization ?? ''),
            },
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
          });
          const mod = await server.ssrLoadModule(file);
          const response: Response = await mod.handleGeneratePost(request, { ...process.env, ...env });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.config.logger.error(`[dev-api] ${path}: ${err instanceof Error ? err.stack : err}`);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Local API error. Check the terminal.' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  // Load every .env value (not just VITE_*) for the local API; never exposed to the browser.
  plugins: [react(), tailwindcss(), devApi(loadEnv(mode, process.cwd(), ''))],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
}))
