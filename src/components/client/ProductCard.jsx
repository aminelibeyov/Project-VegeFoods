import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { finalPrice, formatMoney } from "../../constants/api";
import { useBasket } from "../../context/BasketContext";
import { useWishlist } from "../../context/WishlistContext";

function Heart({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "currentColor" : "none"}>
      <path
        d="M12 21s-7-4.5-9.2-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.2 6c-2.2 4.5-9.2 9-9.2 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductCard({ product }) {
  const { addToBasket } = useBasket();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWish = isInWishlist(product.id);
  const fp = finalPrice(product.price, product.discount);

  return (
    <motion.div
      className="group border border-slate-200 rounded-2xl overflow-hidden bg-white"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      <div className="relative">
        <Link to={`/shop/${product.id}`} className="block">
          <img src={product.image} alt={product.name} className="h-56 w-full object-cover" loading="lazy" />
        </Link>

        {Number(product.discount) > 0 ? (
          <div className="absolute left-4 top-4 bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
          <div className="bg-white/95 border-t border-slate-200 p-3 flex items-center justify-between gap-2">
            <button
              onClick={() => addToBasket(product, 1)}
              className="flex-1 rounded-full bg-emerald-700 text-white px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition"
              type="button"
            >
              Add to cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`rounded-full border px-3 py-2 transition ${
                inWish ? "bg-emerald-700 text-white border-emerald-700" : "border-slate-200 hover:bg-slate-50"
              }`}
              type="button"
              aria-label="Toggle wishlist"
            >
              <Heart active={inWish} />
            </button>

            <Link
              to={`/shop/${product.id}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{product.category}</div>
        <Link to={`/shop/${product.id}`} className="mt-2 block font-black text-lg hover:text-emerald-700 transition">
          {product.name}
        </Link>

        <div className="mt-2 flex items-center justify-center gap-2">
          {Number(product.discount) > 0 ? <div className="text-sm text-slate-400 line-through">{formatMoney(product.price)}</div> : null}
          <div className="text-lg font-black text-emerald-700">{formatMoney(fp)}</div>
        </div>
      </div>
    </motion.div>
  );
}
