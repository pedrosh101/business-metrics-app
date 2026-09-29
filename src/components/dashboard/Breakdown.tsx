import type { ChannelShare } from "../../lib/types";

export function ChannelBreakdown({ channels }: { channels: ChannelShare[] }) {
  return (
    <ul className="space-y-4">
      {channels.map((c) => (
        <li key={c.id}>
          <div className="flex justify-between text-sm"><span>{c.name}</span><span className="font-semibold">{c.share}%</span></div>
          <div className="mt-1.5 h-2 rounded-full bg-line">
            <div className="h-2 rounded-full bg-pine" style={{ width: `${c.share}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
