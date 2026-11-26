"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErroApi } from "@/lib/api";
import { useLogin } from "@/lib/auth";

const esquema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail.").pipe(z.email("Informe um e-mail válido.")),
  senha: z.string().min(1, "Informe a senha."),
});

/** Só aceita caminhos internos, para não virar redirecionamento aberto. */
function destinoSeguro(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  return next;
}

function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroApi) {
    if (erro.status === 400) return erro.message;
    if (erro.status === 403) return "Sessão de segurança expirada. Recarregue a página e tente de novo.";
  }
  return "Não foi possível conectar ao servidor. Tente de novo em instantes.";
}

const campo =
  "mt-1 block h-11 w-full rounded-md border border-borda bg-superficie px-3 text-texto outline-none focus:border-ouro-texto focus:ring-2 focus:ring-ouro/40 aria-invalid:border-atrasada-texto";

export function FormularioLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquema) });

  const aoEnviar = handleSubmit((dados) => {
    login.mutate(dados, {
      onSuccess: () => router.replace(destinoSeguro(searchParams.get("next"))),
    });
  });

  return (
    <form onSubmit={aoEnviar} noValidate className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-texto">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          autoFocus
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-erro" : undefined}
          className={campo}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-erro" className="mt-1 text-sm text-atrasada-texto">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-texto">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.senha ? true : undefined}
          aria-describedby={errors.senha ? "senha-erro" : undefined}
          className={campo}
          {...register("senha")}
        />
        {errors.senha && (
          <p id="senha-erro" className="mt-1 text-sm text-atrasada-texto">
            {errors.senha.message}
          </p>
        )}
      </div>

      {login.isError && (
        <p role="alert" className="rounded-md bg-atrasada-fundo px-3 py-2 text-sm text-atrasada-texto">
          {mensagemDeErro(login.error)}
        </p>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-grafite px-4 font-medium text-white hover:bg-preto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ouro disabled:opacity-60"
      >
        {login.isPending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
