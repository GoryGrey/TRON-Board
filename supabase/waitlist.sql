-- Create waitlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist (email);

-- Add RLS policies
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own entries
CREATE POLICY "Users can view their own waitlist entries" 
ON public.waitlist FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM public.users WHERE email = waitlist.email
));

-- Allow service role to manage all entries
CREATE POLICY "Service role can manage all waitlist entries" 
ON public.waitlist 
USING (auth.role() = 'service_role');
