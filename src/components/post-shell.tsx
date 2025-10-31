import type { ReactNode } from "react";

interface PostShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function PostShell({ sidebar, children }: PostShellProps) {
  return (
    <div className="min-h-screen w-full bg-slate-950/95 py-6 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <header className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-semibold text-slate-900">
              XW
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="font-semibold text-slate-100">X-Windows</span>
                <span>@x_windows</span>
                <span>·</span>
                <span>构建中</span>
              </div>
              <p className="text-base leading-relaxed text-slate-200">
                在 X 的帖子详情页里嵌入一块“迷你 IDE”，无论是 SwiftUI、Compose 还是 Meme 动画，让人划过时瞬间打开另一个世界。
              </p>
              <div className="flex gap-6 text-sm text-slate-400">
                <span>
                  <span className="font-semibold text-slate-100">∞</span> 浏览
                </span>
                <span>
                  <span className="font-semibold text-slate-100">开源</span> 项目
                </span>
              </div>
            </div>
          </div>
        </header>
        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl">
            {sidebar}
          </aside>
          <main className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}
