import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Camera, Upload, Trash2, Save, X, User } from "lucide-react";
import { getItem, saveItem, removeItem } from "../lib/api";
import { validateImage, readFileAsDataUrl, cropToDataUrl } from "../lib/files";
import ConfirmDialog from "../components/ConfirmDialog";

export default function PhotoManager() {
  const fileRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    let alive = true;
    getItem("files", "photo")
      .then((d) => {
        if (alive) setCurrent(d?.dataUrl || null);
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

  const onCropComplete = useCallback((_, pixels) => setArea(pixels), []);

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg(null);
    const problem = validateImage(file);
    if (problem) {
      setMsg({ type: "error", text: problem });
      return;
    }
    try {
      setPicked(await readFileAsDataUrl(file));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  const savePhoto = async () => {
    if (!picked || !area) return;
    setBusy(true);
    setMsg(null);
    try {
      const url = await cropToDataUrl(picked, area);
      await saveItem("files", "photo", {
        dataUrl: url,
        mime: "image/jpeg",
        published: true,
      });
      setCurrent(url);
      setPicked(null);
      setMsg({ type: "success", text: "Profile photo saved." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not save: " + err.message });
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = async () => {
    setBusy(true);
    try {
      await removeItem("files", "photo");
      setCurrent(null);
      setMsg({ type: "success", text: "Profile photo removed." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not remove: " + err.message });
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

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={onPick}
      />

      {picked ? (
        <div>
          <p className="muted" style={{ marginBottom: 12 }}>
            Drag the photo to position it and use the slider to zoom. The
            circular area is what will be saved.
          </p>
          <div className="crop-box">
            <Cropper
              image={picked}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="zoom">Zoom</label>
            <input
              id="zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div>
          <div className="row">
            <button className="btn btn-primary" onClick={savePhoto} disabled={busy}>
              <Save size={18} /> {busy ? "Saving..." : "Save Photo"}
            </button>
            <button className="btn btn-ghost" onClick={() => setPicked(null)} disabled={busy}>
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="row" style={{ gap: 24, alignItems: "center" }}>
          {current ? (
            <img className="avatar" src={current} alt="Profile" />
          ) : (
            <div className="avatar">
              <User size={64} />
            </div>
          )}
          <div>
            <p className="muted" style={{ marginBottom: 14 }}>
              {current
                ? "This is your current profile photo."
                : "No photo has been uploaded yet."}
              <br />
              JPG, JPEG, PNG or WebP, up to 10 MB.
            </p>
            <div className="row">
              <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
                {current ? <Upload size={18} /> : <Camera size={18} />}
                {current ? "Replace Photo" : "Add Photo"}
              </button>
              {current && (
                <button className="btn btn-danger" onClick={() => setConfirm(true)}>
                  <Trash2 size={18} /> Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm}
        title="Remove photo?"
        message="The profile photo will be removed from the website. You can upload a new one at any time."
        confirmText="Remove"
        busy={busy}
        onConfirm={removePhoto}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}