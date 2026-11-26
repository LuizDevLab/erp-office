"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { sessaoExpirada, useUsuario } from "@/lib/auth";

/**
 * Checagem real da sessão. O proxy.ts só confere se o cookie existe; aqui, se o
 * Django disser que a sessão não vale mais (expirou após 10h, D24), volta ao login.
 */
export function GuardaSessao() {
  const { error } = useUsuario();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (sessaoExpirada(error)) {
      const destino = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${destino}`);
    }
  }, [error, pathname, router]);

  return null;
}
