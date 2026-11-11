import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const withId = (d) => ({ id: d.id, ...d.data() });

export async function getItem(col, id) {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? withId(snap) : null;
}

export async function saveItem(col, id, data) {
  await setDoc(
    doc(db, col, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function addItem(col, data) {
  const ref = await addDoc(collection(db, col), {
    ...data,
    published: data.published ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateItem(col, id, data) {
  await updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}

export async function removeItem(col, id) {
  await deleteDoc(doc(db, col, id));
}

// Admin: sab items (published aur unpublished)
export async function listItems(col) {
  const snap = await getDocs(query(collection(db, col), orderBy("order")));
  return snap.docs.map(withId);
}

// Public website: sirf published items
export async function listPublished(col) {
  const snap = await getDocs(
    query(collection(db, col), where("published", "==", true))
  );
  return snap.docs.map(withId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}