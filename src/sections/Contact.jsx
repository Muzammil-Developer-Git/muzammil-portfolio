import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Send, Mail, MapPin } from "lucide-react";
import { db } from "../lib/firebase";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact({ profile }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "failed"
  const [lastSent, setLastSent] = useState(0);

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Please enter a valid email address.";
    if (!form.subject.trim()) e.subject = "Please enter a subject.";
    if (form.message.trim().length < 10) e.message = "Your message should be at least 10 characters.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;

    if (Date.now() - lastSent < 30000) {
      setStatus("failed");
      setErrors({ form: "Please wait a few seconds before sending another message." });
      return;
    }

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    try {
      await addDoc(collection(db, "messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });
      setForm(EMPTY);
      setLastSent(Date.now());
      setStatus("sent");
    } catch {
      setStatus("failed");
      setErrors({ form: "Your message could not be sent." });
    }
  };

  const mailto =
    `mailto:${profile.email}?subject=${encodeURIComponent(form.subject || "Portfolio enquiry")}` +
    `&body=${encodeURIComponent(form.message)}`;

  return (
    <section id="contact" className="section alt">
      <div className="container">
        <h2 className="section-title">Contact Me</h2>
        <p className="section-sub">
          Have a project, an opportunity or a question? Send me a message.
        </p>

        <div className="contact-grid">
          <div className="card">
            {profile.email && (
              <div className="contact-line">
                <Mail size={18} /> <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            )}
            {profile.location && (
              <div className="contact-line">
                <MapPin size={18} /> {profile.location}
              </div>
            )}
          </div>

          <form className="card" onSubmit={submit} noValidate>
            {status === "sent" && (
              <div className="alert alert-success">
                Thank you! Your message has been sent.
              </div>
            )}
            {status === "failed" && (
              <div className="alert alert-error">
                {errors.form || "Your message could not be sent."}{" "}
                {profile.email && (
                  <>
                    You can{" "}
                    <a href={mailto} style={{ textDecoration: "underline" }}>
                      email me directly
                    </a>{" "}
                    instead.
                  </>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="c-name">Full Name</label>
              <input id="c-name" maxLength={100} value={form.name}
                onChange={(e) => change("name", e.target.value)} />
              {errors.name && <span className="hint" style={{ color: "var(--danger)" }}>{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="c-email">Email Address</label>
              <input id="c-email" type="email" maxLength={200} value={form.email}
                onChange={(e) => change("email", e.target.value)} />
              {errors.email && <span className="hint" style={{ color: "var(--danger)" }}>{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="c-subject">Subject</label>
              <input id="c-subject" maxLength={200} value={form.subject}
                onChange={(e) => change("subject", e.target.value)} />
              {errors.subject && <span className="hint" style={{ color: "var(--danger)" }}>{errors.subject}</span>}
            </div>

            <div className="field">
              <label htmlFor="c-message">Message</label>
              <textarea id="c-message" rows={6} maxLength={3000} value={form.message}
                onChange={(e) => change("message", e.target.value)} />
              {errors.message && <span className="hint" style={{ color: "var(--danger)" }}>{errors.message}</span>}
            </div>

            <button className="btn btn-primary" disabled={status === "sending"}>
              <Send size={18} /> {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}