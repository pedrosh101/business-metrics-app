"use client";
import { createContext, useContext, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { getProfile, saveProfile } from "@/services/profile";
import type { Profile } from "@/lib/profile-types";

interface Ctx {
  profile?: Profile;
  status: "loading" | "success" | "error";
  refetch: () => void;
  save: (p: Profile) => Promise<void>;
}
const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { status, data, refetch } = useAsync(getProfile, "profile");
  const [saved, setSaved] = useState<Profile>();

  const save = async (p: Profile) => setSaved(await saveProfile(p));
  return <ProfileContext.Provider value={{ profile: saved ?? data, status, refetch, save }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
