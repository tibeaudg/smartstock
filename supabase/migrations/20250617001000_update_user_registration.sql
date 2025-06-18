-- Update the handle_new_user function to make self-registered users admins by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is registering themselves (raw_user_meta_data->>'invited_by' is null)
  -- then they should be an admin, otherwise use the specified role or default to staff
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'invited_by' IS NULL THEN 'admin'::user_role
      WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL THEN (NEW.raw_user_meta_data->>'role')::user_role
      ELSE 'staff'::user_role
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
