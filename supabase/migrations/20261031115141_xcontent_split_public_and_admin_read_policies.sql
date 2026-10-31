drop policy if exists "Published videos are public" on public.videos;
create policy "Published videos are public to visitors"
on public.videos for select
to anon
using (status = 'published');
create policy "Published videos and admin drafts are visible to signed-in users"
on public.videos for select
to authenticated
using (status = 'published' or (select private.is_site_admin()));
