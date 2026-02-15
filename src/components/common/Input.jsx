export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600/40 bg-white ${className}`}
      {...props}
    />
  );
}
