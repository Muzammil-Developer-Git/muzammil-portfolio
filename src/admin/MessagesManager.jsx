import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";
import { db } from "../lib/firebase";
import { updateItem, removeItem } from "../lib/api";
import ConfirmDialog from "../components/ConfirmDialog";

const fmt = (m) => (m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : "");

export default function MessagesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    try {
      const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setMsg({ type: "error", text: "Could not load messages: " + e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setRead = async (m, read) => {
    setItems((list) => list.map((x) => (x.id === m.id ? { ...x, read } : x)));
    try {
      await updateItem("messages", m.id, { read });
    } catch (err) {
      setMsg({ type: "error", text: "Could not update: " + err.message });
      load();
    }
  };

  const toggleOpen = (m) => {
    const next = open === m.id ? null : m.id;
    setOpen(next);
    if (next && !m.read) setRead(m, true);
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await removeItem("messages", toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setMsg({ type: "error", text: "Could not delete: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="card muted">Loading...</div>;

  const unread = items.filter((m) => !m.read).length;

  return (
    <div className="card">
      <div className="list-head">
        <span className="muted">
          {items.length} {items.length === 1 ? "message" : "messages"}
          {unread > 0 && ` · ${unread} unread`}
        </span>
      </div>

      {msg && (
        <div className={"alert " + (msg.type === "error" ? "alert-error" : "alert-success")}>
          {msg.text}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="muted">No messages yet.</p>
        </div>
      ) : (
        items.map((m) => (
          <div key={m.id} className={"msg-card" + (m.read ? "" : " unread")}>
            <button className="msg-head" onClick={() => toggleOpen(m)}>
              <span className="item-text">
                <span className="item-title">
                  {m.subject}
                  {!m.read && <span className="badge">New</span>}
                </span>
                <span className="item-sub" style={{ display: "block" }}>
                  {m.name} · {fmt(m)}
                </span>
              </span>
              {m.read ? <MailOpen size={18} /> : <Mail size={18} />}
            </button>

            {open === m.id && (
              <div className="msg-body">
                <p className="item-sub" style={{ marginTop: 12 }}>
                  From: {m.name} ({m.email})
                </p>
                <p className="msg-text">{m.message}</p>
                <div className="row">
                  <a
                    className="btn btn-ghost"
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}
                  >
                    <Reply size={16} /> Reply
                  </a>
                  <button className="btn btn-ghost" onClick={() => setRead(m, !m.read)}>
                    {m.read ? "Mark as unread" : "Mark as read"}
                  </button>
                  <button className="btn btn-danger" onClick={() => setToDelete(m)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete message?"
        message="This cannot be undone."
        confirmText="Delete"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}