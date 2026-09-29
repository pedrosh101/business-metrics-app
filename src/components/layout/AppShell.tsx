"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SETTINGS } from "../../lib/navigation";

const link = (active: boolean) =>
  `block rounded-md px-3 py-2 text-sm transition-colors ${
    active ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:text-white"
  }`;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="hidden flex-col justify-between bg-pine p-4 lg:flex lg:sticky lg:top-0 lg:h-screen">
        <div>
          <div className="mb-8 px-3 pt-2 text-lg font-bold tracking-tight text-white">
            Kipia<span className="text-saffron mx-0.5">.</span>
          </div>
          <nav aria-label="Main" className="space-y-1">
            {NAV.map((i) => (
              <Link key={i.href} href={i.href} className={link(path === i.href)} aria-current={path === i.href ? "page" : undefined}>
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href={SETTINGS.href} className={link(path === SETTINGS.href)}>{SETTINGS.label}</Link>
      </aside>

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 lg:px-10 lg:pb-12">{children}</main>

      {/* Mobile: the four most-used destinations only */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-line bg-surface lg:hidden">
        {NAV.slice(0, 4).map((i) => (
          <Link key={i.href} href={i.href} aria-current={path === i.href ? "page" : undefined}
            className={`py-3.5 text-center text-xs ${path === i.href ? "font-bold text-pine" : "text-muted"}`}>
            {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
