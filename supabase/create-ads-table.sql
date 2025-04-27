-- Create a stored procedure to create the ads table
CREATE OR REPLACE FUNCTION public.create_ads_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'ads'
  ) THEN
    -- Create the ads table
    CREATE TABLE public.ads (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      url VARCHAR(255) NOT NULL,
      image_url VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create index for faster queries
    CREATE INDEX idx_ads_is_active ON public.ads(is_active);

    -- Add RLS policies
    ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

    -- Policy for admins to manage ads
    CREATE POLICY admin_manage_ads ON public.ads
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE users.id = auth.uid() AND (users.is_admin = true OR users.role = 'admin')
        )
      );

    -- Policy for anyone to view active ads
    CREATE POLICY view_active_ads ON public.ads
      FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_ads_table() TO authenticated;
