import { useEffect, useState } from "react";
import { getItem, listPublished } from "./api";
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from "./defaults";

const safe = async (promise, fallback) => {
  try {
    return await promise;
  } catch {
    return fallback;
  }
};

export default function usePortfolio() {
  const [data, setData] = useState({
    loading: true,
    profile: DEFAULT_PROFILE,
    settings: DEFAULT_SETTINGS,
    photo: null,
    cvInfo: null,
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    documents: [],
    links: [],
    services: [],
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      const [
        profile, settings, photo, cvInfo, skills, education, experience,
        projects, certificates, documents, links, services,
      ] = await Promise.all([
        safe(getItem("profile", "main"), null),
        safe(getItem("settings", "main"), null),
        safe(getItem("files", "photo"), null),
        safe(getItem("files", "cvInfo"), null),
        safe(listPublished("skills"), []),
        safe(listPublished("education"), []),
        safe(listPublished("experience"), []),
        safe(listPublished("projects"), []),
        safe(listPublished("certificates"), []),
        safe(listPublished("documents"), []),
        safe(listPublished("links"), []),
        safe(listPublished("services"), []),
      ]);
      if (!alive) return;
      setData({
        loading: false,
        profile: { ...DEFAULT_PROFILE, ...(profile || {}) },
        settings: { ...DEFAULT_SETTINGS, ...(settings || {}) },
        photo: photo?.dataUrl || null,
        cvInfo,
        skills,
        education,
        experience,
        projects,
        certificates,
        documents,
        links,
        services,
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return data;
}