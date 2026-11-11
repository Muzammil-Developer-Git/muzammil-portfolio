export const PROFILE_FIELDS = [
  { key: "fullName", label: "Full Name", required: true, max: 80 },
  { key: "headline", label: "Professional Headline", required: true, max: 200 },
  { key: "location", label: "Location", max: 80 },
  { key: "email", label: "Email Address", type: "email", max: 120 },
  {
    key: "intro",
    label: "Short Introduction",
    type: "textarea",
    rows: 3,
    max: 400,
    hint: "Shown in the hero section on the home page.",
  },
];

export const ABOUT_FIELDS = [
  {
    key: "about",
    label: "About Me",
    type: "textarea",
    rows: 7,
    required: true,
    max: 2000,
  },
  { key: "objective", label: "Career Objective", type: "textarea", rows: 3, max: 600 },
  {
    key: "bio",
    label: "Additional Biography",
    type: "textarea",
    rows: 5,
    max: 2000,
  },
  {
    key: "interests",
    label: "Personal Interests (technology related)",
    type: "textarea",
    rows: 3,
    max: 600,
  },
  { key: "goals", label: "Career Goals", type: "textarea", rows: 3, max: 600 },
];