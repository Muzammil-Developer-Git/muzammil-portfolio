import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { getItem } from "../lib/api";
import { downloadDataUrl, openDataUrl } from "../lib/blob";

function useCvAction(action) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      const d = await getItem("files", "cv");
      if (!d?.dataUrl) throw new Error("missing");
      action(d);
    } catch {
      setError("The CV could not be opened. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return { busy, error, run };
}

export function DownloadCvButton({ info, className = "btn btn-primary" }) {
  const { busy, error, run } = useCvAction((d) =>
    downloadDataUrl(d.dataUrl, info?.fileName || "CV.pdf")
  );
  return (
    <>
      <button className={className} onClick={run} disabled={busy}>
        <Download size={18} /> {busy ? "Preparing..." : "Download CV"}
      </button>
      {error && <span className="hint" style={{ color: "var(--danger)" }}>{error}</span>}
    </>
  );
}

export function ViewCvButton({ className = "btn btn-ghost" }) {
  const { busy, error, run } = useCvAction((d) => openDataUrl(d.dataUrl));
  return (
    <>
      <button className={className} onClick={run} disabled={busy}>
        <Eye size={18} /> {busy ? "Opening..." : "View CV"}
      </button>
      {error && <span className="hint" style={{ color: "var(--danger)" }}>{error}</span>}
    </>
  );
}