// Cliente fino para a API do Django (mesma origem, via proxy do Next).

export class ErroApi extends Error {
  readonly status: number;
  readonly dados: unknown;

  constructor(status: number, mensagem: string, dados?: unknown) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
    this.dados = dados;
  }
}

const METODOS_SEGUROS = new Set(["GET", "HEAD", "OPTIONS"]);

function lerCookie(nome: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const par = document.cookie.split("; ").find((item) => item.startsWith(`${nome}=`));
  return par ? decodeURIComponent(par.slice(nome.length + 1)) : undefined;
}

function extrairMensagem(dados: unknown): string | undefined {
  if (dados && typeof dados === "object" && "detail" in dados && typeof dados.detail === "string") {
    return dados.detail;
  }
  return undefined;
}

export async function api<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const metodo = (opcoes.method ?? "GET").toUpperCase();
  const headers = new Headers(opcoes.headers);
  headers.set("Accept", "application/json");
  if (opcoes.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!METODOS_SEGUROS.has(metodo)) {
    // O token é lido a cada chamada: o Django troca o token no login.
    const token = lerCookie("csrftoken");
    if (token) headers.set("X-CSRFToken", token);
  }

  const resposta = await fetch(caminho, {
    ...opcoes,
    method: metodo,
    headers,
    credentials: "same-origin",
  });

  if (resposta.status === 204) return undefined as T;

  const dados: unknown = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ErroApi(
      resposta.status,
      extrairMensagem(dados) ?? "Não foi possível concluir a operação.",
      dados,
    );
  }
  return dados as T;
}
