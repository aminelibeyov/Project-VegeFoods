import { Formik } from "formik";
import { nanoid } from "nanoid";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { productSchema } from "../../validation/productSchema";
import { CATEGORIES } from "../../constants/api";

export default function ProductForm({ open, onClose, initialValues, onSubmit }) {
  const isEdit = Boolean(initialValues?.id);

  const defaults = {
    id: "",
    name: "",
    price: 0,
    image: "",
    category: "Vegetables",
    description: "",
    discount: 0
  };

  const values = initialValues ? { ...defaults, ...initialValues } : defaults;

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Product" : "Add Product"}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="product-form" type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <Formik
        initialValues={values}
        validationSchema={productSchema}
        enableReinitialize
        onSubmit={(vals, helpers) => {
          const payload = {
            ...vals,
            id: isEdit ? vals.id : `p_${nanoid(18)}`
          };
          onSubmit(payload).finally(() => helpers.setSubmitting(false));
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, submitForm }) => (
          <form
            id="product-form"
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
            className="grid gap-4"
          >
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Name</div>
              <Input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="Fresh Spinach" />
              {touched.name && errors.name ? <div className="mt-1 text-sm text-red-600">{errors.name}</div> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Price</div>
                <Input name="price" value={values.price} onChange={handleChange} onBlur={handleBlur} type="number" min="0" />
                {touched.price && errors.price ? <div className="mt-1 text-sm text-red-600">{errors.price}</div> : null}
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Discount (0-90)</div>
                <Input name="discount" value={values.discount} onChange={handleChange} onBlur={handleBlur} type="number" min="0" max="90" />
                {touched.discount && errors.discount ? <div className="mt-1 text-sm text-red-600">{errors.discount}</div> : null}
              </div>
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Image URL</div>
              <Input name="image" value={values.image} onChange={handleChange} onBlur={handleBlur} placeholder="https://..." />
              {touched.image && errors.image ? <div className="mt-1 text-sm text-red-600">{errors.image}</div> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 items-start">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Category</div>
                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none bg-white focus:ring-4 focus:ring-emerald-500/15"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {touched.category && errors.category ? <div className="mt-1 text-sm text-red-600">{errors.category}</div> : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Preview</div>
                {values.image ? (
                  <img src={values.image} alt="preview" className="mt-3 h-28 w-full object-cover rounded-xl border border-slate-200" />
                ) : (
                  <div className="mt-3 text-sm text-slate-600">Add image URL to preview</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Description</div>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600/40"
                placeholder="Write product description..."
              />
              {touched.description && errors.description ? <div className="mt-1 text-sm text-red-600">{errors.description}</div> : null}
            </div>

            <Button type="submit" className="hidden" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
