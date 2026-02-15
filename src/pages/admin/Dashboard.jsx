import { motion } from "framer-motion";
import { useProducts } from "../../services/productService";
import { useBlogs } from "../../services/blogService";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">{label}</div>
      <div className="mt-3 text-4xl font-black text-emerald-700">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data: products, loading: pLoading } = useProducts();
  const { data: blogs, loading: bLoading } = useBlogs();

  const pCount = Array.isArray(products) ? products.length : 0;
  const bCount = Array.isArray(blogs) ? blogs.length : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">Overview</div>
        <div className="mt-2 text-2xl md:text-3xl font-black">Dashboard</div>
        <div className="mt-2 text-slate-600">Admin görünüşü client-dən tam ayrıdır.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Products" value={pLoading ? "…" : pCount} />
        <Stat label="Blog posts" value={bLoading ? "…" : bCount} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">How to open</div>
        <div className="mt-2 text-sm text-slate-700">
          Admin-ə keçid navbar-da yoxdur. URL ilə aç: <span className="font-black">/admin</span>
        </div>
      </div>
    </motion.div>
  );
}
