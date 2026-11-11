import usePortfolio from "../lib/usePortfolio";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Education from "../sections/Education";
import Experience from "../sections/Experience";
import Projects from "../sections/Projects";
import Certificates from "../sections/Certificates";
import Connect from "../sections/Connect";
import Freelance from "../sections/Freelance";
import Resume from "../sections/Resume";
import Contact from "../sections/Contact";

export default function PublicSite() {
  const d = usePortfolio();

  if (d.loading) {
    return <div className="center-screen muted">Loading...</div>;
  }

  const hasUpwork = d.links.some((l) => l.icon === "upwork" && l.url);
  const p = d.profile;

  const nav = [
    { id: "home", label: "Home" },
    (p.about || p.objective || p.goals || p.interests || p.bio) && { id: "about", label: "About" },
    d.skills.length > 0 && { id: "skills", label: "Skills" },
    d.education.length > 0 && { id: "education", label: "Education" },
    d.experience.length > 0 && { id: "experience", label: "Experience" },
    d.projects.length > 0 && { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    d.links.some((l) => l.url) && { id: "connect", label: "Connect" },
    (d.services.length > 0 || hasUpwork) && { id: "freelance", label: "Freelance" },
    d.cvInfo && { id: "resume", label: "CV" },
    { id: "contact", label: "Contact" },
  ].filter(Boolean);

  return (
    <>
      <Navbar name={p.fullName} items={nav} />
      <main>
        <Hero
          profile={p}
          photo={d.photo}
          links={d.links}
          hasProjects={d.projects.length > 0}
          cvInfo={d.cvInfo}
        />
        <About profile={p} />
        <Skills skills={d.skills} />
        <Education items={d.education} />
        <Experience items={d.experience} />
        <Projects projects={d.projects} />
        <Certificates items={d.certificates} />
        <Connect links={d.links} />
        <Freelance services={d.services} skills={d.skills} links={d.links} />
        <Resume info={d.cvInfo} />
        <Contact profile={p} />
      </main>
      <Footer name={p.fullName} links={d.links} />
    </>
  );
}