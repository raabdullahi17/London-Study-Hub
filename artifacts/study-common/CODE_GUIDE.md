# Study Common — code sections explained

This is the actual React/TypeScript application source, not a screenshot or Figma file. Open the files below in your editor to inspect and change the app. Section comments in the code identify the main responsibilities.

## 1. Starting the app

**`index.html`** contains the HTML document and search/social metadata.

**`src/main.tsx`** mounts React into the document and installs the top-level error boundary.

**`src/App.tsx`** connects application providers and routes. Start here to understand how the screens fit together.

## 2. Page design and reusable components

**`src/pages/`** contains the app's screens. Each page combines data, filtering and actions into a user interface.

**`src/components/`** contains reusable interface pieces, with primitive controls in `src/components/ui/`.

**`src/index.css`** controls the visual theme, typography, layout and responsive behaviour. Change this file to restyle the app.

**`src/hooks/use-page-meta.ts`** provides `usePageMeta(title, description)` to set screen-specific browser metadata.

## 3. Data structures

**`src/store/types.ts`** describes the data used throughout the app:

| Type | Purpose |
|---|---|
| `Profile` | Your local demo profile |
| `Person` | A fictional student used in the demo |
| `Space` | A study venue, facilities, access rules and map position |
| `Group` | A small study group and its member IDs |
| `Session` | A public-venue study session and its attendees |
| `AppState` | The complete state saved in this browser |

TypeScript catches mismatches between these structures and the rest of the app while developing.

## 4. Realistic sample content

| File | What to change |
|---|---|
| `src/data/spaces.ts` | Venue descriptions, facilities and map positions |
| `src/data/people.ts` | Fictional student profiles and labels |
| `src/data/universities.ts` | The five universities, email domains and study years |
| `src/data/seed.ts` | Initial groups, sessions and browser state |

These are **sample records**, not a live directory, verified student list or live venue feed. Venue opening/access information must be checked before travel.

## 5. Search and filters

**`src/lib/space-filters.ts`** contains:

- `SpaceFilters`: the shape of the selected filters.
- `FLAG_LABELS`: names displayed for available filters.
- `applySpaceFilters(...)`: applies search and selected facilities to the venue list.

Keeping filtering separate from the screen makes it easier to understand and reuse.

## 6. Forms and validation

**`src/lib/validation.ts`** uses Zod schemas:

- `emailSchema`: checks an eligible university email format/domain.
- `profileSchema`: checks profile inputs.
- `groupSchema`: checks study-group inputs.
- `sessionSchema`: checks session inputs and timing.
- `fieldErrors(...)`: turns validation failures into form feedback.

**Important:** checking a domain does not prove that someone owns that address. The demo signup does not send email. Real authentication requires a server-side verification service.

## 7. Actions and rules

**`src/store/study-store.tsx`** is the main behaviour section. `StudyStoreProvider` makes state and actions available to screens through `useStudy()`.

| Actions | Behaviour |
|---|---|
| `saveProfile` | Save your demo profile |
| `toggleSavedSpace` | Save or unsave a venue |
| `createGroup`, `updateGroup`, `deleteGroup` | Manage your own groups |
| `joinGroup`, `leaveGroup` | Change group membership |
| `createSession`, `updateSession`, `deleteSession` | Manage your own sessions |
| `joinSession`, `leaveSession` | Change session attendance |
| `requestConnection`, `cancelConnection` | Demonstrate a connection request |
| `simulateAccept` | Explicitly simulate the other student's consent |
| `block`, `unblock`, `report` | Local demonstration of safety controls |
| `resetDemo` | Clear local demo changes |

`GROUP_MAX = 6` implements the small-group limit from the concept. Owner checks demonstrate which records the current demo participant may edit. **These browser checks are not security boundaries.**

The `commit(...)` section updates React state and attempts to save it. Storage problems are surfaced rather than silently claiming a successful permanent save.

## 8. Browser persistence

**`src/store/storage.ts`** contains:

```ts
loadState()   // Read this browser's saved demo state
saveState()   // Write changes to localStorage
clearState()  // Clear saved demo state
```

The storage key is `study-common:demo:v1`. Your source repository does not contain the data somebody entered in their browser.

Local storage is not encrypted, shared between users, or synced across devices. Do not use it for real students' sensitive contact details.

## 9. UI helpers

- `src/hooks/use-toast.ts`: action/error feedback.
- `src/hooks/use-mobile.tsx`: responsive viewport helper.
- `src/lib/utils.ts`: utility functions, including conditional CSS classes.
- `src/components/error-boundary.tsx`: catches rendering failures and provides recovery.

## 10. Which code goes to GitHub?

Use the **standalone source ZIP**, which includes this guide and a portable Vite configuration. Upload its extracted contents, including all of `src/`, configuration files and the README.

Do not copy just one page file: pages rely on the shared data, state, components and styling. See the exact upload checklist and Git commands in **README.md**.

The download intentionally excludes backend scaffolding, development-platform configuration, secrets, installed dependencies, generated builds and the uploaded concept document. It includes the code needed by this frontend demo.
