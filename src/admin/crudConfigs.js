const SKILL_ICONS = [
  { value: "code", label: "Code" },
  { value: "layout", label: "Layout" },
  { value: "globe", label: "Globe" },
  { value: "database", label: "Database" },
  { value: "server", label: "Server" },
  { value: "terminal", label: "Terminal" },
  { value: "git", label: "Git" },
  { value: "wrench", label: "Tools" },
  { value: "palette", label: "Design" },
  { value: "cpu", label: "Cpu" },
];

const LINK_ICONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "upwork", label: "Upwork" },
  { value: "freelancer", label: "Freelancer" },
  { value: "internee", label: "Internee.pk" },
  { value: "mail", label: "Email" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "stackoverflow", label: "Stack Overflow" },
  { value: "codepen", label: "CodePen" },
  { value: "leetcode", label: "LeetCode" },
  { value: "blog", label: "Personal Blog" },
  { value: "link", label: "Other" },
];

const s = (name, category, icon) => ({ name, category, icon, description: "" });

export const SKILLS_CONFIG = {
  collection: "skills",
  singular: "Skill",
  addLabel: "+ Add Skill",
  fields: [
    { key: "name", label: "Skill Name", required: true, max: 60 },
    {
      key: "category",
      label: "Category",
      required: true,
      max: 60,
      suggestions: ["Frontend Development", "Programming", "Backend and Database", "Tools"],
      hint: "Skills with the same category are grouped together.",
    },
    { key: "icon", label: "Icon", type: "select", options: SKILL_ICONS },
    { key: "description", label: "Short Description (optional)", max: 140 },
  ],
  title: (i) => i.name,
  subtitle: (i) => [i.category, i.description].filter(Boolean).join(" · "),
  seed: [
    s("HTML5", "Frontend Development", "code"),
    s("CSS3", "Frontend Development", "palette"),
    s("JavaScript", "Frontend Development", "code"),
    s("React.js", "Frontend Development", "layout"),
    s("Vite", "Frontend Development", "terminal"),
    s("Responsive Web Design", "Frontend Development", "layout"),
    s("C++", "Programming", "cpu"),
    s("JavaScript", "Programming", "code"),
    s("Appwrite", "Backend and Database", "server"),
    s("Authentication", "Backend and Database", "server"),
    s("Database Integration", "Backend and Database", "database"),
    s("Git", "Tools", "git"),
    s("GitHub", "Tools", "git"),
    s("Visual Studio Code", "Tools", "wrench"),
    s("GitHub Copilot", "Tools", "wrench"),
    s("npm", "Tools", "terminal"),
  ],
};

export const EDUCATION_CONFIG = {
  collection: "education",
  singular: "Education",
  addLabel: "+ Add Education",
  fields: [
    { key: "degree", label: "Degree / Course", required: true, max: 120 },
    { key: "institution", label: "Institution", required: true, max: 160 },
    { key: "session", label: "Session", max: 40, placeholder: "e.g. 2019–2023" },
    { key: "graduationYear", label: "Graduation Year", max: 20, placeholder: "e.g. 2025" },
    { key: "details", label: "Details (optional)", type: "textarea", rows: 3, max: 600 },
  ],
  title: (i) => i.degree,
  subtitle: (i) =>
    [i.institution, i.session, i.graduationYear && `Graduated ${i.graduationYear}`]
      .filter(Boolean)
      .join(" · "),
  seed: [
    {
      degree: "BS Computer Science",
      institution: "Government College University Faisalabad (GCUF)",
      session: "2019–2023",
      graduationYear: "2025",
      details: "",
    },
  ],
};

