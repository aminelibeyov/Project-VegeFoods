import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductForm from "../../components/admin/ProductForm";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useDebounce, useProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { finalPrice, formatMoney } from "../../constants/api";

export default function Products() {
  const { data, loading, error, refetch } = useProducts();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [q, setQ] = useState("");
  const dq = useDebounce(q, 500);

  const list = useMemo(() => {
    const arr = Array.isArray(data) ? [...data] : [];
    if (!dq.trim()) return arr;
    const s = dq.trim().toLowerCase();
    return arr.filter((p) => String(p.name).toLowerCase().includes(s) || String(p.category).toLowerCase().includes(s));
  }, [data, dq]);

  const onAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (p) => {
    setEditing(p);
    setOpen(true);
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      refetch();
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing?.id) {
        await updateProduct(editing.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      setOpen(false);
      setEditing(null);
      refetch();
    } catch (e) {
      toast.error(e.message || "Save failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">Admin</div>
          <div className="mt-2 text-2xl font-black">Products</div>
          <div className="mt-1 text-slate-600">Add / Edit / Delete — Formik + Yup + Modal + Toast</div>
        </div>
        <Button onClick={onAdd}>Add Product</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px] items-start">
        <div>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or category..." />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Count</div>
          <div className="mt-2 text-3xl font-black text-emerald-700">{list.length}</div>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              setQ("");
              toast.info("Search cleared");
            }}
            type="button"
          >
            Clear
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-slate-200 p-6">
          <div className="font-extrabold">Load failed</div>
          <div className="mt-1 text-slate-600">{error.message}</div>
          <Button className="mt-4" onClick={refetch}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
            Products Table
          </div>

          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left">
              <thead className="text-xs uppercase tracking-widest text-slate-500 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Discount</th>
                  <th className="px-5 py-4">Final</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="px-5 py-4">
                        <div className="h-4 w-48 bg-slate-200/70 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-24 bg-slate-200/70 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-16 bg-slate-200/70 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-16 bg-slate-200/70 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-16 bg-slate-200/70 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="h-8 w-28 bg-slate-200/70 rounded-full animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : list.length === 0 ? (
                  <tr>
                    <td className="px-5 py-10 text-center text-slate-600" colSpan={6}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  list.map((p) => (
                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[320px]">
                          <img src={p.image} alt={p.name} className="h-12 w-12 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <div className="font-black">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black">{formatMoney(p.price)}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-700/10 border border-emerald-700/20 text-emerald-800 px-4 py-2 text-xs font-black uppercase tracking-widest">
                          {Number(p.discount)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-emerald-700">{formatMoney(finalPrice(p.price, p.discount))}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => onEdit(p)} type="button">
                            Edit
                          </Button>
                          <Button variant="danger" className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(p.id)} type="button">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductForm
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initialValues={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
