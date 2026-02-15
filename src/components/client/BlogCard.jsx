import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BlogCard({ post }) {
    return (
        <motion.div
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -2 }}
        >
            <Link to={`/blog/${post.id}`} className="block">
                <img src={post.image} alt={post.title} className="h-56 w-full object-cover" />
            </Link>
            <div className="p-5">
                <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">{post.date}</div>
                <Link to={`/blog/${post.id}`} className="mt-2 block text-xl font-black hover:text-emerald-700 transition">
                    {post.title}
                </Link>
                <div className="mt-4">
                    <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
