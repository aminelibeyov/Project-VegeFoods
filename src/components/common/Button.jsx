export default function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest transition disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-emerald-700 text-white hover:bg-emerald-800"
      : variant === "outline"
      ? "border border-slate-200 bg-white hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
