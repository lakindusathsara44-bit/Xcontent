# Xcontent

A dark, responsive **non-explicit front-end concept prototype** for a public video discovery and creator membership platform.

## Public browsing experience

- `index.html` — first-visit age-prompt mock-up followed by a public video discovery homepage
- `watch.html` — sample public video player page
- Public demo browsing does not require login
- Search and category filters work on the local sample video cards
- Login and creator workspace remain secondary navigation destinations

## Other pages

- `creator/index.html` — creator workspace concept
- `viewer/index.html` — viewer/member area concept
- `auth/login.html` and `auth/register.html` — demo-only forms

## Shared assets

- `assets/css/styles.css` — shared theme, responsive layouts and animations
- `assets/js/loader.js` — page loading animation
- `assets/js/app.js` — navigation, demo age prompt, search and category filtering
- `assets/js/auth.js` — client-side demo-only form flow

## Run locally

No build tools or dependencies are required. Clone or download the repository and open `index.html` in a modern browser. GitHub Pages can also serve this static prototype once Pages is configured.

## Important limitations

This is a **non-explicit UI prototype only**. The age prompt is a simple session-only interface demonstration; it does not verify age, estimate age, or provide legally sufficient age assurance. It must not be used as the age-control system for a real age-restricted service.

The demo uses public sample photos from Unsplash and a public sample video from MDN. External media availability and terms are controlled by those providers.

There is no backend, real authentication, database, upload pipeline, subscription, messaging or payment processing. Forms do not send or persist data. Do not enter real passwords, identity documents or private media.

Before any real-world launch, obtain jurisdiction-specific legal advice and implement independently assessed age assurance, uploader age/identity verification, documented consent and rights checks, privacy safeguards, moderation/reporting, security controls and explicit payment-provider approval. A foreign hosting provider or company does not automatically remove obligations in places where the service is operated or accessed.

## Suggested next milestones

1. Browser and accessibility testing on desktop and mobile
2. Replace sample assets only with properly licensed, non-explicit test media
3. Design and threat-model the backend without enabling uploads or payments
4. Independent legal, privacy, age-assurance and payment-provider review before production functionality
