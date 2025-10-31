-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Create plan_type enum for subscription tiers
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'yearly', 'lifetime');

-- Create user_roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  plan plan_type DEFAULT 'free' NOT NULL,
  daily_credits INTEGER DEFAULT 10 NOT NULL,
  max_daily_credits INTEGER DEFAULT 10 NOT NULL,
  credits_reset_at TIMESTAMPTZ DEFAULT (now() + interval '1 day'),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create tools table with all 62+ AI tools
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  is_premium BOOLEAN DEFAULT false,
  credits_cost INTEGER DEFAULT 1,
  route_path TEXT,
  tool_type TEXT,
  badge TEXT, -- 'free', 'premium', 'new', 'early_access'
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for tools (public read access for discovery)
CREATE POLICY "Anyone can view tools"
  ON public.tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tools"
  ON public.tools FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to reset daily credits
CREATE OR REPLACE FUNCTION public.reset_user_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    daily_credits = max_daily_credits,
    credits_reset_at = now() + interval '1 day'
  WHERE credits_reset_at <= now();
END;
$$;

-- Function to check if user can access a tool
CREATE OR REPLACE FUNCTION public.can_access_tool(
  _user_id UUID,
  _tool_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _tool_premium BOOLEAN;
  _user_plan plan_type;
BEGIN
  SELECT is_premium INTO _tool_premium
  FROM public.tools
  WHERE id = _tool_id;
  
  SELECT plan INTO _user_plan
  FROM public.user_profiles
  WHERE user_id = _user_id;
  
  -- Free tools are accessible to everyone
  IF NOT _tool_premium THEN
    RETURN true;
  END IF;
  
  -- Premium tools require paid plan
  RETURN _user_plan IN ('pro', 'yearly', 'lifetime');
END;
$$;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(
  _user_id UUID,
  _amount INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _current_credits INTEGER;
BEGIN
  -- Check if credits need reset
  PERFORM public.reset_user_credits();
  
  SELECT daily_credits INTO _current_credits
  FROM public.user_profiles
  WHERE user_id = _user_id;
  
  IF _current_credits >= _amount THEN
    UPDATE public.user_profiles
    SET daily_credits = daily_credits - _amount
    WHERE user_id = _user_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Insert all 62+ AI tools organized by category
INSERT INTO public.tools (name, description, category, is_premium, route_path, tool_type, badge, display_order) VALUES
-- Writing & Content (10 tools)
('Blog Generator', 'Generate engaging blog posts in seconds', 'writing', false, '/tool/blog', 'blog', 'free', 1),
('Grammar Fixer', 'Fix grammar and improve writing', 'writing', false, '/tool/grammar', 'grammar', 'free', 2),
('Text Summarizer', 'Summarize long documents', 'writing', false, '/tool/summarizer', 'summarize', 'free', 3),
('AI Chat Assistant', 'Chat with AI for any topic', 'writing', false, '/tool/chat', 'chat', 'free', 4),
('Notes Maker', 'Convert thoughts into organized notes', 'writing', false, '/tool/notes', 'notes', 'free', 5),
('Essay Writer', 'Write academic essays', 'writing', true, '/tool/essay', 'essay', 'premium', 6),
('Story Generator', 'Create creative stories', 'writing', true, '/tool/story', 'story', 'premium', 7),
('Email Writer', 'Craft professional emails', 'writing', true, '/tool/email', 'email', 'premium', 8),
('Paraphrasing Tool', 'Rewrite text differently', 'writing', true, '/tool/paraphrase', 'paraphrase', 'premium', 9),
('Copywriting Assistant', 'Write persuasive copy', 'writing', true, '/tool/copywriting', 'copywriting', 'premium', 10),

-- Coding & Dev (10 tools)
('Code Generator', 'Write code in multiple languages', 'coding', false, '/tool/code', 'code', 'free', 11),
('Bug Fixer', 'Debug and fix code errors', 'coding', true, '/tool/bugfix', 'bugfix', 'premium', 12),
('API Generator', 'Generate REST API endpoints', 'coding', true, '/tool/api', 'api', 'premium', 13),
('SQL Query Builder', 'Build SQL queries easily', 'coding', true, '/tool/sql', 'sql', 'premium', 14),
('Code Optimizer', 'Optimize code performance', 'coding', true, '/tool/optimize', 'optimize', 'premium', 15),
('Documentation Writer', 'Generate code documentation', 'coding', true, '/tool/docs', 'docs', 'premium', 16),
('Regex Generator', 'Create regex patterns', 'coding', true, '/tool/regex', 'regex', 'premium', 17),
('Unit Test Generator', 'Generate unit tests', 'coding', true, '/tool/unittest', 'unittest', 'premium', 18),
('Code Translator', 'Convert between languages', 'coding', true, '/tool/translate-code', 'translate_code', 'premium', 19),
('Algorithm Explainer', 'Explain complex algorithms', 'coding', true, '/tool/algorithm', 'algorithm', 'premium', 20),

-- Design & Creative (10 tools)
('Image Generator', 'Create AI images with OpenAI', 'design', true, '/tool/image', 'image', 'premium', 21),
('Logo Maker', 'Design professional logos', 'design', true, '/tool/logo', 'logo', 'premium', 22),
('Color Palette Generator', 'Create color schemes', 'design', true, '/tool/colors', 'colors', 'premium', 23),
('UI/UX Designer', 'Design interfaces', 'design', true, '/tool/uiux', 'uiux', 'premium', 24),
('Mockup Generator', 'Create design mockups', 'design', true, '/tool/mockup', 'mockup', 'premium', 25),
('Icon Generator', 'Generate custom icons', 'design', true, '/tool/icons', 'icons', 'premium', 26),
('Banner Creator', 'Design marketing banners', 'design', true, '/tool/banner', 'banner', 'premium', 27),
('Thumbnail Maker', 'Create video thumbnails', 'design', true, '/tool/thumbnail', 'thumbnail', 'premium', 28),
('Font Pairing', 'Find perfect font combinations', 'design', true, '/tool/fonts', 'fonts', 'premium', 29),
('Design Critique', 'Get design feedback', 'design', true, '/tool/critique', 'critique', 'premium', 30),

-- Marketing (10 tools)
('Ad Copy Writer', 'Write compelling ad copy', 'marketing', false, '/tool/adcopy', 'adcopy', 'free', 31),
('SEO Optimizer', 'Optimize content for SEO', 'marketing', true, '/tool/seo', 'seo', 'premium', 32),
('Social Media Post', 'Create social posts', 'marketing', true, '/tool/social', 'social', 'premium', 33),
('Product Description', 'Write product descriptions', 'marketing', true, '/tool/product', 'product', 'premium', 34),
('Landing Page Copy', 'Create landing page content', 'marketing', true, '/tool/landing', 'landing', 'premium', 35),
('Email Campaign', 'Design email campaigns', 'marketing', true, '/tool/campaign', 'campaign', 'premium', 36),
('Hashtag Generator', 'Generate trending hashtags', 'marketing', true, '/tool/hashtags', 'hashtags', 'premium', 37),
('Brand Name Generator', 'Create brand names', 'marketing', true, '/tool/brandname', 'brandname', 'premium', 38),
('Slogan Generator', 'Write catchy slogans', 'marketing', true, '/tool/slogan', 'slogan', 'premium', 39),
('Market Research', 'Analyze market trends', 'marketing', true, '/tool/research', 'research', 'premium', 40),

-- Education (11 tools)
('Quiz Generator', 'Create educational quizzes', 'education', false, '/tool/quiz', 'quiz', 'free', 41),
('Flashcard Maker', 'Generate study flashcards', 'education', true, '/tool/flashcards', 'flashcards', 'premium', 42),
('Study Guide Creator', 'Create comprehensive study guides', 'education', true, '/tool/studyguide', 'studyguide', 'premium', 43),
('Math Solver', 'Solve math problems', 'education', true, '/tool/math', 'math', 'premium', 44),
('Research Assistant', 'Help with research', 'education', true, '/tool/research-help', 'research_help', 'premium', 45),
('Language Translator', 'Translate languages', 'education', true, '/tool/translate', 'translate', 'premium', 46),
('Presentation Maker', 'Create presentations', 'education', true, '/tool/presentation', 'presentation', 'premium', 47),
('Lesson Planner', 'Plan educational lessons', 'education', true, '/tool/lesson', 'lesson', 'premium', 48),
('Citation Generator', 'Generate citations', 'education', true, '/tool/citation', 'citation', 'premium', 49),
('Homework Helper', 'Assist with homework', 'education', true, '/tool/homework', 'homework', 'premium', 50),
('Mind Map Creator', 'Create mind maps', 'education', true, '/tool/mindmap', 'mindmap', 'premium', 51),

-- Productivity (11 tools)
('Meeting Notes', 'Summarize meeting notes', 'productivity', false, '/tool/meeting', 'meeting', 'free', 52),
('Task Manager', 'Organize tasks with AI', 'productivity', true, '/tool/tasks', 'tasks', 'premium', 53),
('Calendar Assistant', 'Manage calendar events', 'productivity', true, '/tool/calendar', 'calendar', 'premium', 54),
('Report Generator', 'Generate business reports', 'productivity', true, '/tool/report', 'report', 'premium', 55),
('Invoice Creator', 'Create professional invoices', 'productivity', true, '/tool/invoice', 'invoice', 'premium', 56),
('Resume Builder', 'Build professional resumes', 'productivity', true, '/tool/resume', 'resume', 'premium', 57),
('Cover Letter', 'Write cover letters', 'productivity', true, '/tool/coverletter', 'coverletter', 'premium', 58),
('Pitch Deck Maker', 'Create pitch decks', 'productivity', true, '/tool/pitchdeck', 'pitchdeck', 'premium', 59),
('Business Plan', 'Write business plans', 'productivity', true, '/tool/bizplan', 'bizplan', 'premium', 60),
('Contract Generator', 'Generate legal contracts', 'productivity', true, '/tool/contract', 'contract', 'premium', 61),
('Time Tracker', 'Track time and productivity', 'productivity', true, '/tool/timetrack', 'timetrack', 'premium', 62);