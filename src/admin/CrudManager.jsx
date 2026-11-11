import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown, Eye, EyeOff,
  Download, ImagePlus, FileUp, FileText,
} from "lucide-react";
import { listItems, addItem, updateItem, removeItem } from "../lib/api";
import { validateImage, readFileAsDataUrl, compressImage } from "../lib/files";
import ConfirmDialog from "../components/ConfirmDialog";

const URL_OK = /^(https?:\/\/|mailto:)/i;
const MAX_ITEM_CHARS = 900000;

const opt = (o) => (typeof o === "string" ? { value: o, label: o } : o);

const defaultValue = (f) =>
  f.type === "images" ? [] : f.type === "checkbox" ? false : f.type === "file" ? null : "";

const emptyForm = (fields) =>
  Object.fromEntries(fields.map((f) => [f.key, defaultValue(f)]));

const fromItem = (f, item) => {
  if (f.type === "file") {
    return item[f.key]
      ? {
          dataUrl: item[f.key],
          type: item[f.key + "Type"] || "image",
          name: item[f.key + "Name"] || "",
        }
      : null;
  }
  if (f.type === "images") return Array.isArray(item[f.key]) ? item[f.key] : [];
  if (f.type === "checkbox") return item[f.key] === true;
  return item[f.key] ?? "";
};

const isEmpty = (f, v) =>
  f.type === "images"
    ? v.length === 0
    : f.type === "file"
    ? !v
    : f.type === "checkbox"
    ? false
    : !String(v ?? "").trim();

