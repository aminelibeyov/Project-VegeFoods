import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, title, children, onClose, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/55" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white overflow-hidden"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="text-sm font-black uppercase tracking-widest">{title}</div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>

            <div className="p-6">{children}</div>

            {footer ? <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
