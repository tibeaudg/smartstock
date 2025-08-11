-- Chat conversations table
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now()),
  user_id uuid references profiles(id),
  is_closed boolean default false
);

-- Chat messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  sender_type text check (sender_type in ('user', 'admin')),
  sender_id uuid,
  message text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Index for fast lookup
create index if not exists idx_chat_messages_chat_id on chat_messages(chat_id);
create index if not exists idx_chats_user_id on chats(user_id);
