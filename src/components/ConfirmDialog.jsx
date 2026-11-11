export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: 8 }}>{title}</h2>
        <p className="muted" style={{ marginBottom: 20 }}>{message}</p>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}