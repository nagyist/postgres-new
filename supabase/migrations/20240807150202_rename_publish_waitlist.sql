alter table public.publish_waitlist
rename to deploy_waitlist;

alter table public.deploy_waitlist rename constraint publish_waitlist_user_id_fkey to deploy_waitlist_user_id_fkey;