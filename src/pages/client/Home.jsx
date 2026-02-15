import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/client/ProductCard";
import BlogCard from "../../components/client/BlogCard";
import { useProducts } from "../../services/productService";
import { useBlogs } from "../../services/blogService";

function SectionTitle({ kicker, title, desc }) {
    return (
        <div className="text-center">
            <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">{kicker}</div>
            <div className="mt-2 text-3xl md:text-4xl font-black">{title}</div>
            {desc ? <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{desc}</p> : null}
        </div>
    );
}

function Service({ title, desc }) {
    return (
        <div className="text-center px-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-700 text-white grid place-items-center font-black">✓</div>
            <div className="mt-4 text-sm font-extrabold uppercase tracking-widest">{title}</div>
            <div className="mt-2 text-sm text-slate-600">{desc}</div>
        </div>
    );
}

function CategoryTile({ title, subtitle, img, align = "bottom" }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white group">
            <img src={img} alt={title} className="h-56 w-full object-cover group-hover:scale-[1.03] transition duration-300" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
            <div className={`absolute ${align === "top" ? "top-5" : "bottom-5"} left-5`}>
                <div className="text-white text-xl font-black drop-shadow">{title}</div>
                {subtitle ? <div className="text-white/90 text-sm mt-1 drop-shadow">{subtitle}</div> : null}
                <Link
                    to="/shop"
                    className="inline-flex mt-3 rounded-full bg-emerald-700 text-white px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition"
                >
                    Shop now
                </Link>
            </div>
        </div>
    );
}

