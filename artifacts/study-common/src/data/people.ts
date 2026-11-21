// =============================================================
// Fictional sample students. NOT real people.
// Contact handles all use example.com or obviously fake handles.
// =============================================================
import type { ContactPref, LookingFor, Person } from "@/store/types";

export const PEOPLE: Person[] = [
  { id: "p-amara", name: "Amara O.", uni: "kcl", course: "Nursing", year: "Year 2", funFact: "Once queued 4 hours for a bao. Worth it.", lookingFor: ["study-buddy", "commute-buddy"], contact: "email", contactHandle: "amara.sample@example.com", commute: "Croydon, Southern rail" },
  { id: "p-tomasz", name: "Tomasz K.", uni: "imperial", course: "Mechanical Engineering", year: "Year 3", funFact: "Builds tiny bridges out of spaghetti for fun.", lookingFor: ["study-group", "accountability"], contact: "discord", contactHandle: "tomasz-demo@example.com", commute: "Ealing, Elizabeth line" },
  { id: "p-zainab", name: "Zainab R.", uni: "qmul", course: "Computer Science", year: "Year 1", funFact: "Knows every stop on the District line in order.", lookingFor: ["friends", "study-group"], contact: "whatsapp", contactHandle: "zainab.sample@example.com", commute: "Ilford, Elizabeth line" },
  { id: "p-felix", name: "Felix W.", uni: "lse", course: "Economics", year: "Masters", funFact: "Has a sourdough starter named Keynes.", lookingFor: ["accountability", "study-buddy"], contact: "email", contactHandle: "felix.sample@example.com", commute: "Walthamstow, Victoria line" },
  { id: "p-mei", name: "Mei L.", uni: "ucl", course: "Architecture", year: "Year 2", funFact: "Sketches strangers' shoes on the Northern line.", lookingFor: ["friends", "study-buddy"], contact: "in-person", contactHandle: "mei.sample@example.com", commute: "Finchley, Northern line" },
  { id: "p-daniel", name: "Daniel A.", uni: "kcl", course: "Law", year: "Year 3", funFact: "Debated a goose once. Lost.", lookingFor: ["study-group"], contact: "email", contactHandle: "daniel.sample@example.com", commute: "Lewisham, DLR" },
  { id: "p-sofia", name: "Sofia M.", uni: "ucl", course: "Computer Science", year: "Year 2", funFact: "Speedruns crosswords on the Overground.", lookingFor: ["study-buddy", "accountability"], contact: "discord", contactHandle: "sofia-demo@example.com", commute: "Highbury, Overground" },
  { id: "p-ravi", name: "Ravi P.", uni: "imperial", course: "Biochemistry", year: "PhD", funFact: "Keeps a spreadsheet of London's best samosas.", lookingFor: ["friends"], contact: "email", contactHandle: "ravi.sample@example.com", commute: "Harrow, Metropolitan line" },
  { id: "p-chloe", name: "Chloe B.", uni: "lse", course: "International Relations", year: "Year 1", funFact: "Learning Portuguese via football commentary.", lookingFor: ["friends", "commute-buddy"], contact: "whatsapp", contactHandle: "chloe.sample@example.com", commute: "Stratford, Central line" },
  { id: "p-kwame", name: "Kwame D.", uni: "qmul", course: "Medicine", year: "Year 4+", funFact: "Plays the trumpet, badly, enthusiastically.", lookingFor: ["study-group", "accountability"], contact: "email", contactHandle: "kwame.sample@example.com", commute: "Barking, District line" },
];

export const personById = (id: string) => PEOPLE.find((p) => p.id === id);

export const LOOKING_FOR_LABEL: Record<LookingFor, string> = {
  "study-buddy": "Study buddy",
  "study-group": "Study group",
  "commute-buddy": "Commute buddy",
  accountability: "Accountability",
  friends: "New friends",
};

export const CONTACT_LABEL: Record<ContactPref, string> = {
  email: "Email",
  discord: "Discord",
  whatsapp: "WhatsApp",
  "in-person": "Say hi in person",
};
