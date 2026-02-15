import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlogs, useBlog } from "../../services/blogService";
import BlogCard from "../../components/client/BlogCard";

function Header({ title, crumbs }) {
    return (
        <section className="relative h-56">
            <img
                alt="header"
                src="https://images.unsplash.com/photo-1506807803488-8eafc15323ce?auto=format&fit=crop&w=1900&q=80"
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

export default function Blogs({ mode }) {
    const params = useParams();
    const isDetail = mode === "detail" && params.id;

    const list = useBlogs();
    const one = useBlog(params.id);

    const data = list.data;
    const post = one.data;

    const sorted = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return [...data].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }, [data]);

    if (isDetail) {
        if (one.loading) {
            return (
                <main className="bg-white">
                    <Header title="Blog Detail" crumbs="Home / Blog / Detail" />
                    <div className="mx-auto w-full max-w-3xl px-4 py-12">
                        <div className="h-64 bg-slate-200/70 rounded-2xl animate-pulse" />
                        <div className="mt-6 h-8 w-2/3 bg-slate-200/70 rounded animate-pulse" />
                        <div className="mt-4 h-24 w-full bg-slate-200/70 rounded animate-pulse" />
                    </div>
                </main>
            );
        }

        return (
            <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
                <Header title="Blog Detail" crumbs="Home / Blog / Detail" />
                <div className="mx-auto w-full max-w-3xl px-4 py-12">
                    <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-2xl border border-slate-200" />
                    <div className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-slate-500">{post.date}</div>
                    <h1 className="mt-2 text-4xl font-black">{post.title}</h1>
                    <p className="mt-6 text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>

                    <div className="mt-10">
                        <Link
                            to="/blog"
                            className="inline-flex rounded-full border border-slate-200 bg-white px-7 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                        >
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </motion.main>
        );
    }

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
            <Header title="Blog" crumbs="Home / Blog" />

            <section className="py-12">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        {list.loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                                    <div className="h-56 bg-slate-200/70" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 w-2/3 bg-slate-200/70 rounded" />
                                        <div className="h-4 w-1/3 bg-slate-200/70 rounded" />
                                        <div className="h-10 w-full bg-slate-200/70 rounded" />
                                    </div>
                                </div>
                            ))
                            : sorted.map((p) => <BlogCard key={p.id} post={p} />)}
                    </div>
                </div>
            </section>
        </motion.main>
    );
}
