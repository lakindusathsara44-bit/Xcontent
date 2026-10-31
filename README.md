# Xcontent

A dark, responsive **non-explicit front-end concept prototype** for a public video discovery and creator membership platform.

## Public browsing experience
- `index.html` — first-visit age-prompt mock-up followed by public video discovery
- `watch.html` — sample video player with local demo reactions, comments and report form
- Public demo browsing does not require login
- Search and category filters work on sample video cards

## Creator tools
- `creator/index.html` — creator workspace concept
- Local video preview accepts MP4, WebM and Ogg files up to 100 MB; it uses a temporary browser object URL only. The file is not uploaded, saved or published.
- YouTube and Vimeo URLs can load a non-explicit demo embed preview for videos the user owns or is authorised to share.
- The creator tool recognises Pornhub, XVideos, RedTube and XNXX video-page URLs and provides a direct link to the source page. Their external players are deliberately not loaded in this non-explicit prototype.
- Provider recognition is not embed permission. Any production integration must use the provider's official embed code and pass current provider-term, copyright, legal, age/consent, privacy and security reviews.

## Shared assets
- `assets/css/styles.css` — shared theme, responsive layouts and component styles
- `assets/js/loader.js` — page loading animation
- `assets/js/app.js` — navigation, age prompt, search, local interactions and local preview tools
- `assets/js/auth.js` — client-side demo-only form flow

## Run locally
No build tools or dependencies are required. Clone or download the repository and open `index.html` in a modern browser. GitHub Pages can serve this static prototype once Pages is configured.

## Important limitations
This is a **non-explicit UI prototype only**. The age prompt is a session-only interface demonstration; it does not verify age or provide legally sufficient age assurance.

Likes, dislikes, comments and reports are stored only in the current browser's local storage for the sample video. They are not sent to a server, shared with other visitors or delivered to moderators. Local video preview never transmits the selected file. No backend, real authentication, database, public upload pipeline, moderation queue, subscription or payment processing exists.

The demo uses public sample photos from Unsplash and a public sample video from MDN. External media availability and terms are controlled by those providers. Only YouTube/Vimeo embed URL formats are accepted in the creator preview.

Do not enter real passwords, identity documents or private media. Before any real-world launch, obtain jurisdiction-specific legal advice and implement independently assessed age assurance, uploader verification, documented consent and rights checks, privacy safeguards, moderation/reporting workflows, secure media processing, security controls and explicit payment-provider approval. A foreign hosting provider or company does not automatically remove obligations in places where the service is operated or accessed.

## Suggested next milestones
1. Browser and accessibility testing on desktop and mobile
2. Design and threat-model a backend without enabling real uploads or payments
3. Independent legal, privacy, age-assurance and payment-provider review before production functionality
