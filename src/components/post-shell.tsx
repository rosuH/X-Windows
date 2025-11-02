import type { ReactNode } from "react";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0.5C5.648 0.5 0.5 5.648 0.5 12C0.5 17.303 4.035 21.794 8.839 23.25C9.439 23.358 9.667 22.99 9.667 22.676C9.667 22.397 9.656 21.631 9.651 20.676C6.297 21.402 5.593 19.095 5.593 19.095C5.047 17.739 4.259 17.373 4.259 17.373C3.171 16.632 4.342 16.646 4.342 16.646C5.547 16.731 6.172 17.889 6.172 17.889C7.247 19.735 8.985 19.206 9.646 18.908C9.754 18.134 10.06 17.606 10.4 17.314C7.57 17.019 4.594 15.98 4.594 11.385C4.594 10.079 5.062 9.019 5.83 8.197C5.709 7.902 5.3 6.665 5.94 5.053C5.94 5.053 6.939 4.741 9.64 6.49C10.576 6.232 11.576 6.103 12.576 6.098C13.576 6.103 14.576 6.232 15.512 6.49C18.213 4.741 19.212 5.053 19.212 5.053C19.852 6.665 19.443 7.902 19.322 8.197C20.09 9.019 20.558 10.079 20.558 11.385C20.558 15.994 17.576 17.016 14.736 17.306C15.16 17.674 15.542 18.423 15.542 19.563C15.542 21.145 15.526 22.303 15.526 22.676C15.526 22.991 15.75 23.363 16.359 23.249C21.166 21.791 24.699 17.303 24.699 12C24.699 5.648 19.551 0.5 13.199 0.5H12Z" />
    </svg>
  );
}

interface PostShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function PostShell({ sidebar, children }: PostShellProps) {
  return (
    <div className="min-h-screen w-full bg-slate-950/95 py-3 text-slate-100 sm:py-6">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 px-3 sm:gap-6 sm:px-4">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:rounded-3xl sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-semibold text-slate-900 sm:h-12 sm:w-12">
              <span className="text-sm sm:text-base">XW</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 sm:gap-2 sm:text-sm">
                <span className="font-semibold text-slate-100">X-Windows</span>
                <span>@x_windows</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">In development</span>
                <span className="sm:hidden">· Dev</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                View source code directly in X's post detail page. Experience SwiftUI and Compose code viewers, explore decompile pipelines from source to IR and bytecode, all within the native app interface.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 sm:gap-6 sm:text-sm">
                <span>
                  <span className="font-semibold text-slate-100">∞</span> Views
                </span>
                <a
                  href="https://github.com/rosuH/X-Windows"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  aria-label="View on GitHub"
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </header>
        <section className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/70 p-3 backdrop-blur-xl sm:rounded-3xl sm:p-4">
            {sidebar}
          </aside>
          <main className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/70 p-3 backdrop-blur-xl sm:rounded-3xl sm:p-4">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}
