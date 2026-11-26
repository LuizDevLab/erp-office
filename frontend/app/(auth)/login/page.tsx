import type { Metadata } from "next";
import { Suspense } from "react";

import { Logo } from "@/components/logo";

import { FormularioLogin } from "./formulario-login";

export const metadata: Metadata = {
  title: "Entrar — ERP T&A",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-fundo px-4 py-10">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-borda bg-superficie shadow-sm">
        <div className="flex justify-center bg-preto px-6 py-6">
          <Logo className="h-auto w-full max-w-60" />
        </div>
        <div className="px-6 py-7">
          <h1 className="text-xl text-texto">Entrar</h1>
          <p className="mt-1 text-sm text-texto-suave">Gestão fiscal — use seu e-mail do escritório.</p>
          {/* useSearchParams (destino após o login) precisa de Suspense */}
          <Suspense fallback={<div className="mt-6 h-64" />}>
            <FormularioLogin />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
