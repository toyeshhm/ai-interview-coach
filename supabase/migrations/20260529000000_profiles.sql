create table if not exists profiles (
  id                      uuid primary key references auth.users on delete cascade,
  plan                    text not null default 'free',
  stripe_customer_id      text,
  stripe_subscription_id  text,
  updated_at              timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users read/write own profile"
  on profiles for all
  using (auth.uid() = id);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