function HeroSlide({ img, title, subtitle }) {
    return (
        <div className="relative h-[72vh] min-h-[560px]">
            <img src={img} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative h-full mx-auto w-full max-w-6xl px-4 flex items-center">
                <div className="max-w-2xl text-white">
                    <div className="text-sm md:text-base font-semibold tracking-wide">{subtitle}</div>
                    <h1 className="mt-2 text-4xl md:text-6xl font-black leading-tight">{title}</h1>
                    <Link
                        to="/shop"
                        className="inline-flex mt-6 rounded-full bg-emerald-700 text-white px-7 py-3 text-xs md:text-sm font-black uppercase tracking-widest hover:bg-emerald-800 transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Countdown({ targetISO }) {
    const [ms, setMs] = useState(() => Math.max(0, new Date(targetISO).getTime() - Date.now()));

    useEffect(() => {
        const id = setInterval(() => {
            setMs(Math.max(0, new Date(targetISO).getTime() - Date.now()));
        }, 1000);
        return () => clearInterval(id);
    }, [targetISO]);

    const total = Math.floor(ms / 1000);
    const d = Math.floor(total / (3600 * 24));
    const h = Math.floor((total % (3600 * 24)) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    const Box = ({ label, value }) => (
        <div className="text-center">
            <div className="text-3xl font-black text-emerald-700">{String(value).padStart(2, "0")}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
        </div>
    );

    return (
        <div className="mt-6 flex items-center gap-6 justify-center">
            <Box label="Days" value={d} />
            <Box label="Hours" value={h} />
            <Box label="Minutes" value={m} />
            <Box label="Seconds" value={s} />
        </div>
    );
}

export default function Home() {
    const { data: products, loading: pLoading } = useProducts();
    const { data: blogs, loading: bLoading } = useBlogs();

    const featured = useMemo(() => (Array.isArray(products) ? products.slice(0, 8) : []), [products]);
    const latestBlogs = useMemo(() => {
        if (!Array.isArray(blogs)) return [];
        return [...blogs].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 3);
    }, [blogs]);

    const slides = useMemo(
        () => [
            {
                img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1900&q=80",
                subtitle: "We deliver organic vegetables & fruits",
                title: "We serve Fresh Vegestables & Fruits",
            },
            {
                img: "https://images.unsplash.com/photo-1506807803488-8eafc15323ce?auto=format&fit=crop&w=1900&q=80",
                subtitle: "We deliver organic vegetables & fruits",
                title: "100% Fresh & Organic Foods",
            },
        ],
        []
    );

    const [active, setActive] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setActive((v) => (v + 1) % slides.length), 5500);
        return () => clearInterval(id);
    }, [slides.length]);

    return (
        <main className="bg-white">
            {/* HERO SLIDER */}
            <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                    <HeroSlide {...slides[active]} />
                </motion.div>
            </AnimatePresence>

            {/* SERVICES */}
            <section className="py-12">
                <div className="mx-auto w-full max-w-6xl px-4 grid gap-8 md:grid-cols-4">
                    <Service title="Free Shipping" desc="On order over $100" />
                    <Service title="Always Fresh" desc="Product well package" />
                    <Service title="Superior Quality" desc="Quality Products" />
                    <Service title="Support" desc="24/7 Support" />
                </div>
            </section>

            {/* CATEGORIES (template vibe: 2 columns + middle promo feel) */}
            <section className="py-8">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="grid gap-4">
                            <CategoryTile
                                title="Vegetables"
                                subtitle="Protect the health of every home"
                                img="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=80"
                            />
                            <CategoryTile
                                title="Fruits"
                                subtitle=""
                                img="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1400&q=80"
                                align="top"
                            />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80"
                                alt="Organic"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/25" />
                            <div className="relative h-full min-h-[468px] grid place-items-center text-center p-8 text-white">
                                <div>
                                    <div className="text-xs font-black uppercase tracking-[0.35em] text-white/90">Organic Foods</div>
                                    <div className="mt-2 text-4xl font-black leading-tight">Fresh &amp; Healthy</div>
                                    <div className="mt-3 text-white/90">For your daily life</div>
                                    <Link
                                        to="/shop"
                                        className="inline-flex mt-6 rounded-full bg-emerald-700 text-white px-7 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition"
                                    >
                                        Shop now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <CategoryTile
                                title="Juices"
                                subtitle=""
                                img="https://images.unsplash.com/photo-1542444459-db47a4cc66d3?auto=format&fit=crop&w=1400&q=80"
                            />
                            <CategoryTile
                                title="Dried"
                                subtitle=""
                                img="https://images.unsplash.com/photo-1604908554162-769f8b510069?auto=format&fit=crop&w=1400&q=80"
                                align="top"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="py-14">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <SectionTitle
                        kicker="Featured Products"
                        title="Our Products"
                        desc="Far far away, behind the word mountains, far from the countries Vokalia and Consonantia"
                    />

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {pLoading
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
                            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </section>

            {/* DEAL OF THE DAY (template section) */}
            <section className="py-14 bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 grid gap-8 lg:grid-cols-2 items-center">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        <img
                            src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1600&q=80"
                            alt="Deal"
                            className="h-[420px] w-full object-cover"
                        />
                    </div>

                    <div className="text-center lg:text-left">
                        <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">Best Price For You</div>
                        <div className="mt-2 text-4xl font-black">Deal of the day</div>
                        <p className="mt-3 text-slate-600 max-w-xl lg:max-w-none">
                            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia
                        </p>
                        <div className="mt-5 text-2xl font-black">Spinach</div>
                        <div className="mt-2 text-slate-600">
                            <span className="font-black">$10</span> now <span className="font-black text-emerald-700">$5</span> only
                        </div>

                        <Countdown targetISO={new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString()} />

                        <div className="mt-7 flex justify-center lg:justify-start">
                            <Link
                                to="/shop"
                                className="inline-flex rounded-full bg-emerald-700 text-white px-7 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONY */}
            <section className="py-14">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <SectionTitle
                        kicker="Testimony"
                        title="Our satisfied customer says"
                        desc="Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
                    />

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {[
                            { name: "Garreth Smith", role: "Marketing Manager" },
                            { name: "Garreth Smith", role: "UI Designer" },
                            { name: "Garreth Smith", role: "Web Developer" },
                        ].map((t, i) => (
                            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                                <p className="text-slate-600 leading-relaxed">
                                    Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
                                </p>
                                <div className="mt-5 font-black">{t.name}</div>
                                <div className="text-sm text-slate-500">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="py-14 bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 grid gap-6 md:grid-cols-[1fr_420px] items-center">
                        <div>
                            <div className="text-2xl font-black">Subcribe to our Newsletter</div>
                            <div className="mt-2 text-slate-600">Get e-mail updates about our latest shops and special offers</div>
                        </div>

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex gap-2 bg-slate-50 border border-slate-200 rounded-full p-2"
                        >
                            <input
                                className="flex-1 bg-transparent px-4 outline-none text-sm"
                                placeholder="Enter email address"
                                aria-label="Email"
                            />
                            <button
                                type="submit"
                                className="rounded-full bg-emerald-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* BLOG PREVIEW */}
            <section className="py-14">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <SectionTitle kicker="Blog" title="Recent Blog" desc="Read our newest posts" />
                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {bLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                                    <div className="h-56 bg-slate-200/70" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 w-2/3 bg-slate-200/70 rounded" />
                                        <div className="h-4 w-1/3 bg-slate-200/70 rounded" />
                                        <div className="h-10 w-full bg-slate-200/70 rounded" />
                                    </div>
                                </div>
                            ))
                            : latestBlogs.map((b) => <BlogCard key={b.id} post={b} />)}
                    </div>
                </div>
            </section>
        </main>
    );
}
