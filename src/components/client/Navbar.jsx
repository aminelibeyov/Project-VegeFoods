import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useBasket } from "../../context/BasketContext";
import { useWishlist } from "../../context/WishlistContext";
// import { useTheme } from "../../context/ThemeContext";

function cls(...a) {
    return a.filter(Boolean).join(" ");
}

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
                d="M6.5 6h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.2 3.8A1.8 1.8 0 0 0 3.4 2.5H2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9.5 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" fill="currentColor" />
            <path d="M17.5 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" fill="currentColor" />
        </svg>
    );
}

function HeartIcon({ filled }) {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? "currentColor" : "none"}>
            <path
                d="M12 21s-7-4.5-9.2-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.2 6c-2.2 4.5-9.2 9-9.2 9Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function NavItem({ to, children, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                cls(
                    "uppercase tracking-[0.22em] text-[12px] font-extrabold px-3 py-2 transition",
                    isActive ? "text-emerald-700" : "text-slate-800 hover:text-emerald-700"
                )
            }
        >
            {children}
        </NavLink>
    );
}

export default function Navbar() {
    const { totalItems } = useBasket();
    const { totalItems: wishCount } = useWishlist();
    // const { theme, toggleTheme } = useTheme();

    const [open, setOpen] = useState(false);
    const location = useLocation();

    useMemo(() => setOpen(false), [location.pathname]);

    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, []);

    return (
        <header className="w-full">
            {/* top info bar (template vibe) */}
            <div className="bg-emerald-700 text-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-2 flex items-center justify-between gap-3 text-[12px] tracking-wider">
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline">+ 1235 2355 98</span>
                        <span className="hidden sm:inline">youremail@email.com</span>
                        <span className="sm:hidden font-bold uppercase tracking-widest">VegeFoods</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden md:inline">3-5 Business days delivery &amp; Free Returns</span>
                        {/* <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10 transition"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </button> */}
                    </div>
                </div>
            </div>

            {/* main nav */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
                <div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
                    <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">
                        Vegefoods
                    </Link>

                    <nav className="hidden md:flex items-center">
                        <NavItem to="/" end>
                            Home
                        </NavItem>
                        <NavItem to="/shop">Shop</NavItem>
                        <NavItem to="/blog">Blog</NavItem>
                        {/* Admin burada YOXDUR */}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/shop"
                            className="hidden sm:inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                        >
                            Shop now
                        </Link>

                        <Link
                            to="/shop"
                            className="relative rounded-full border border-slate-200 p-2 hover:bg-slate-50 transition"
                            aria-label="Wishlist"
                            title="Wishlist"
                        >
                            <HeartIcon filled={wishCount > 0} />
                            {wishCount > 0 ? (
                                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-emerald-700 text-white text-[11px] font-black grid place-items-center">
                                    {wishCount}
                                </span>
                            ) : null}
                        </Link>

                        <Link
                            to="/shop"
                            className="relative rounded-full border border-slate-200 p-2 hover:bg-slate-50 transition"
                            aria-label="Cart"
                            title="Cart"
                        >
                            <CartIcon />
                            {totalItems > 0 ? (
                                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-emerald-700 text-white text-[11px] font-black grid place-items-center">
                                    {totalItems}
                                </span>
                            ) : null}
                        </Link>

                        <button
                            type="button"
                            className="md:hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Open menu"
                        >
                            Menu
                        </button>
                    </div>
                </div>

                {open ? (
                    <div className="md:hidden border-t border-slate-200 bg-white">
                        <div className="mx-auto w-full max-w-6xl px-4 py-3 flex flex-col">
                            <NavItem to="/" end>
                                Home
                            </NavItem>
                            <NavItem to="/shop">Shop</NavItem>
                            <NavItem to="/blog">Blog</NavItem>
                        </div>
                    </div>
                ) : null}
            </div>
        </header>
    );
}
