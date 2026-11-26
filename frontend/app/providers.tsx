"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ErroApi } from "@/lib/api";

function criarQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Erros 4xx (sem permissão, não encontrado…) não melhoram com nova tentativa.
        retry: (tentativas, erro) =>
          !(erro instanceof ErroApi && erro.status < 500) && tentativas < 2,
      },
    },
  });
}

let queryClientDoNavegador: QueryClient | undefined;

function obterQueryClient() {
  // No servidor, um client por renderização; no navegador, um só para preservar o cache.
  if (typeof window === "undefined") return criarQueryClient();
  queryClientDoNavegador ??= criarQueryClient();
  return queryClientDoNavegador;
}

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={obterQueryClient()}>{children}</QueryClientProvider>;
}
