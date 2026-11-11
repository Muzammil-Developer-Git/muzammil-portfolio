import { Mail, Globe } from "lucide-react";

const MONO = {
  linkedin: "in",
  github: "GH",
  upwork: "Up",
  freelancer: "Fr",
  internee: "In",
  facebook: "f",
  instagram: "Ig",
  youtube: "YT",
  stackoverflow: "SO",
  codepen: "CP",
  leetcode: "LC",
};

export default function BrandIcon({ name, small = false }) {
  const cls = "brand-badge" + (small ? " sm" : "");
  if (name === "mail") {
    return (
      <span className={cls}>
        <Mail size={small ? 16 : 20} />
      </span>
    );
  }
  if (MONO[name]) return <span className={cls}>{MONO[name]}</span>;
  return (
    <span className={cls}>
      <Globe size={small ? 16 : 20} />
    </span>
  );
}