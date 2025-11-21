-- Create guest_sessions table for temporary 7-day sandbox accounts
CREATE TABLE IF NOT EXISTS public.guest_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    demo_data_created BOOLEAN DEFAULT false,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for session token lookup
CREATE INDEX IF NOT EXISTS idx_guest_sessions_token ON public.guest_sessions(session_token);

-- Create index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_guest_sessions_expires_at ON public.guest_sessions(expires_at);

-- Enable RLS
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create guest sessions
CREATE POLICY "Anyone can create guest sessions" ON public.guest_sessions
    FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read guest sessions by token
CREATE POLICY "Anyone can read guest sessions by token" ON public.guest_sessions
    FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON public.guest_sessions TO authenticated;
GRANT ALL ON public.guest_sessions TO anon;

