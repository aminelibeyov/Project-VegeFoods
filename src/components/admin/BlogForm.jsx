import { Formik } from "formik";
import { nanoid } from "nanoid";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

export default function BlogForm({ open, onClose, initialValues, onSubmit }) {
  const isEdit = Boolean(initialValues?.id);

  const defaults = {
    id: "",
    title: "",
    image: "",
    date: "",
    content: ""
  };

  const values = initialValues ? { ...defaults, ...initialValues } : defaults;

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Blog" : "Add Blog"}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="blog-form" type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <Formik
        initialValues={values}
        // validationSchema={blogSchema}
        enableReinitialize
        onSubmit={(vals, helpers) => {
          const payload = {
            ...vals,
            id: isEdit ? vals.id : `b_${nanoid(18)}`
          };
          onSubmit(payload).finally(() => helpers.setSubmitting(false));
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, submitForm }) => (
          <form
            id="blog-form"
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
            className="grid gap-4"
          >
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Title</div>
              <Input name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} placeholder="Healthy Green Smoothies..." />
              {touched.title && errors.title ? <div className="mt-1 text-sm text-red-600">{errors.title}</div> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Image URL</div>
                <Input name="image" value={values.image} onChange={handleChange} onBlur={handleBlur} placeholder="https://..." />
                {touched.image && errors.image ? <div className="mt-1 text-sm text-red-600">{errors.image}</div> : null}
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Date</div>
                <Input name="date" value={values.date} onChange={handleChange} onBlur={handleBlur} placeholder="YYYY-MM-DD" />
                {touched.date && errors.date ? <div className="mt-1 text-sm text-red-600">{errors.date}</div> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Preview</div>
              {values.image ? (
                <img src={values.image} alt="preview" className="mt-3 h-28 w-full object-cover rounded-xl border border-slate-200" />
              ) : (
                <div className="mt-3 text-sm text-slate-600">Add image URL to preview</div>
              )}
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Content</div>
              <textarea
                name="content"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={10}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600/40"
                placeholder="Write blog content..."
              />
              {touched.content && errors.content ? <div className="mt-1 text-sm text-red-600">{errors.content}</div> : null}
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
