-- Update user_profiles to remove credits and use new plan structure
-- Add new columns for word/image limits

-- Add new columns for usage tracking (monthly limits instead of daily credits)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS words_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_reset_at TIMESTAMP WITH TIME ZONE DEFAULT (date_trunc('month', now()) + interval '1 month');

-- Create function to reset monthly usage
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    words_used = 0,
    images_used = 0,
    usage_reset_at = date_trunc('month', now()) + interval '1 month'
  WHERE usage_reset_at <= now();
END;
$$;

-- Create function to check and deduct word usage
CREATE OR REPLACE FUNCTION public.use_words(_user_id uuid, _word_count integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _plan plan_type;
  _words_used INTEGER;
  _limit INTEGER;
BEGIN
  -- Check if usage needs reset
  PERFORM public.reset_monthly_usage();
  
  SELECT plan, words_used INTO _plan, _words_used
  FROM public.user_profiles
  WHERE user_id = _user_id;
  
  -- Determine limit based on plan
  CASE _plan
    WHEN 'free' THEN _limit := 5000;
    WHEN 'pro' THEN _limit := 100000;
    WHEN 'yearly' THEN _limit := 100000;
    WHEN 'lifetime' THEN _limit := -1; -- Unlimited
  END CASE;
  
  -- Unlimited plan
  IF _limit = -1 THEN
    UPDATE public.user_profiles
    SET words_used = words_used + _word_count
    WHERE user_id = _user_id;
    RETURN true;
  END IF;
  
  -- Check if within limit
  IF _words_used + _word_count <= _limit THEN
    UPDATE public.user_profiles
    SET words_used = words_used + _word_count
    WHERE user_id = _user_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create function to check and deduct image usage
CREATE OR REPLACE FUNCTION public.use_images(_user_id uuid, _count integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _plan plan_type;
  _images_used INTEGER;
  _limit INTEGER;
BEGIN
  -- Check if usage needs reset
  PERFORM public.reset_monthly_usage();
  
  SELECT plan, images_used INTO _plan, _images_used
  FROM public.user_profiles
  WHERE user_id = _user_id;
  
  -- Determine limit based on plan
  CASE _plan
    WHEN 'free' THEN _limit := 10;
    WHEN 'pro' THEN _limit := 100;
    WHEN 'yearly' THEN _limit := 100;
    WHEN 'lifetime' THEN _limit := -1; -- Unlimited
  END CASE;
  
  -- Unlimited plan
  IF _limit = -1 THEN
    UPDATE public.user_profiles
    SET images_used = images_used + _count
    WHERE user_id = _user_id;
    RETURN true;
  END IF;
  
  -- Check if within limit
  IF _images_used + _count <= _limit THEN
    UPDATE public.user_profiles
    SET images_used = images_used + _count
    WHERE user_id = _user_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Add is_free_tool column to tools table to mark the 15 free tools
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS is_free_tool BOOLEAN DEFAULT false;