function ImageField({ field, value, onChange, onError }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const multiple = field.type === "images";
  const list = multiple ? value : value ? [value] : [];
  const max = multiple ? field.max || 3 : 1;

  const pick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    onError(null);
    setBusy(true);
    try {
      const room = Math.max(max - list.length, 0);
      const take = files.slice(0, multiple ? room : 1);
      const out = [];
      for (const file of take) {
        const problem = validateImage(file);
        if (problem) throw new Error(problem);
        out.push(
          await compressImage(file, {
            maxWidth: field.maxWidth || 800,
            maxChars: field.maxChars || 90000,
          })
        );
      }
      if (out.length) onChange(multiple ? [...list, ...out] : out[0]);
      if (multiple && files.length > room) {
        onError(`You can add up to ${max} images. Extra files were skipped.`);
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = (i) =>
    multiple ? onChange(list.filter((_, j) => j !== i)) : onChange("");

  return (
    <div>
      <div className="thumb-row">
        {list.map((src, i) => (
          <div className="thumb-wrap" key={i}>
            <img className="thumb" src={src} alt="" />
            <button type="button" className="thumb-remove" onClick={() => remove(i)} aria-label="Remove image">
              <X size={14} />
            </button>
          </div>
        ))}
        {list.length < max && (
          <button type="button" className="btn btn-ghost" onClick={() => ref.current?.click()} disabled={busy}>
            <ImagePlus size={18} />
            {busy ? "Processing..." : list.length ? "Add Image" : "Upload Image"}
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        hidden
        multiple={multiple}
        accept="image/jpeg,image/png,image/webp"
        onChange={pick}
      />
    </div>
  );
}

function FileField({ field, value, onChange, onError }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const maxPdfKB = field.maxPdfKB || 500;

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onError(null);
    setBusy(true);
    try {
      if (file.type === "application/pdf") {
        if (file.size > maxPdfKB * 1024) {
          throw new Error(`The PDF must be smaller than ${maxPdfKB} KB. Please compress it and try again.`);
        }
        onChange({ dataUrl: await readFileAsDataUrl(file), type: "pdf", name: file.name });
      } else {
        const problem = validateImage(file);
        if (problem) {
          throw new Error(
            problem.startsWith("Only")
              ? "Please choose a PDF, JPG, PNG or WebP file."
              : problem
          );
        }
        onChange({
          dataUrl: await compressImage(file, {
            maxWidth: field.maxWidth || 1400,
            maxChars: field.maxChars || 250000,
          }),
          type: "image",
          name: file.name,
        });
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="thumb-row">
        {value &&
          (value.type === "image" ? (
            <img className="thumb" src={value.dataUrl} alt="" />
          ) : (
            <span className="file-chip">
              <FileText size={18} /> {value.name || "document.pdf"}
            </span>
          ))}
        <button type="button" className="btn btn-ghost" onClick={() => ref.current?.click()} disabled={busy}>
          <FileUp size={18} />
          {busy ? "Processing..." : value ? "Replace File" : "Upload File"}
        </button>
        {value && (
          <button type="button" className="btn btn-ghost" onClick={() => onChange(null)}>
            <X size={18} /> Remove
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        hidden
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={pick}
      />
    </div>
  );
}

export default function CrudManager({ config }) {
  const { collection: col, singular, addLabel, fields, title, subtitle, seed } = config;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm(fields));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    try {
      setItems(await listItems(col));
    } catch (e) {
      setMsg({ type: "error", text: "Could not load data: " + e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAdd = () => {
    setMsg(null);
    setForm(emptyForm(fields));
    setEditing("new");
  };

  const startEdit = (item) => {
    setMsg(null);
    setForm(Object.fromEntries(fields.map((f) => [f.key, fromItem(f, item)])));
    setEditing(item.id);
  };

  const cancel = () => {
    setEditing(null);
    setMsg(null);
  };

  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const fieldError = (text) => setMsg(text ? { type: "error", text } : null);

  const validate = () => {
    for (const f of fields) {
      const v = form[f.key];
      if (f.required && isEmpty(f, v)) return `${f.label} is required.`;
      if (f.type === "url" && String(v || "").trim() && !URL_OK.test(String(v).trim())) {
        return `${f.label} must start with https://, http:// or mailto:`;
      }
    }
    return null;
  };

  const buildData = () => {
    const data = {};
    fields.forEach((f) => {
      const v = form[f.key];
      if (f.type === "file") {
        data[f.key] = v ? v.dataUrl : "";
        data[f.key + "Type"] = v ? v.type : "";
        data[f.key + "Name"] = v ? v.name : "";
      } else if (f.type === "images") {
        data[f.key] = v;
      } else if (f.type === "checkbox") {
        data[f.key] = !!v;
      } else {
        data[f.key] = String(v ?? "").trim();
      }
    });
    return data;
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg(null);
    const problem = validate();
    if (problem) {
      setMsg({ type: "error", text: problem });
      return;
    }

    const data = buildData();
    if (JSON.stringify(data).length > MAX_ITEM_CHARS) {
      setMsg({
        type: "error",
        text: "This item has too much image data. Remove an image or use smaller images.",
      });
      return;
    }

    setBusy(true);
    try {
      if (editing === "new") {
        const maxOrder = items.reduce((m, i) => Math.max(m, i.order ?? 0), 0);
        await addItem(col, { ...data, order: maxOrder + 1, published: true });
      } else {
        await updateItem(col, editing, data);
      }
      await load();
      setEditing(null);
      setMsg({ type: "success", text: `${singular} saved.` });
    } catch (err) {
      setMsg({ type: "error", text: "Could not save: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const move = async (index, dir) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[index];
    const b = items[j];
    setBusy(true);
    try {
      await Promise.all([
        updateItem(col, a.id, { order: b.order }),
        updateItem(col, b.id, { order: a.order }),
      ]);
      await load();
    } catch (err) {
      setMsg({ type: "error", text: "Could not reorder: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (item) => {
    setBusy(true);
    try {
      await updateItem(col, item.id, { published: item.published === false });
      await load();
    } catch (err) {
      setMsg({ type: "error", text: "Could not update: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await removeItem(col, toDelete.id);
      setToDelete(null);
      await load();
      setMsg({ type: "success", text: `${singular} deleted.` });
    } catch (err) {
      setMsg({ type: "error", text: "Could not delete: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const loadSeed = async () => {
    setBusy(true);
    setMsg(null);
    try {
      for (let i = 0; i < seed.length; i++) {
        await addItem(col, { ...seed[i], order: i + 1, published: true });
      }
      await load();
      setMsg({ type: "success", text: "Starting data loaded. You can edit or delete anything." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not load starting data: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const alertBox = msg && (
    <div className={"alert " + (msg.type === "error" ? "alert-error" : "alert-success")}>
      {msg.text}
    </div>
  );

  if (loading) return <div className="card muted">Loading...</div>;

  if (editing !== null) {
    return (
      <form className="card" onSubmit={save}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: 16 }}>
          {editing === "new" ? addLabel : `Edit ${singular}`}
        </h2>
        {alertBox}

        {fields.map((f) => {
          const id = `${col}-${f.key}`;

          if (f.type === "checkbox") {
            return (
              <div className="field" key={f.key}>
                <label className="check" htmlFor={id}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={!!form[f.key]}
                    onChange={(e) => change(f.key, e.target.checked)}
                  />
                  {f.label}
                </label>
                {f.hint && <span className="hint">{f.hint}</span>}
              </div>
            );
          }

          return (
            <div className="field" key={f.key}>
              <label htmlFor={["image", "images", "file"].includes(f.type) ? undefined : id}>
                {f.label}
                {f.required ? " *" : ""}
              </label>

              {f.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={f.rows || 4}
                  maxLength={f.max}
                  value={form[f.key]}
                  onChange={(e) => change(f.key, e.target.value)}
                />
              ) : f.type === "select" ? (
                <select id={id} value={form[f.key]} onChange={(e) => change(f.key, e.target.value)}>
                  <option value="">Select...</option>
                  {f.options.map((o) => {
                    const x = opt(o);
                    return (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    );
                  })}
                </select>
              ) : f.type === "image" || f.type === "images" ? (
                <ImageField field={f} value={form[f.key]} onChange={(v) => change(f.key, v)} onError={fieldError} />
              ) : f.type === "file" ? (
                <FileField field={f} value={form[f.key]} onChange={(v) => change(f.key, v)} onError={fieldError} />
              ) : (
                <>
                  <input
                    id={id}
                    type="text"
                    maxLength={f.max}
                    placeholder={f.placeholder || ""}
                    list={f.suggestions ? `${id}-list` : undefined}
                    value={form[f.key]}
                    onChange={(e) => change(f.key, e.target.value)}
                  />
                  {f.suggestions && (
                    <datalist id={`${id}-list`}>
                      {f.suggestions.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  )}
                </>
              )}
              {f.hint && <span className="hint">{f.hint}</span>}
            </div>
          );
        })}

        <div className="row">
          <button className="btn btn-primary" disabled={busy}>
            <Save size={18} /> {busy ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={cancel} disabled={busy}>
            <X size={18} /> Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="card">
      <div className="list-head">
        <span className="muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <button className="btn btn-primary" onClick={startAdd} disabled={busy}>
          <Plus size={18} /> {addLabel}
        </button>
      </div>

      {alertBox}

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="muted" style={{ marginBottom: 14 }}>
            Nothing here yet.
          </p>
          {seed && seed.length > 0 && (
            <button className="btn btn-ghost" onClick={loadSeed} disabled={busy}>
              <Download size={18} /> {busy ? "Loading..." : "Load starting data"}
            </button>
          )}
        </div>
      ) : (
        items.map((item, i) => (
          <div key={item.id} className={"item" + (item.published === false ? " hidden-item" : "")}>
            <div className="item-text">
              <div className="item-title">
                {title(item)}
                {item.published === false && <span className="badge">Hidden</span>}
              </div>
              {subtitle(item) && <div className="item-sub">{subtitle(item)}</div>}
            </div>
            <div className="item-actions">
              <button className="icon-btn" title="Move up" aria-label="Move up"
                onClick={() => move(i, -1)} disabled={busy || i === 0}>
                <ArrowUp size={16} />
              </button>
              <button className="icon-btn" title="Move down" aria-label="Move down"
                onClick={() => move(i, 1)} disabled={busy || i === items.length - 1}>
                <ArrowDown size={16} />
              </button>
              <button className="icon-btn" disabled={busy}
                title={item.published === false ? "Publish" : "Hide from website"}
                aria-label={item.published === false ? "Publish" : "Hide from website"}
                onClick={() => togglePublish(item)}>
                {item.published === false ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button className="icon-btn" title="Edit" aria-label="Edit"
                onClick={() => startEdit(item)} disabled={busy}>
                <Pencil size={16} />
              </button>
              <button className="icon-btn danger" title="Delete" aria-label="Delete"
                onClick={() => setToDelete(item)} disabled={busy}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete ${singular.toLowerCase()}?`}
        message="This cannot be undone."
        confirmText="Delete"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}