export const EXPERIENCE_CONFIG = {
  collection: "experience",
  singular: "Experience",
  addLabel: "+ Add Experience",
  fields: [
    { key: "organization", label: "Company / Organization", required: true, max: 160 },
    { key: "position", label: "Position", required: true, max: 120 },
    {
      key: "type",
      label: "Employment Type",
      type: "select",
      options: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
    },
    { key: "startDate", label: "Start Date", max: 40, placeholder: "e.g. Jan 2023" },
    { key: "endDate", label: "End Date", max: 40, placeholder: "e.g. Present" },
    {
      key: "responsibilities",
      label: "Responsibilities",
      type: "textarea",
      rows: 6,
      max: 1500,
      hint: "Write one responsibility per line.",
    },
    {
      key: "achievements",
      label: "Achievements",
      type: "textarea",
      rows: 4,
      max: 1000,
      hint: "One per line. Leave empty if you have none to list.",
    },
  ],
  title: (i) => i.position,
  subtitle: (i) =>
    [i.organization, i.type, [i.startDate, i.endDate].filter(Boolean).join(" – ")]
      .filter(Boolean)
      .join(" · "),
  seed: [
    {
      organization: "Bradford Model Science School, Khanewal",
      position: "Teacher of Technology and Industry",
      type: "",
      startDate: "",
      endDate: "",
      responsibilities: [
        "Teach technology and industry related subjects to students",
        "Explain technical and computer concepts in a clear, simple way",
        "Communicate regularly with students and colleagues",
        "Plan lessons and organize classroom activities and learning materials",
        "Help students solve practical problems and build confidence with technology",
      ].join("\n"),
      achievements: "",
    },
  ],
};

export const LINKS_CONFIG = {
  collection: "links",
  singular: "Profile Link",
  addLabel: "+ Add Social Link",
  fields: [
    { key: "name", label: "Platform Name", required: true, max: 60 },
    { key: "icon", label: "Icon", type: "select", options: LINK_ICONS },
    {
      key: "url",
      label: "Profile URL",
      type: "url",
      max: 400,
      placeholder: "https://...",
      hint: "Links with an empty URL are hidden on the website until you add one.",
    },
  ],
  title: (i) => i.name,
  subtitle: (i) => i.url || "No URL yet (hidden on website)",
  seed: [
    {
      name: "LinkedIn",
      icon: "linkedin",
      url: "https://www.linkedin.com/in/muzammil-hussain-55268a277",
    },
    {
      name: "GitHub",
      icon: "github",
      url: "https://github.com/Muzammil-Developer-Git",
    },
    {
      name: "Upwork",
      icon: "upwork",
      url: "https://www.upwork.com/freelancers/~0116179b3e15fb438d?mp_source=share",
    },
    { name: "Freelancer", icon: "freelancer", url: "" },
    { name: "Internee.pk", icon: "internee", url: "" },
    { name: "Email", icon: "mail", url: "mailto:muzammil1321059@gmail.com" },
  ],
};

export const SERVICES_CONFIG = {
  collection: "services",
  singular: "Service",
  addLabel: "+ Add Service",
  fields: [
    { key: "title", label: "Service Name", required: true, max: 80 },
    { key: "description", label: "Short Description (optional)", type: "textarea", rows: 3, max: 300 },
  ],
  title: (i) => i.title,
  subtitle: (i) => i.description || "",
  seed: [
    "Frontend Web Development",
    "React.js Development",
    "Responsive Website Development",
    "Website UI Development",
    "Basic Website Maintenance",
  ].map((title) => ({ title, description: "" })),
};

