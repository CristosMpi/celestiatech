-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Functions can insert sim_results" ON public.sim_results;

-- Create a secure policy that verifies the scenario belongs to the authenticated user
CREATE POLICY "Users can insert sim_results for their scenarios"
ON public.sim_results
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.scenarios
    WHERE scenarios.id = sim_results.scenario_id
      AND scenarios.user_id = auth.uid()
  )
);