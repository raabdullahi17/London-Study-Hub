StudyApp: Russell Group London

One app for Russell Group students in London to find a place to study and people to study with.

Built for the University Equality Hackathon (21 November 2026). Theme: helping every student make the most of university, whatever their starting point.

What it does

	•	Sign-up: uni email check (UCL, King's, Imperial, LSE, Queen Mary) plus a 6-digit code
	•	Profile: course, uni, year, optional gender, fun fact, contact preference, what you're looking for
	•	Study spaces: filters (free, quiet, open late, wifi and plugs, near a station, group-friendly, silent, bookable rooms), crowd level, schematic map
	•	Study groups: browse by type, join with one tap, create your own, capped at 6 people
	•	Find your people: suggestions by course, year and what you're looking for, with a fun-fact starter
	•	Sessions: post "I'm at the library 2-5pm" and let others drop in
	•	Safety: contact details only shown after both students agree, report and block buttons

Run it

No install needed. Open index.html in a browser.

Put it online with GitHub Pages

	1.	Create a new repository on GitHub and upload index.html and README.md.
	2.	Go to Settings > Pages.
	3.	Under Build and deployment, choose Deploy from a branch, pick main and / (root), then save.
	4.	Your app will be live at https://<your-username>.github.io/<repo-name>/ after a minute or two.

Demo flow (under 3 minutes)

	1.	Sign up with an email like you@qmul.ac.uk (the code appears on screen in demo mode) and fill in your profile.
	2.	Spaces: tap Quiet, Free and Open late and watch the map and list update.
	3.	Groups: join a group for your module.
	4.	Sessions: post a session, then drop in on another student's.

This is a prototype

	•	All spaces, students, groups and sessions are sample data.
	•	Nothing is saved when you refresh the page.
	•	The email code is shown on screen. No email is sent.
	•	"Say hi" is accepted automatically after 1.5 seconds to show the contact reveal.
	•	The map is a schematic drawing, not a live map.

Next steps

	•	Backend with real email verification and accounts (for example Supabase or Firebase)
	•	Live map (Leaflet or Google Maps) and real opening hours
	•	Real two-way connection requests and moderation
	•	Pilot with the five universities, then expand to all London universities

Files

	•	index.html: the whole app (HTML, CSS and JavaScript in one file)
	•	README.md: this file
