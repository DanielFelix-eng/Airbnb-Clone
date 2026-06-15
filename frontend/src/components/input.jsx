export default function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative mb-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        {Icon ? <Icon className="h-5 w-5 text-emerald-500" /> : null}
      </div>
      <input
        {...props}
        className={`w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20 `}
      />
    </div>
  )
}