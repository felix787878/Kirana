export default function CvMakerLoading() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
      <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
