"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { api, ErroApi } from "@/lib/api";

export type Papel = "colaborador" | "gestor";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
  cargo: string;
};

export type DadosLogin = {
  email: string;
  senha: string;
};

const CHAVE_USUARIO = ["auth", "me"] as const;

export function useUsuario() {
  return useQuery({
    queryKey: CHAVE_USUARIO,
    queryFn: () => api<Usuario>("/api/auth/me/"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function sessaoExpirada(erro: unknown): boolean {
  return erro instanceof ErroApi && (erro.status === 401 || erro.status === 403);
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dados: DadosLogin) => {
      // Garante o cookie CSRF antes do POST (D25).
      await api<void>("/api/auth/csrf/");
      return api<Usuario>("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify(dados),
      });
    },
    onSuccess: (usuario) => {
      queryClient.setQueryData(CHAVE_USUARIO, usuario);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => api<void>("/api/auth/logout/", { method: "POST" }),
    onSettled: () => {
      queryClient.clear();
      router.replace("/login");
    },
  });
}

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? "";
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
