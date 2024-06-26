create table "public"."codewars_integration" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "username" character varying not null,
    "honor" bigint not null default '0'::bigint
);


alter table "public"."codewars_integration" enable row level security;

create table "public"."experience_events" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" character varying not null,
    "experience_value" bigint not null
);


alter table "public"."experience_events" enable row level security;

create table "public"."github_integration" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "github_name" character varying not null,
    "github_id" character varying not null,
    "user_id" uuid not null,
    "commit_count" bigint not null default '0'::bigint
);


alter table "public"."github_integration" enable row level security;

create table "public"."profile" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "display_name" character varying not null,
    "total_experience" bigint not null default '0'::bigint
);


alter table "public"."profile" enable row level security;

CREATE UNIQUE INDEX codewars_integration_pkey ON public.codewars_integration USING btree (user_id);

CREATE UNIQUE INDEX codewars_integration_username_key ON public.codewars_integration USING btree (username);

CREATE UNIQUE INDEX experience_events_name_key ON public.experience_events USING btree (name);

CREATE UNIQUE INDEX experience_events_pkey ON public.experience_events USING btree (id);

CREATE UNIQUE INDEX github_integration_github_id_key ON public.github_integration USING btree (github_id);

CREATE UNIQUE INDEX github_integration_github_name_key ON public.github_integration USING btree (github_name);

CREATE UNIQUE INDEX github_integration_pkey ON public.github_integration USING btree (id);

CREATE UNIQUE INDEX github_integration_user_id_key ON public.github_integration USING btree (user_id);

CREATE UNIQUE INDEX profile_display_name_key ON public.profile USING btree (display_name);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX profile_user_id_key ON public.profile USING btree (user_id);

alter table "public"."codewars_integration" add constraint "codewars_integration_pkey" PRIMARY KEY using index "codewars_integration_pkey";

alter table "public"."experience_events" add constraint "experience_events_pkey" PRIMARY KEY using index "experience_events_pkey";

alter table "public"."github_integration" add constraint "github_integration_pkey" PRIMARY KEY using index "github_integration_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."codewars_integration" add constraint "codewars_integration_username_key" UNIQUE using index "codewars_integration_username_key";

alter table "public"."codewars_integration" add constraint "public_codewars_integration_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."codewars_integration" validate constraint "public_codewars_integration_id_fkey";

alter table "public"."experience_events" add constraint "experience_events_name_key" UNIQUE using index "experience_events_name_key";

alter table "public"."github_integration" add constraint "github_integration_github_id_key" UNIQUE using index "github_integration_github_id_key";

alter table "public"."github_integration" add constraint "github_integration_github_name_key" UNIQUE using index "github_integration_github_name_key";

alter table "public"."github_integration" add constraint "github_integration_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."github_integration" validate constraint "github_integration_user_id_fkey";

alter table "public"."github_integration" add constraint "github_integration_user_id_key" UNIQUE using index "github_integration_user_id_key";

alter table "public"."profile" add constraint "profile_display_name_key" UNIQUE using index "profile_display_name_key";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

alter table "public"."profile" add constraint "profile_user_id_key" UNIQUE using index "profile_user_id_key";

grant delete on table "public"."codewars_integration" to "anon";

grant insert on table "public"."codewars_integration" to "anon";

grant references on table "public"."codewars_integration" to "anon";

grant select on table "public"."codewars_integration" to "anon";

grant trigger on table "public"."codewars_integration" to "anon";

grant truncate on table "public"."codewars_integration" to "anon";

grant update on table "public"."codewars_integration" to "anon";

grant delete on table "public"."codewars_integration" to "authenticated";

grant insert on table "public"."codewars_integration" to "authenticated";

grant references on table "public"."codewars_integration" to "authenticated";

grant select on table "public"."codewars_integration" to "authenticated";

grant trigger on table "public"."codewars_integration" to "authenticated";

grant truncate on table "public"."codewars_integration" to "authenticated";

grant update on table "public"."codewars_integration" to "authenticated";

grant delete on table "public"."codewars_integration" to "service_role";

grant insert on table "public"."codewars_integration" to "service_role";

grant references on table "public"."codewars_integration" to "service_role";

grant select on table "public"."codewars_integration" to "service_role";

grant trigger on table "public"."codewars_integration" to "service_role";

grant truncate on table "public"."codewars_integration" to "service_role";

grant update on table "public"."codewars_integration" to "service_role";

grant delete on table "public"."experience_events" to "anon";

grant insert on table "public"."experience_events" to "anon";

grant references on table "public"."experience_events" to "anon";

grant select on table "public"."experience_events" to "anon";

grant trigger on table "public"."experience_events" to "anon";

grant truncate on table "public"."experience_events" to "anon";

grant update on table "public"."experience_events" to "anon";

grant delete on table "public"."experience_events" to "authenticated";

grant insert on table "public"."experience_events" to "authenticated";

grant references on table "public"."experience_events" to "authenticated";

grant select on table "public"."experience_events" to "authenticated";

grant trigger on table "public"."experience_events" to "authenticated";

grant truncate on table "public"."experience_events" to "authenticated";

grant update on table "public"."experience_events" to "authenticated";

grant delete on table "public"."experience_events" to "service_role";

grant insert on table "public"."experience_events" to "service_role";

grant references on table "public"."experience_events" to "service_role";

grant select on table "public"."experience_events" to "service_role";

grant trigger on table "public"."experience_events" to "service_role";

grant truncate on table "public"."experience_events" to "service_role";

grant update on table "public"."experience_events" to "service_role";

grant delete on table "public"."github_integration" to "anon";

grant insert on table "public"."github_integration" to "anon";

grant references on table "public"."github_integration" to "anon";

grant select on table "public"."github_integration" to "anon";

grant trigger on table "public"."github_integration" to "anon";

grant truncate on table "public"."github_integration" to "anon";

grant update on table "public"."github_integration" to "anon";

grant delete on table "public"."github_integration" to "authenticated";

grant insert on table "public"."github_integration" to "authenticated";

grant references on table "public"."github_integration" to "authenticated";

grant select on table "public"."github_integration" to "authenticated";

grant trigger on table "public"."github_integration" to "authenticated";

grant truncate on table "public"."github_integration" to "authenticated";

grant update on table "public"."github_integration" to "authenticated";

grant delete on table "public"."github_integration" to "service_role";

grant insert on table "public"."github_integration" to "service_role";

grant references on table "public"."github_integration" to "service_role";

grant select on table "public"."github_integration" to "service_role";

grant trigger on table "public"."github_integration" to "service_role";

grant truncate on table "public"."github_integration" to "service_role";

grant update on table "public"."github_integration" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

create policy "Kep actions to own data"
on "public"."codewars_integration"
as permissive
for all
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."github_integration"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all authenticated users"
on "public"."github_integration"
as permissive
for select
to authenticated
using (true);


create policy "Access own data"
on "public"."profile"
as permissive
for all
to authenticated
using ((auth.uid() = user_id));


create policy "Enable read access for all users"
on "public"."profile"
as permissive
for select
to public
using (true);



