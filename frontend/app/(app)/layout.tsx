import { BarraLateral } from "@/components/barra-lateral";
import { GuardaSessao } from "@/components/guarda-sessao";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen md:flex">
      <GuardaSessao />
      <BarraLateral />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
