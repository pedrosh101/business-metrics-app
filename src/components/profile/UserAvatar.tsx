export const initials = (name: string) => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "?";
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};

export function UserAvatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-full bg-saffron font-bold text-pine ${className}`}>
      {initials(name)}
    </span>
  );
}
