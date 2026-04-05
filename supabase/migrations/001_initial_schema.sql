-- ============================================================
-- 001_initial_schema.sql
-- Marvelous — AI Bullying Detection App
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() if not already available
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type relationship_tag as enum ('Student', 'Coworker', 'Friend', 'Family');
create type meter_level      as enum ('safe', 'tension', 'targeted', 'bullying');
create type group_type       as enum ('classroom', 'workplace', 'friend_group', 'family');
create type member_role      as enum ('neutral', 'victim', 'bully', 'bystander', 'defender');
create type card_type        as enum ('victim', 'bully', 'bystander');
create type pause_outcome    as enum ('cancelled', 'rephrased', 'sent_anyway');

-- ============================================================
-- TABLE: users
-- Extends Supabase auth.users — one row per authenticated user
-- ============================================================

create table public.users (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  email               text        not null unique,
  name                text        not null,
  avatar_url          text,
  relationship_tag    relationship_tag,
  communication_score integer     not null default 50 check (communication_score between 0 and 100),
  safe_person_id      uuid        references public.users(id) on delete set null,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- TABLE: groups
-- ============================================================

create table public.groups (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  group_type   group_type  not null,
  created_by   uuid        not null references public.users(id) on delete restrict,
  no_exit_mode boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- TABLE: group_members
-- ============================================================

create table public.group_members (
  id           uuid        primary key default gen_random_uuid(),
  group_id     uuid        not null references public.groups(id) on delete cascade,
  user_id      uuid        not null references public.users(id) on delete cascade,
  member_role  member_role not null default 'neutral',
  is_defender  boolean     not null default false,
  joined_at    timestamptz not null default now(),
  unique (group_id, user_id)
);

-- ============================================================
-- TABLE: messages
-- ============================================================

create table public.messages (
  id         uuid        primary key default gen_random_uuid(),
  group_id   uuid        not null references public.groups(id) on delete cascade,
  sender_id  uuid        not null references public.users(id) on delete restrict,
  content    text        not null,
  is_flagged boolean     not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: message_analysis
-- One row per message; written server-side after batch analysis
-- ============================================================

create table public.message_analysis (
  id               uuid        primary key default gen_random_uuid(),
  message_id       uuid        not null unique references public.messages(id) on delete cascade,
  hostility_score  numeric(4,1) not null check (hostility_score  between 0 and 10),
  sarcasm_score    numeric(4,1) not null check (sarcasm_score    between 0 and 10),
  exclusion_score  numeric(4,1) not null check (exclusion_score  between 0 and 10),
  support_score    numeric(4,1) not null check (support_score    between 0 and 10),
  neutrality_score numeric(4,1) not null check (neutrality_score between 0 and 10),
  analyzed_at      timestamptz not null default now()
);

-- ============================================================
-- TABLE: conversation_snapshots
-- Written server-side after every batch analysis cycle
-- ============================================================

create table public.conversation_snapshots (
  id               uuid        primary key default gen_random_uuid(),
  group_id         uuid        not null references public.groups(id) on delete cascade,
  meter_level      meter_level not null,
  targeted_user_id uuid        references public.users(id) on delete set null,
  pattern_summary  text,
  people_involved  uuid[]      not null default '{}',
  detected_at      timestamptz not null default now()
);

-- ============================================================
-- TABLE: guidance_cards
-- Private — each user sees only their own cards
-- ============================================================

create table public.guidance_cards (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  group_id    uuid        not null references public.groups(id) on delete cascade,
  snapshot_id uuid        references public.conversation_snapshots(id) on delete set null,
  card_type   card_type   not null,
  content     text        not null,
  was_opened  boolean     not null default false,
  shown_at    timestamptz not null default now(),
  dismissed_at timestamptz
);

-- ============================================================
-- TABLE: score_history
-- ============================================================

create table public.score_history (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  score_delta integer     not null,
  reason      text        not null,
  group_id    uuid        references public.groups(id) on delete set null,
  recorded_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: evidence_vault
-- ============================================================

create table public.evidence_vault (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.users(id) on delete cascade,
  group_id     uuid        not null references public.groups(id) on delete restrict,
  snapshot_ids uuid[]      not null default '{}',
  is_exported  boolean     not null default false,
  locked_at    timestamptz not null default now(),
  exported_at  timestamptz
);

-- ============================================================
-- TABLE: bully_victim_flags
-- ============================================================

create table public.bully_victim_flags (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references public.users(id) on delete cascade,
  victim_group_id uuid       not null references public.groups(id) on delete cascade,
  bully_group_id  uuid       not null references public.groups(id) on delete cascade,
  resolved       boolean     not null default false,
  detected_at    timestamptz not null default now()
);

-- ============================================================
-- TABLE: pause_events
-- ============================================================

create table public.pause_events (
  id               uuid         primary key default gen_random_uuid(),
  user_id          uuid         not null references public.users(id) on delete cascade,
  group_id         uuid         not null references public.groups(id) on delete cascade,
  original_message text         not null,
  outcome          pause_outcome,
  triggered_at     timestamptz  not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_group_members_group_id  on public.group_members  (group_id);
create index idx_group_members_user_id   on public.group_members  (user_id);
create index idx_messages_group_id       on public.messages        (group_id);
create index idx_messages_sender_id      on public.messages        (sender_id);
create index idx_messages_created_at     on public.messages        (created_at);
create index idx_message_analysis_msg_id on public.message_analysis(message_id);
create index idx_conv_snapshots_group_id on public.conversation_snapshots(group_id);
create index idx_guidance_cards_user_id  on public.guidance_cards  (user_id);
create index idx_guidance_cards_group_id on public.guidance_cards  (group_id);
create index idx_score_history_user_id   on public.score_history   (user_id);
create index idx_score_history_group_id  on public.score_history   (group_id);
create index idx_evidence_vault_user_id  on public.evidence_vault  (user_id);
create index idx_evidence_vault_group_id on public.evidence_vault  (group_id);
create index idx_bully_flags_user_id     on public.bully_victim_flags(user_id);
create index idx_pause_events_user_id    on public.pause_events    (user_id);
create index idx_pause_events_group_id   on public.pause_events    (group_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users                  enable row level security;
alter table public.groups                 enable row level security;
alter table public.group_members          enable row level security;
alter table public.messages               enable row level security;
alter table public.message_analysis       enable row level security;
alter table public.conversation_snapshots enable row level security;
alter table public.guidance_cards         enable row level security;
alter table public.score_history          enable row level security;
alter table public.evidence_vault         enable row level security;
alter table public.bully_victim_flags     enable row level security;
alter table public.pause_events           enable row level security;

-- ------------------------------------------------------------
-- Helper: is the calling user a member of a given group?
-- Used inline in policies to keep them readable.
-- ------------------------------------------------------------
-- (Defined as a stable function to avoid repeated subqueries)
create or replace function public.is_group_member(gid uuid)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
-- Any authenticated user can view other users (needed for chat display).
create policy "users: authenticated users can view all"
  on public.users for select
  to authenticated
  using (true);

-- A user can only insert their own row (triggered after auth sign-up).
create policy "users: insert own row"
  on public.users for insert
  to authenticated
  with check (id = auth.uid());

-- A user can only update their own profile.
create policy "users: update own row"
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ------------------------------------------------------------
-- groups
-- ------------------------------------------------------------
-- Members can view groups they belong to.
create policy "groups: members can select"
  on public.groups for select
  to authenticated
  using (public.is_group_member(id));

-- Any authenticated user can create a group.
create policy "groups: authenticated users can create"
  on public.groups for insert
  to authenticated
  with check (created_by = auth.uid());

-- Only the creator can update or delete.
create policy "groups: creator can update"
  on public.groups for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "groups: creator can delete"
  on public.groups for delete
  to authenticated
  using (created_by = auth.uid());

-- ------------------------------------------------------------
-- group_members
-- ------------------------------------------------------------
-- Members can see who else is in their groups.
create policy "group_members: members can select"
  on public.group_members for select
  to authenticated
  using (public.is_group_member(group_id));

-- Authenticated users can join a group (insert their own membership).
create policy "group_members: users can join"
  on public.group_members for insert
  to authenticated
  with check (user_id = auth.uid());

-- Group creator can add other members.
create policy "group_members: creator can add members"
  on public.group_members for insert
  to authenticated
  with check (
    exists (
      select 1 from public.groups
      where id = group_id and created_by = auth.uid()
    )
  );

-- Members can update their own membership row (e.g., role changes pushed by server use service role).
create policy "group_members: users can update own membership"
  on public.group_members for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Users can leave a group (delete their own membership).
create policy "group_members: users can leave"
  on public.group_members for delete
  to authenticated
  using (user_id = auth.uid());

-- ------------------------------------------------------------
-- messages
-- ------------------------------------------------------------
-- Group members can read messages in their groups.
create policy "messages: members can select"
  on public.messages for select
  to authenticated
  using (public.is_group_member(group_id));

-- Group members can send messages.
create policy "messages: members can insert"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_group_member(group_id)
  );

-- Senders can soft-delete or flag their own messages.
create policy "messages: sender can update own"
  on public.messages for update
  to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- ------------------------------------------------------------
-- message_analysis
-- Raw scores are server-side only; clients only need select.
-- Insert/update done via service role key in API routes.
-- ------------------------------------------------------------
create policy "message_analysis: group members can select"
  on public.message_analysis for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      where m.id = message_id
        and public.is_group_member(m.group_id)
    )
  );

-- ------------------------------------------------------------
-- conversation_snapshots
-- ------------------------------------------------------------
create policy "snapshots: group members can select"
  on public.conversation_snapshots for select
  to authenticated
  using (public.is_group_member(group_id));

-- ------------------------------------------------------------
-- guidance_cards
-- Private — users only see their own cards.
-- ------------------------------------------------------------
create policy "guidance_cards: users see own cards"
  on public.guidance_cards for select
  to authenticated
  using (user_id = auth.uid());

-- Users can mark their own cards as opened/dismissed.
create policy "guidance_cards: users can update own"
  on public.guidance_cards for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- score_history
-- ------------------------------------------------------------
create policy "score_history: users see own history"
  on public.score_history for select
  to authenticated
  using (user_id = auth.uid());

-- ------------------------------------------------------------
-- evidence_vault
-- ------------------------------------------------------------
create policy "evidence_vault: users see own vault"
  on public.evidence_vault for select
  to authenticated
  using (user_id = auth.uid());

create policy "evidence_vault: users can insert own"
  on public.evidence_vault for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "evidence_vault: users can update own"
  on public.evidence_vault for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- bully_victim_flags
-- ------------------------------------------------------------
create policy "bully_flags: users see own flags"
  on public.bully_victim_flags for select
  to authenticated
  using (user_id = auth.uid());

-- ------------------------------------------------------------
-- pause_events
-- ------------------------------------------------------------
create policy "pause_events: users see own events"
  on public.pause_events for select
  to authenticated
  using (user_id = auth.uid());

create policy "pause_events: users can insert own"
  on public.pause_events for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "pause_events: users can update own"
  on public.pause_events for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
