# Xcontent

A dark, responsive **non-explicit public video discovery prototype** with a Supabase-backed catalogue of authorised YouTube, Vimeo, Pornhub and XVideos embed links.

## Current implementation
- Public visitors can browse sample cards and owner-published links.
- `creator/index.html` is an owner workspace backed by Supabase Auth and Row Level Security.
- Only an account added to the private admin allowlist can create, publish, unpublish or delete links.
- URLs are parsed and converted into fixed official YouTube-nocookie, Vimeo, Pornhub or XVideos player URLs. Arbitrary iframe HTML is rejected.
- Public visitors can only read rows with `status = 'published'`.
- No media files are uploaded. Only metadata and provider URLs are stored.
- Pornhub and XVideos support is limited to their official embed-player URL patterns; the app does not scrape provider pages or import video catalogs.
- Likes, comments and reports remain local browser demos and are not sent to a moderation team.

## Supabase project
- Project ref: `oqyfvvwplvbmmursbpkd` (Singapore)
- Database migrations are stored in `supabase/migrations/`.
- Browser config uses the publishable key only. Never add a secret or service-role key to this repository.
- RLS is enabled on public video data and private admin tables.

## Owner account activation
1. Create your account at `auth/register.html` or in Supabase Authentication.
2. Add your exact account email to the private allowlist and grant the owner role in Supabase SQL Editor:

```sql
insert into private.admin_emails(email) values (lower('OWNER_EMAIL_HERE'))
on conflict do nothing;
insert into private.site_admins(user_id)
select id from auth.users where lower(email) = lower('OWNER_EMAIL_HERE')
on conflict do nothing;
```

3. Log in at `auth/login.html` and open Owner Studio.
4. Set the Supabase Auth Site URL and redirect allowlist to the deployed site URL. Registration now sends the confirmation link back to the site's `index.html`; that exact URL must be allowed in Supabase Auth → URL Configuration.

## Security and launch limitations
- Public client uses only a publishable key; database policies enforce access.
- No public insert/update/delete policies on videos.
- Admin membership is stored privately, not in user-editable metadata.
- Age prompt is not age verification.
- No media hosting/uploads, automated scraping, subscriptions or payments are enabled. Adult-content publication requires separate legal, age-assurance, consent, moderation and provider-terms review; a simple age prompt is not age verification.
- Before launch, review local law, copyright, provider terms, age assurance, uploader verification, consent, privacy, moderation, security and payment-provider approval.

## Run
Serve through GitHub Pages or a local static server. Supabase JS is loaded from a version-pinned CDN build.


## Regression tests
Run `node --test tests/*.test.cjs` with Node.js 18 or newer. These tests cover asynchronously loaded catalogue filtering and provider embed URL constraints.
