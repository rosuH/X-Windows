import type { ReactNode } from "react";
import clsx from "clsx";

interface EditorChromeProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function EditorChrome({
  title,
  subtitle,
  accentColor,
  footer,
  children,
}: EditorChromeProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl shadow-slate-950/40">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {["bg-red-400", "bg-yellow-300", "bg-emerald-400"].map((dot) => (
              <span key={dot} className={clsx("h-2.5 w-2.5 rounded-full", dot)} />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-100">{title}</span>
            {subtitle ? <span className="text-xs text-slate-400">{subtitle}</span> : null}
          </div>
        </div>
        {accentColor ? (
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px]"
            style={{
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
        ) : null}
      </div>
      <div className="flex-1 overflow-auto bg-slate-950/50">{children}</div>
      {footer ? (
        <div className="border-t border-white/5 px-5 py-3 text-xs text-slate-400">{footer}</div>
      ) : null}
    </div>
  );
}
