-- Extend the owner-managed catalogue to accept official Pornhub and XVideos embeds.
-- No scraping, media downloads, or third-party catalog imports are enabled.
alter table public.videos drop constraint if exists videos_provider_check;
alter table public.videos add constraint videos_provider_check
  check (provider in ('youtube','vimeo','pornhub','xvideos'));

alter table public.videos drop constraint if exists videos_embed_provider_check;
alter table public.videos add constraint videos_embed_provider_check
  check (
    (provider='youtube' and embed_url ~ '^https://www\\.youtube-nocookie\\.com/embed/[A-Za-z0-9_-]+$')
    or (provider='vimeo' and embed_url ~ '^https://player\\.vimeo\\.com/video/[0-9]+$')
    or (provider='pornhub' and embed_url ~ '^https://www\\.pornhub\\.com/embed/[A-Za-z0-9]{5,40}$')
    or (provider='xvideos' and embed_url ~ '^https://www\\.xvideos\\.com/embedframe/[0-9]{4,20}$')
  );

comment on column public.videos.provider is
  'Provider allowlist: youtube, vimeo, pornhub, xvideos. Embed URLs must match the provider-specific official player host and path.';
