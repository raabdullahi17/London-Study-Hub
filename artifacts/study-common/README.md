# Study Common

**One app for Russell Group students in London to find a place to study and people to study with.**

Built from the supplied University Equality Hackathon concept. The five universities are UCL, King's College London, Imperial College London, LSE and Queen Mary University of London.

## What this version is

A working, browser-local hackathon demonstration built with React, TypeScript and Vite. It is not a live student network. Sample people, memberships, venue conditions and sessions are illustrative. Your changes are stored in this browser, not shared with other devices or people.

No API keys, backend server or database are required for the standalone source download.

## Run the standalone GitHub download

1. Install Node.js 22.12 or newer and pnpm.
2. Unzip `study-common-source.zip`.
3. Open a terminal inside the extracted `study-common` folder.
4. Run:

```sh
pnpm install
pnpm dev
```

Open the local address printed by Vite, normally `http://localhost:5173`.

```sh
pnpm typecheck  # Check TypeScript
pnpm build      # Create a production build in dist/
pnpm preview    # Preview the production build
```

The source download contains a standalone configuration. It does not require the surrounding development project's folders.

## Main sections

- **Study Spaces:** search, filter and explore London venues on a schematic map.
- **Study Groups:** discover small groups, create your own, join and leave.
- **Find Your People:** discover sample students and demonstrate consent-based contact sharing.
- **Sessions:** arrange study time at a public venue and join others.
- **Profile and onboarding:** edit study preferences and demonstrate a university-email signup flow.

Read **CODE_GUIDE.md** for the main implementation sections and where to change them.

## What to upload to GitHub

Create a new empty repository on GitHub. Upload **the contents of the extracted `study-common` folder**, rather than uploading the ZIP itself:

```text
src/                 Application code, pages, components, state and sample data
public/              Static assets, if present
index.html           HTML entry point
package.json         Dependencies and run commands
pnpm-lock.yaml       Include after pnpm install creates it
vite.config.ts       Portable development/build configuration
tsconfig.json        TypeScript configuration
.gitignore           Excludes dependencies, builds and secrets
.npmrc               Package release-age safety setting
README.md            This setup and GitHub guide
CODE_GUIDE.md        Annotated explanation of the code
```

GitHub's browser uploader may hide dotfiles. Using Git locally preserves them:

```sh
git init
git add .
git commit -m "Add Study Common hackathon demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example repository URL with the one shown by your new GitHub repository. No repository has been created or uploaded on your behalf.

**Do not upload:** `node_modules/`, `dist/`, `.env` files, API keys, passwords, browser storage exports, real student information, or the original concept PDF unless you want it publicly available and have permission to share it.

## Safety and demo limitations

- A matching university email domain is **not** proof of identity.
- The signup code flow is simulated; it does not send email or authenticate anyone.
- Requests and simulated acceptance do not communicate with real students.
- Reports and blocks affect this browser's demo only. No report is sent to a moderator.
- Contact examples are fictional; do not enter sensitive information in a shared demo.
- Maps are schematic, not navigation. Venue access, opening times and crowd information must be checked with the venue.
- A session post is not a venue or room booking.
- Clearing browser storage removes local changes. Other browsers and devices do not see them.

## Before launching with real students

Replace the demo signup with managed authentication and verified university email ownership. Add a server/database with access controls, genuine two-person consent checks, secure contact storage, moderated reporting, rate limits, privacy/deletion controls and verified venue information. Do not use browser-only checks to protect real student data.

## Hosting the standalone version

Deploy the contents of `dist/` to a static host after `pnpm build`. Configure the host to serve `index.html` for application routes so links such as `/groups` survive a refresh. GitHub stores your source; GitHub Pages hosting is a separate setup and is not automatically configured here. For a subdirectory host, set `BASE_PATH` to the deployment subdirectory when building.
