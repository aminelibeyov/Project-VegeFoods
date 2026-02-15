import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../components/client/ProductCard";
import { useProducts } from "../../services/productService";
import { useDebounce } from "../../services/productService"; // Əgər səndə useDebounce hook services-də deyilsə, aşağıdakı importu dəyiş: "../../hooks/useDebounce"
import { toast } from "react-toastify";

const CATS = ["All", "Vegetables", "Fruits", "Juice", "Dried"];

function PageHeader({ title, crumbs }) {
    return (
        <section className="relative h-56">
            <img
                alt="header"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1900&q=80"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative h-full mx-auto w-full max-w-6xl px-4 grid place-items-center text-center text-white">
                <div>
                    <div className="text-xs font-black uppercase tracking-[0.35em] text-white/85">{crumbs}</div>
                    <div className="mt-2 text-4xl font-black">{title}</div>
                </div>
            </div>
        </section>
    );
}

export default function Products() {
    const { data, loading, error, refetch } = useProducts();
    const [q, setQ] = useState("");
    const dq = useDebounce(q, 500);
    const [cat, setCat] = useState("All");
    const [sort, setSort] = useState("default");

    const list = useMemo(() => {
        const arr = Array.isArray(data) ? [...data] : [];
        const byCat = cat === "All" ? arr : arr.filter((p) => String(p.category).toLowerCase() === cat.toLowerCase());
        const byQuery = dq.trim()
            ? byCat.filter((p) => String(p.name).toLowerCase().includes(dq.trim().toLowerCase()))
            : byCat;

        if (sort === "price-asc") byQuery.sort((a, b) => (a.price - (a.price * (a.discount || 0)) / 100) - (b.price - (b.price * (b.discount || 0)) / 100));
        if (sort === "price-desc") byQuery.sort((a, b) => (b.price - (b.price * (b.discount || 0)) / 100) - (a.price - (a.price * (a.discount || 0)) / 100));
        if (sort === "name-az") byQuery.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        if (sort === "name-za") byQuery.sort((a, b) => String(b.name).localeCompare(String(a.name)));

        return byQuery;
    }, [data, dq, cat, sort]);

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
            <PageHeader title="Products" crumbs="Home / Shop" />

            <section className="py-10">
                <div className="mx-auto w-full max-w-6xl px-4">
                    {/* controls */}
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-start">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                {CATS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setCat(c)}
                                        className={`rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest border transition ${cat === c ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600/40"
                                />

                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="w-full md:w-64 rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600/40 bg-white"
                                >
                                    <option value="default">Default sorting</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name-az">Name: A - Z</option>
                                    <option value="name-za">Name: Z - A</option>
                                </select>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Result</div>
                            <div className="mt-2 text-3xl font-black text-emerald-700">{list.length}</div>
                            <button
                                type="button"
                                onClick={() => {
                                    setQ("");
                                    setCat("All");
                                    setSort("default");
                                    toast.info("Filters reset");
                                }}
                                className="mt-3 w-full rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* states */}
                    {error ? (
                        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
                            <div className="font-extrabold">Products yüklənmədi</div>
                            <div className="mt-1 text-slate-600">{error.message}</div>
                            <button
                                onClick={refetch}
                                className="mt-4 rounded-full bg-emerald-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-800"
                                type="button"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {loading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                                        <div className="h-56 bg-slate-200/70" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 w-2/3 bg-slate-200/70 rounded" />
                                            <div className="h-4 w-1/3 bg-slate-200/70 rounded" />
                                            <div className="h-10 w-full bg-slate-200/70 rounded" />
                                        </div>
                                    </div>
                                ))
                                : list.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>
        </motion.main>
    );
}
