import { AppShell } from "@/components/layout/AppShell";
import { ProfileProvider } from "@/components/profile/ProfileProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <AppShell>{children}</AppShell>
    </ProfileProvider>
  );
}
