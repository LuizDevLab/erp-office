"use client";

import { primeiroNome, useUsuario } from "@/lib/auth";

function saudacaoDoHorario(hora: number): string {
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export function Saudacao() {
  const { data: usuario } = useUsuario();

  // O horário só é lido no navegador, depois que o usuário carregou.
  if (!usuario) {
    return <h1 className="h-8 text-2xl text-texto" aria-busy="true" />;
  }

  return (
    <h1 className="text-2xl text-texto">
      {saudacaoDoHorario(new Date().getHours())}, {primeiroNome(usuario.nome)}
    </h1>
  );
}
