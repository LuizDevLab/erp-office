import { NextResponse, type NextRequest } from "next/server";

/**
 * Proteção de rotas otimista: só confere se existe o cookie de sessão do Django.
 * A validação real é do backend (/api/auth/me/, ver components/guarda-sessao.tsx).
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has("sessionid")) return NextResponse.next();

  const login = new URL("/login", request.url);
  const destino = request.nextUrl.pathname + request.nextUrl.search;
  if (destino !== "/") login.searchParams.set("next", destino);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    // Tudo, menos: login, rotas do Django (proxy em next.config.ts), internos do Next
    // e arquivos com extensão (logo, favicon…).
    "/((?!login|api|admin|django-static|_next|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
