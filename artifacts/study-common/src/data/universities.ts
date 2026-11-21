// =============================================================
// The five London Russell Group universities in this demo.
// `domains` drive email validation on /join.
// `color` is each uni's "line colour" on the map and badges.
// =============================================================
import type { UniId } from "@/store/types";

export interface University {
  id: UniId;
  name: string;
  short: string;
  domains: string[];
  color: string;
}

export const UNIVERSITIES: University[] = [
  { id: "ucl", name: "University College London", short: "UCL", domains: ["ucl.ac.uk"], color: "#6B4E8E" },
  { id: "kcl", name: "King's College London", short: "King's", domains: ["kcl.ac.uk"], color: "#1E7A8C" },
  { id: "imperial", name: "Imperial College London", short: "Imperial", domains: ["imperial.ac.uk", "ic.ac.uk"], color: "#2B3F86" },
  { id: "lse", name: "London School of Economics", short: "LSE", domains: ["lse.ac.uk"], color: "#B23A48" },
  { id: "qmul", name: "Queen Mary University of London", short: "Queen Mary", domains: ["qmul.ac.uk"], color: "#C07A12" },
];

export const uniById = (id: string) => UNIVERSITIES.find((u) => u.id === id);

/** Returns the matching university for an email, or undefined. Subdomains (e.g. live.ucl.ac.uk) count. */
export function uniFromEmail(email: string): University | undefined {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return undefined;
  return UNIVERSITIES.find((u) => u.domains.some((d) => domain === d || domain.endsWith("." + d)));
}

export const YEARS = ["Foundation", "Year 1", "Year 2", "Year 3", "Year 4+", "Masters", "PhD"];
