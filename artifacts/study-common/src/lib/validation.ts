// =============================================================
// Zod schemas for every form. Kept in one place so rules are easy
// to read and reuse.
// =============================================================
import { z } from "zod";
import { uniFromEmail } from "@/data/universities";
import { spaceById } from "@/data/spaces";
import { dayOffset } from "@/data/seed";

export const emailSchema = z
  .string()
  .trim()
  .email("That does not look like an email address.")
  .refine((e) => !!uniFromEmail(e), "Use an email ending in ucl.ac.uk, kcl.ac.uk, imperial.ac.uk, lse.ac.uk or qmul.ac.uk.");

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Add at least 2 characters.").max(40),
  course: z.string().trim().min(2, "What do you study?").max(60),
  year: z.string().min(1, "Pick a year."),
  funFact: z.string().trim().min(3, "A tiny fun fact helps break the ice.").max(120),
  lookingFor: z.array(z.string()).min(1, "Pick at least one."),
});

export const groupSchema = z.object({
  name: z.string().trim().min(3, "Name needs 3+ characters.").max(50),
  topic: z.string().trim().min(2, "Add a topic.").max(40),
  description: z.string().trim().min(10, "Say a little more (10+ characters).").max(240),
  spaceId: z.string().refine((id) => !!spaceById(id), "Pick a space."),
  schedule: z.string().trim().min(3, "When do you meet?").max(60),
  capacity: z.coerce.number().int().min(2, "At least 2.").max(6, "Groups are capped at 6."),
  contact: z.string().trim().min(3, "Add a fictional contact for members.").max(80),
});

const time = /^([01]\d|2[0-3]):[0-5]\d$/;
export const sessionSchema = z
  .object({
    title: z.string().trim().min(3, "Title needs 3+ characters.").max(60),
    spaceId: z.string().refine((id) => spaceById(id)?.access !== "uni-only" && !!spaceById(id), "Sessions must be at a venue open to the public."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.").refine((d) => d >= dayOffset(0), "Date cannot be in the past."),
    start: z.string().regex(time, "Pick a start time."),
    end: z.string().regex(time, "Pick an end time."),
    capacity: z.coerce.number().int().min(2).max(12),
    note: z.string().max(140),
  })
  .refine((v) => v.end > v.start, { path: ["end"], message: "End must be after start." });

/** Turn a zod error into { field: message } for inline display. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
