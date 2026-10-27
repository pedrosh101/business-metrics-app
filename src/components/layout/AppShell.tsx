"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ellipsis, User } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProfileSheet } from "@/components/profile/ProfileSheet";
import { useProfile } from "@/components/profile/ProfileProvider";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { MOBILE_MORE, MOBILE_PRIMARY, NAV, SETTINGS, type NavItem } from "@/lib/navigation";

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

function SidebarLink({ item, path }: { item: NavItem; path: string }) {
  const active = isActive(path, item.href);
  return (
    <Link href={item.href} aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:text-white"}`}>
      <item.icon className="size-4" /> {item.label}
    </Link>
  );
}

const tab = "group relative flex w-full flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium outline-offset-2 focus-visible:outline-saffron";

function Pill({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${active ? "bg-white/15 text-white" : "text-white/60 group-active:bg-white/10"}`}>
      {children}
    </span>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { profile } = useProfile();
  const [more, setMore] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const moreActive = MOBILE_MORE.some((i) => isActive(path, i.href));

  return (
    <div className="min-h-dvh overflow-x-clip lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="hidden flex-col justify-between bg-pine p-4 lg:flex lg:sticky lg:top-0 lg:h-dvh">
        <div>
          <Link href="/overview" aria-label="Kipia, go to Overview" className="mb-8 block px-3 pt-2 text-lg font-bold tracking-tight text-white">
            Kipia<span className="text-saffron">.</span>
          </Link>
          <nav aria-label="Main" className="space-y-1">{NAV.map((i) => <SidebarLink key={i.href} item={i} path={path} />)}</nav>
        </div>
        <div className="space-y-1">
          <SidebarLink item={SETTINGS} path={path} />
          <button type="button" onClick={() => setProfileOpen(true)} aria-haspopup="dialog"
            className="mt-2 flex w-full items-center gap-3 rounded-md border-t border-white/10 px-3 pb-2 pt-4 text-left text-white transition-colors hover:bg-white/10">
            <UserAvatar name={profile?.fullName ?? "?"} className="size-9 text-sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{profile?.fullName ?? "Your profile"}</span>
              <span className="block truncate text-xs text-white/60">{profile?.email ?? "View and edit"}</span>
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile header: brand on the left, profile on the right */}
      <header className="flex items-center justify-between px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] sm:px-5 lg:hidden">
        <Link href="/overview" aria-label="Kipia, go to Overview" className="text-lg font-bold tracking-tight text-pine">
          Kipia<span className="text-saffron">.</span>
        </Link>
        <button type="button" onClick={() => setProfileOpen(true)} aria-label="Open your profile" aria-haspopup="dialog"
          className="flex size-10 items-center justify-center rounded-full bg-pine text-white shadow-sm transition-colors active:bg-pine-soft">
          <User className="size-5" />
        </button>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-28 pt-2 sm:px-5 lg:px-10 lg:pb-12 lg:pt-8">{children}</main>

      <nav aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 transform-gpu border-t border-white/10 bg-pine pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,61,58,0.25)] lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5 gap-1 px-2 pb-1.5 pt-2">
          {MOBILE_PRIMARY.map((i) => {
            const active = isActive(path, i.href);
            return (
              <li key={i.href}>
                <Link href={i.href} aria-current={active ? "page" : undefined} className={tab}>
                  {active && <span aria-hidden className="absolute -top-2 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-saffron" />}
                  <Pill active={active}><i.icon className="size-5" /></Pill>
                  <span className={active ? "text-white" : "text-white/60"}>{i.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setMore(true)} aria-haspopup="dialog" className={tab}>
              {moreActive && <span aria-hidden className="absolute -top-2 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-saffron" />}
              <Pill active={moreActive}><Ellipsis className="size-5" /></Pill>
              <span className={moreActive ? "text-white" : "text-white/60"}>More</span>
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)] lg:hidden">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
            <SheetDescription className="sr-only">Other sections of the app</SheetDescription>
          </SheetHeader>
          <ul className="grid grid-cols-3 gap-3 px-4 pb-4">
            {MOBILE_MORE.map((i) => {
              const active = isActive(path, i.href);
              return (
                <li key={i.href}>
                  <Link href={i.href} onClick={() => setMore(false)} aria-current={active ? "page" : undefined}
                    className={`flex flex-col items-center gap-2 rounded-xl py-4 text-sm font-medium transition-colors ${active ? "bg-pine text-white" : "bg-muted text-foreground active:bg-muted/70"}`}>
                    <i.icon className="size-5" /> {i.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>

      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
