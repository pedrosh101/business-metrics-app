import { EmptyState } from "./States";
export function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <EmptyState title={`${title} is next in the build`} body={body} />
    </div>
  );
}
