# Xcontent

A dark-themed, responsive **front-end concept prototype** for a creator membership platform.

## Pages

- `index.html` — public homepage and platform overview
- `creator/index.html` — creator workspace concept
- `viewer/index.html` — viewer/member area concept
- `auth/login.html` — animated demo login page
- `auth/register.html` — animated demo registration page

## Shared assets

- `assets/css/styles.css` — shared theme, responsive layout and animations
- `assets/js/loader.js` — page loading animation
- `assets/js/app.js` — mobile navigation and demo toast messages
- `assets/js/auth.js` — client-side demo-only form flow

## Run locally

No build tools or dependencies are required. Download or clone the repository and open `index.html` in a modern browser. GitHub Pages can also serve this static prototype.

## Current limitations

This is a **non-explicit UI prototype only**. It has no backend, real authentication, database, file uploads, subscriptions, messaging or payment processing. Forms use fictional values and do not send or persist them. Do not enter real passwords, identity documents or private media.

Before any real-world launch, obtain jurisdiction-specific legal advice and implement appropriate privacy, age/identity assurance, consent, moderation, security and payment-provider approval controls. A simple age checkbox is not a sufficient age-verification system.

## Suggested next milestones

1. Accessibility and browser testing
2. Design system and reusable components
3. Backend architecture and secure authentication
4. Privacy-by-design data model and moderation/reporting workflows
5. Legal and payment-provider review before production functionality