export const PROJECTS_CONFIG = {
  collection: "projects",
  singular: "Project",
  addLabel: "+ Add Project",
  fields: [
    { key: "title", label: "Project Title", required: true, max: 100 },
    {
      key: "category",
      label: "Project Category",
      max: 60,
      suggestions: ["Web Application", "Frontend Project", "Mobile App", "Other"],
    },
    {
      key: "badge",
      label: "Highlight Label (optional)",
      max: 40,
      placeholder: "e.g. Final Year Project",
    },
    { key: "description", label: "Description", type: "textarea", rows: 4, required: true, max: 800 },
    {
      key: "technologies",
      label: "Technologies Used",
      max: 200,
      hint: "Separate with commas, e.g. React.js, Vite, CSS",
    },
    {
      key: "features",
      label: "Key Features",
      type: "textarea",
      rows: 6,
      max: 1200,
      hint: "One feature per line.",
    },
    { key: "githubUrl", label: "GitHub Repository URL", type: "url", max: 300, placeholder: "https://github.com/..." },
    { key: "liveUrl", label: "Live Website URL", type: "url", max: 300, placeholder: "https://..." },
    { key: "featured", type: "checkbox", label: "Featured project (shown first and larger)" },
    {
      key: "image",
      label: "Main Screenshot",
      type: "image",
      maxWidth: 900,
      maxChars: 110000,
      hint: "JPG, PNG or WebP. It is resized and compressed automatically.",
    },
    {
      key: "gallery",
      label: "Gallery Images (up to 3)",
      type: "images",
      max: 3,
      maxWidth: 800,
      maxChars: 90000,
    },
  ],
  title: (i) => i.title,
  subtitle: (i) =>
    [i.category, i.featured && "Featured", i.technologies].filter(Boolean).join(" · "),
  seed: [
    {
      title: "Smart Service Hub",
      category: "Web Application",
      badge: "Final Year Project",
      description:
        "A web-based local service provider booking and management platform connecting customers with local service providers.",
      technologies: "React.js, Vite, JavaScript, CSS, Appwrite, GitHub",
      features: [
        "Customer registration and login",
        "Service provider registration",
        "Admin approval system",
        "Provider listings",
        "Search and filtering",
        "Booking requests",
        "Booking status management",
        "Customer dashboard",
        "Provider dashboard",
      ].join("\n"),
      githubUrl: "https://github.com/Muzammil-Developer-Git/smart-service-hub",
      liveUrl: "https://muzammil-developer-git.github.io/smart-service-hub/",
      featured: true,
      image: "",
      gallery: [],
    },
    {
      title: "Real-Time Chat Interface",
      category: "Frontend Project",
      badge: "",
      description:
        "A frontend chat interface with message sending, timestamps, local storage, and interactive user interface. This is a frontend-only project: messages are stored in the browser and there is no backend or multi-user messaging.",
      technologies: "",
      features: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      image: "",
      gallery: [],
    },
    {
      title: "Weather Application",
      category: "Frontend Project",
      badge: "",
      description:
        "A weather application with city search, temperature, humidity, weather conditions, weather icons, and invalid-city error handling.",
      technologies: "",
      features: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      image: "",
      gallery: [],
    },
    {
      title: "Drag and Drop File Uploader",
      category: "Frontend Project",
      badge: "",
      description:
        "A file uploader supporting JPG, PNG, and GIF images, image previews, upload progress, and local storage.",
      technologies: "",
      features: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      image: "",
      gallery: [],
    },
    {
      title: "Multi-Step Form",
      category: "Frontend Project",
      badge: "",
      description:
        "A responsive multi-step form with validation and navigation between different steps.",
      technologies: "",
      features: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      image: "",
      gallery: [],
    },
  ],
};

export const CERTIFICATES_CONFIG = {
  collection: "certificates",
  singular: "Certificate",
  addLabel: "+ Add Certificate",
  fields: [
    { key: "title", label: "Certificate Title", required: true, max: 140 },
    { key: "issuer", label: "Issuing Organization", required: true, max: 140 },
    { key: "issueDate", label: "Issue Date", max: 40, placeholder: "e.g. March 2024" },
    { key: "credentialUrl", label: "Credential URL (optional)", type: "url", max: 300, placeholder: "https://..." },
    {
      key: "file",
      label: "Certificate File",
      type: "file",
      maxPdfKB: 500,
      hint: "Image (JPG, PNG, WebP) or PDF up to 500 KB.",
    },
  ],
  title: (i) => i.title,
  subtitle: (i) => [i.issuer, i.issueDate].filter(Boolean).join(" · "),
  seed: [],
};

export const DOCUMENTS_CONFIG = {
  collection: "documents",
  singular: "Document",
  addLabel: "+ Add Document",
  fields: [
    { key: "title", label: "Document Title", required: true, max: 140 },
    { key: "description", label: "Short Description (optional)", type: "textarea", rows: 3, max: 300 },
    {
      key: "file",
      label: "Document File",
      type: "file",
      required: true,
      maxPdfKB: 500,
      hint: "Image (JPG, PNG, WebP) or PDF up to 500 KB.",
    },
  ],
  title: (i) => i.title,
  subtitle: (i) => i.description || "",
  seed: [],
};

export const CRUD_CONFIGS = {
  skills: SKILLS_CONFIG,
  education: EDUCATION_CONFIG,
  experience: EXPERIENCE_CONFIG,
  links: LINKS_CONFIG,
  freelance: SERVICES_CONFIG,
  projects: PROJECTS_CONFIG,
  certificates: CERTIFICATES_CONFIG,
  documents: DOCUMENTS_CONFIG,
};