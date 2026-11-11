import { useEffect, useRef, useState } from "react";
import { FileUp, Eye, Trash2, FileText } from "lucide-react";
import { getItem, saveItem, removeItem } from "../lib/api";
import { readFileAsDataUrl } from "../lib/files";
import { openDataUrl } from "../lib/blob";
import ConfirmDialog from "../components/ConfirmDialog";

const MAX_KB = 600;

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

export default function CvManager() {
  const ref = useRef(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    let alive = true;
    getItem("files", "cvInfo")
      .then((d) => {
        if (alive) setInfo(d);
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

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg(null);

    if (file.type !== "application/pdf") {
      setMsg({ type: "error", text: "Only PDF files are allowed." });
      return;
    }
    if (file.size > MAX_KB * 1024) {
      setMsg({
        type: "error",
        text: `The PDF must be smaller than ${MAX_KB} KB. Please compress it and try again.`,
      });
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await saveItem("files", "cv", { dataUrl, fileName: file.name });
      const meta = { fileName: file.name, size: file.size, uploadedAt: new Date().toISOString() };
      await saveItem("files", "cvInfo", meta);
      setInfo(meta);
      setMsg({ type: "success", text: "CV uploaded. The Download CV button is now live on your website." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not upload: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const preview = async () => {
    setBusy(true);
    try {
      const d = await getItem("files", "cv");
      if (!d?.dataUrl) throw new Error("The CV file was not found.");
      openDataUrl(d.dataUrl);
    } catch (err) {
      setMsg({ type: "error", text: "Could not open the CV: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await removeItem("files", "cvInfo");
      await removeItem("files", "cv");
      setInfo(null);
      setMsg({ type: "success", text: "CV deleted." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not delete: " + err.message });
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  };

  if (loading) return <div className="card muted">Loading...</div>;

  return (
    <div className="card">
      {msg && (
        <div className={"alert " + (msg.type === "error" ? "alert-error" : "alert-success")}>
          {msg.text}
        </div>
      )}

      <input ref={ref} type="file" accept="application/pdf" hidden onChange={onPick} />

      {info ? (
        <div className="item">
          <div className="item-text">
            <div className="item-title">
              <FileText size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />
              {info.fileName}
            </div>
            <div className="item-sub">
              Uploaded {fmtDate(info.uploadedAt)} · {Math.round((info.size || 0) / 1024)} KB
            </div>
          </div>
          <div className="item-actions">
            <button className="icon-btn" title="Preview" aria-label="Preview" onClick={preview} disabled={busy}>
              <Eye size={16} />
            </button>
            <button className="icon-btn danger" title="Delete" aria-label="Delete" onClick={() => setConfirm(true)} disabled={busy}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <p className="muted" style={{ marginBottom: 14 }}>
          No CV uploaded yet.
        </p>
      )}

      <button className="btn btn-primary" onClick={() => ref.current?.click()} disabled={busy}>
        <FileUp size={18} />
        {busy ? "Please wait..." : info ? "Replace CV" : "+ Upload CV"}
      </button>
      <p className="hint" style={{ marginTop: 10 }}>PDF only, up to {MAX_KB} KB.</p>

      <ConfirmDialog
        open={confirm}
        title="Delete CV?"
        message="The Download CV button will disappear from your website until you upload a new CV."
        confirmText="Delete"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}