export default function ThemeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
      <h1 className="text-2xl font-semibold">主题未找到</h1>
      <p className="max-w-md text-center text-sm text-slate-400">
        看起来这个主题还没有上线，返回首页看看正在构建的体验吧。
      </p>
    </div>
  );
}
