-- Update the handle_new_user function to use Discord username instead of email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, discord_id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'provider_id',
    COALESCE(
      NEW.raw_user_meta_data ->> 'custom_claims' ->> 'global_name',
      NEW.raw_user_meta_data ->> 'user_name', 
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'full_name',
      'Discord User'
    ),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update existing profile to use correct Discord username
UPDATE public.profiles 
SET username = 'KoshoDev'
WHERE user_id = '9ab16e43-3d9c-4467-bed6-9f3e0a729192';