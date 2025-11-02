export default function ThemeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
      <h1 className="text-2xl font-semibold">Theme not found</h1>
      <p className="max-w-md text-center text-sm text-slate-400">
        Looks like this theme hasn't launched yet. Return to the homepage to see the experiences being built.
      </p>
    </div>
  );
}
