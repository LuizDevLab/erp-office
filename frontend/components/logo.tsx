import Image from "next/image";

export function Logo({ className }: { className?: string }) {
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
