import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProduct, useProducts } from "../../services/productService";
import { finalPrice, formatMoney } from "../../constants/api";
import { useBasket } from "../../context/BasketContext";
import ProductCard from "../../components/client/ProductCard";
import { toast } from "react-toastify";

function Header() {
    return (
        <section className="relative h-56">
            <img
                alt="header"
                src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1900&q=80"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative h-full mx-auto w-full max-w-6xl px-4 grid place-items-center text-center text-white">
                <div>
                    <div className="text-xs font-black uppercase tracking-[0.35em] text-white/85">Home / Product / Product Single</div>
                    <div className="mt-2 text-4xl font-black">Product Single</div>
                </div>
            </div>
        </section>
    );
}

export default function ProductDetail() {
    const { id } = useParams();
    const { data: product, loading, error, refetch } = useProduct(id);
    const { data: all } = useProducts();
    const { addToBasket } = useBasket();
    const [qty, setQty] = useState(1);

    const related = useMemo(() => {
        if (!product || !Array.isArray(all)) return [];
        return all.filter((p) => p.id !== product.id && String(p.category) === String(product.category)).slice(0, 4);
    }, [product, all]);

    if (loading) {
        return (
            <main className="bg-white">
                <Header />
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="h-[440px] rounded-2xl bg-slate-200/70 animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 w-2/3 bg-slate-200/70 rounded animate-pulse" />
                            <div className="h-6 w-1/3 bg-slate-200/70 rounded animate-pulse" />
                            <div className="h-32 w-full bg-slate-200/70 rounded animate-pulse" />
                            <div className="h-12 w-1/2 bg-slate-200/70 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-white">
                <Header />
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <div className="rounded-2xl border border-slate-200 p-6">
                        <div className="font-extrabold">Product yüklənmədi</div>
                        <div className="mt-1 text-slate-600">{error.message}</div>
                        <button
                            onClick={refetch}
                            className="mt-4 rounded-full bg-emerald-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-800"
                            type="button"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const fp = finalPrice(product.price, product.discount);

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
            <Header />

            <section className="py-12">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-2 items-start">
                        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-[520px] w-full object-cover" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-black">{product.name}</h2>

                            <div className="mt-4 flex items-end gap-3">
                                {Number(product.discount) > 0 ? <div className="text-lg text-slate-400 line-through">{formatMoney(product.price)}</div> : null}
                                <div className="text-3xl font-black text-emerald-700">{formatMoney(fp)}</div>
                            </div>

                            <p className="mt-5 text-slate-600 leading-relaxed">{product.description}</p>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Quantity</div>
                                <div className="flex items-center rounded-full border border-slate-200 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setQty((v) => Math.max(1, v - 1))}
                                        className="px-4 py-2 hover:bg-slate-50 font-black"
                                        aria-label="decrease"
                                    >
                                        -
                                    </button>
                                    <div className="px-5 py-2 text-sm font-black">{qty}</div>
                                    <button
                                        type="button"
                                        onClick={() => setQty((v) => Math.min(99, v + 1))}
                                        className="px-4 py-2 hover:bg-slate-50 font-black"
                                        aria-label="increase"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToBasket(product, qty);
                                        toast.success("Added to cart");
                                    }}
                                    className="rounded-full bg-emerald-700 text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition"
                                >
                                    Add to Cart
                                </button>

                                <Link
                                    to="/shop"
                                    className="rounded-full border border-slate-200 bg-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                                >
                                    Back to shop
                                </Link>
                            </div>

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Info</div>
                                <div className="mt-2 text-sm text-slate-700">
                                    Category: <span className="font-black">{product.category}</span>
                                </div>
                                <div className="mt-1 text-sm text-slate-700">
                                    Availability: <span className="font-black">600 kg available</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* related */}
                    <div className="mt-14">
                        <div className="text-center">
                            <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">Products</div>
                            <div className="mt-2 text-3xl font-black">Related Products</div>
                            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                                Far far away, behind the word mountains, far from the countries Vokalia and Consonantia
                            </p>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </motion.main>
    );
}
