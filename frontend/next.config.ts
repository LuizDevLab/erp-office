import type { NextConfig } from "next";

// Para onde o proxy encaminha /api, /admin e os estáticos do Django (D7).
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

// Prefixos atendidos pelo Django. As URLs do Django terminam em "/" (APPEND_SLASH),
// por isso a barra final é preservada na reescrita.
const prefixosDjango = ["api", "admin", "django-static"];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Sem isso o Next redireciona "/api/health/" para "/api/health" e o Django devolve
  // para a versão com barra, gerando loop.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return prefixosDjango.flatMap((prefixo) => [
      { source: `/${prefixo}/:path*/`, destination: `${backendUrl}/${prefixo}/:path*/` },
      { source: `/${prefixo}/:path*`, destination: `${backendUrl}/${prefixo}/:path*` },
    ]);
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
