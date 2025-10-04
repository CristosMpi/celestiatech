-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create scenarios table
CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  diameter_meters NUMERIC NOT NULL,
  density_kg_m3 NUMERIC NOT NULL DEFAULT 2600,
  velocity_km_s NUMERIC NOT NULL,
  impact_angle_deg NUMERIC NOT NULL DEFAULT 45,
  time_to_impact_years NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scenarios"
  ON public.scenarios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenarios"
  ON public.scenarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenarios"
  ON public.scenarios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scenarios"
  ON public.scenarios FOR DELETE
  USING (auth.uid() = user_id);

-- Create sim_results table
CREATE TABLE public.sim_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  mass_kg NUMERIC NOT NULL,
  kinetic_energy_joules NUMERIC NOT NULL,
  tnt_megatons NUMERIC NOT NULL,
  crater_diameter_meters NUMERIC NOT NULL,
  blast_rings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.sim_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sim_results for their scenarios"
  ON public.sim_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.scenarios
      WHERE scenarios.id = sim_results.scenario_id
      AND scenarios.user_id = auth.uid()
    )
  );

CREATE POLICY "Functions can insert sim_results"
  ON public.sim_results FOR INSERT
  WITH CHECK (true);

-- Create mitigation_run table
CREATE TABLE public.mitigation_run (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  strategy_type TEXT NOT NULL,
  delta_v_m_s NUMERIC NOT NULL,
  impactor_mass_kg NUMERIC,
  duration_years NUMERIC,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.mitigation_run ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mitigation_run for their scenarios"
  ON public.mitigation_run FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.scenarios
      WHERE scenarios.id = mitigation_run.scenario_id
      AND scenarios.user_id = auth.uid()
    )
  );

CREATE POLICY "Functions can insert mitigation_run"
  ON public.mitigation_run FOR INSERT
  WITH CHECK (true);

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();