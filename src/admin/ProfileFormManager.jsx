import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getItem, saveItem } from "../lib/api";
import { DEFAULT_PROFILE } from "../lib/defaults";

export default function ProfileFormManager({ fields }) {
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let alive = true;
    getItem("profile", "main")
      .then((d) => {
        if (alive && d) setForm({ ...DEFAULT_PROFILE, ...d });
      })
      .catch((e) => {
        if (alive) setMsg({ type: "error", text: "Could not load data: " + e.message });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setMsg(null);

    for (const f of fields) {
      const v = String(form[f.key] ?? "").trim();
      if (f.required && !v) {
        setMsg({ type: "error", text: `${f.label} cannot be empty.` });
        return;
      }
      if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) {
        setMsg({ type: "error", text: "Please enter a valid email address." });
        return;
      }
    }

    setBusy(true);
    try {
      const data = {};
      fields.forEach((f) => {
        data[f.key] = String(form[f.key] ?? "").trim();
      });
      await saveItem("profile", "main", data);
      setMsg({ type: "success", text: "Changes saved successfully." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not save: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="card muted">Loading...</div>;

  return (
    <form className="card" onSubmit={save}>
      {msg && (
        <div className={"alert " + (msg.type === "error" ? "alert-error" : "alert-success")}>
          {msg.text}
        </div>
      )}

      {fields.map((f) => (
        <div className="field" key={f.key}>
          <label htmlFor={f.key}>
            {f.label}
            {f.required ? " *" : ""}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.key}
              rows={f.rows || 4}
              maxLength={f.max}
              value={form[f.key] ?? ""}
              onChange={(e) => change(f.key, e.target.value)}
            />
          ) : (
            <input
              id={f.key}
              type={f.type === "email" ? "email" : "text"}
              maxLength={f.max}
              value={form[f.key] ?? ""}
              onChange={(e) => change(f.key, e.target.value)}
            />
          )}
          {f.hint && <span className="hint">{f.hint}</span>}
        </div>
      ))}

      <button className="btn btn-primary" disabled={busy}>
        <Save size={18} /> {busy ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}