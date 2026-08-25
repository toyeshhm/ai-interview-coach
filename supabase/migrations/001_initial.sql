create table if not exists sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  job_description text not null,
  resume_text   text not null,
  status        text not null default 'in_progress',
  overall_score numeric(4,2),
  tips          jsonb,
  created_at    timestamptz default now()
);

create table if not exists questions (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid references sessions on delete cascade not null,
  question_text text not null,
  order_index   integer not null
);

create table if not exists answers (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid references questions on delete cascade not null,
  answer_text   text not null,
  score         numeric(4,2) not null,
  feedback      text not null,
  created_at    timestamptz default now()
);

-- Row Level Security
alter table sessions enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;

create policy "Users manage their own sessions"
  on sessions for all
  using (auth.uid() = user_id);

create policy "Users access questions via their sessions"
  on questions for all
  using (
    exists (
      select 1 from sessions
      where sessions.id = questions.session_id
      and sessions.user_id = auth.uid()
    )
  );

create policy "Users access answers via their questions"
  on answers for all
  using (
    exists (
      select 1 from questions
      join sessions on sessions.id = questions.session_id
      where questions.id = answers.question_id
      and sessions.user_id = auth.uid()
    )
  );
