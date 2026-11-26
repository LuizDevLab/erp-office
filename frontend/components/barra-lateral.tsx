"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const botaoIcone =
  "inline-flex size-11 items-center justify-center rounded-md text-ouro-claro hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-ouro-claro";

function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-ta.png"
      alt="T&A Contabilidade e Consultoria Tributária"
      width={2170}
      height={725}
      loading="eager"
      className={className}
    />
  );
}

export function BarraLateral() {
  const [aberta, setAberta] = useState(false);

  useEffect(() => {
    if (!aberta) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberta(false);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberta]);

  return (
    <>
      {/* Topo em telas estreitas */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-preto px-4 py-2 md:hidden">
        <Logo className="h-10 w-auto" />
        <button
          type="button"
          onClick={() => setAberta(true)}
          aria-label="Abrir menu"
          aria-expanded={aberta}
          aria-controls="barra-lateral"
          className={botaoIcone}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {aberta && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setAberta(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="barra-lateral"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-preto transition-transform md:visible md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          aberta ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-6">
          <Logo className="h-auto w-full max-w-52" />
          <button
            type="button"
            onClick={() => setAberta(false)}
            aria-label="Fechar menu"
            className={`${botaoIcone} md:hidden`}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Os itens de navegação entram junto com as telas, nas próximas fases */}
        <nav aria-label="Navegação principal" className="flex-1 px-3" />
      </aside>
    </>
  );
}
