import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/client/Navbar";

import Home from "./pages/client/Home";
import Products from "./pages/client/Products";
import ProductDetail from "./pages/client/ProductDetail";
import Blogs from "./pages/client/Blogs";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminBlogs from "./pages/admin/Blogs";

import { BasketProvider } from "./context/BasketContext";
import { WishlistProvider } from "./context/WishlistContext";
// import { ThemeProvider } from "./context/ThemeContext";

function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      {children}
      <footer className="mt-16 bg-slate-900 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xl font-black">Vegefoods</div>
            <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-xl">
              Fresh organic e-commerce experience with real CRUD admin, basket/wishlist reducer, debounce search and smooth animations.
            </p>
          </div>
          <div>
            <div className="text-sm font-extrabold uppercase tracking-widest">Menu</div>
            <div className="mt-4 grid gap-2 text-sm text-white/70">
              <a className="hover:text-white" href="/shop">Shop</a>
              <a className="hover:text-white" href="/blog">Journal</a>
            </div>
          </div>
          <div>
            <div className="text-sm font-extrabold uppercase tracking-widest">Have a Questions?</div>
            <div className="mt-4 text-sm text-white/70 leading-relaxed">
              203 Fake St. Mountain View, San Francisco, California, USA <br />
              +2 392 3929 210 <br />
              info@yourdomain.com
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-white/60">
            Copyright © {new Date().getFullYear()} All rights reserved | This template is made with ♥ by Colorlib (UI reference)
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">Admin Panel</div>
            <div className="text-xl font-black">Vegefoods Console</div>
          </div>
          <a
            href="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50"
          >
            Back to site
          </a>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          <a
            href="/admin"
            className="block rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-widest bg-emerald-700 text-white"
          >
            Dashboard
          </a>
          <a
            href="/admin/products"
            className="block rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-widest bg-white border border-slate-200 hover:bg-slate-50"
          >
            Products
          </a>
          <a
            href="/admin/blogs"
            className="block rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-widest bg-white border border-slate-200 hover:bg-slate-50"
          >
            Blogs
          </a>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Access</div>
            <div className="mt-2 text-sm text-slate-600 leading-relaxed">
              Admin link navbar-da yoxdur. Yalnız URL ilə: <span className="font-black">/admin</span>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">{children}</section>
      </div>
    </div>
  );
}

export default function App() {
  return (
    // <ThemeProvider>
      <BasketProvider>
        <WishlistProvider>
          <Routes>
            {/* client */}
            <Route
              path="/"
              element={
                <ClientLayout>
                  <Home />
                </ClientLayout>
              }
            />
            <Route
              path="/shop"
              element={
                <ClientLayout>
                  <Products />
                </ClientLayout>
              }
            />
            <Route
              path="/shop/:id"
              element={
                <ClientLayout>
                  <ProductDetail />
                </ClientLayout>
              }
            />
            <Route
              path="/blog"
              element={
                <ClientLayout>
                  <Blogs />
                </ClientLayout>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <ClientLayout>
                  <Blogs mode="detail" />
                </ClientLayout>
              }
            />

            {/* admin (navbar-da yox) */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <AdminLayout>
                  <AdminBlogs />
                </AdminLayout>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer position="top-right" autoClose={2200} hideProgressBar newestOnTop closeOnClick pauseOnHover />
        </WishlistProvider>
      </BasketProvider>
    // </ThemeProvider>
  );
}
