import type { Profile } from "@/lib/profile-types";

let stored: Profile = {
  fullName: "Pedro Lima",
  email: "pedrolima@kipia.com",
  jobTitle: "Owner",
  phone: "+55 12 98162-2637",
};

export async function getProfile(): Promise<Profile> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...stored };
}
export async function saveProfile(next: Profile): Promise<Profile> {
  await new Promise((r) => setTimeout(r, 600));
  stored = { ...next };
  return { ...stored };
}
