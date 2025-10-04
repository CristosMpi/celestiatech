import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mitigation constants
const MITIGATION_CONSTANTS = {
  BETA_DEFAULT: 3.6, // Momentum transfer efficiency for kinetic impactor
  GRAVITY_TRACTOR_FORCE: 1e-4, // Newtons (conservative estimate)
  SECONDS_PER_YEAR: 365.25 * 24 * 60 * 60,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { scenarioId } = await req.json();

    if (!scenarioId) {
      throw new Error('scenarioId is required');
    }

    console.log(`Computing mitigation strategies for scenario: ${scenarioId}`);

    // Fetch scenario data
    const { data: scenario, error: fetchError } = await supabaseClient
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();

    if (fetchError || !scenario) {
      throw new Error(`Failed to fetch scenario: ${fetchError?.message}`);
    }

    // Calculate asteroid mass
    const radius = scenario.diameter_meters / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const asteroid_mass_kg = volume * scenario.density_kg_m3;

    const velocity_m_s = scenario.velocity_km_s * 1000;

    // Kinetic Impactor calculations
    const impactor_masses = [500, 1000, 5000, 10000]; // kg
    const kinetic_impactor_options = impactor_masses.map(m_impactor => {
      // Δv = β * (m_impactor / m_asteroid) * v_rel
      const delta_v_m_s = MITIGATION_CONSTANTS.BETA_DEFAULT * (m_impactor / asteroid_mass_kg) * velocity_m_s;
      
      // Estimate required lead time (simplified)
      const orbital_period_days = 365.25; // Approximate for Earth-crossing orbit
      const min_lead_time_years = Math.max(1, Math.ceil(delta_v_m_s * 100)); // Rule of thumb
      
      return {
        strategy: 'Kinetic Impactor',
        impactor_mass_kg: m_impactor,
        delta_v_m_s,
        min_lead_time_years,
        success_probability: delta_v_m_s > 0.01 ? 0.85 : 0.95,
        cost_billions: 0.5 + (m_impactor / 1000) * 0.2,
        readiness: 'Proven technology'
      };
    });

    // Gravity Tractor calculations
    const mission_durations = [5, 10, 15, 20]; // years
    const gravity_tractor_options = mission_durations.map(duration_years => {
      // F = G * m1 * m2 / r^2, but using simplified constant force
      // Δv = (F * t) / m
      const duration_seconds = duration_years * MITIGATION_CONSTANTS.SECONDS_PER_YEAR;
      const delta_v_m_s = (MITIGATION_CONSTANTS.GRAVITY_TRACTOR_FORCE * duration_seconds) / asteroid_mass_kg;
      
      return {
        strategy: 'Gravity Tractor',
        duration_years,
        delta_v_m_s,
        spacecraft_mass_kg: 1000,
        success_probability: 0.75,
        cost_billions: 1.5 + (duration_years / 5) * 0.5,
        readiness: 'Requires development'
      };
    });

    // Nuclear Deflection option (single scenario)
    const nuclear_option = {
      strategy: 'Nuclear Deflection',
      yield_megatons: 1,
      delta_v_m_s: 0.1, // Conservative estimate
      min_lead_time_years: 5,
      success_probability: 0.70,
      cost_billions: 3.0,
      readiness: 'Requires international approval',
      risks: 'Fragmentation risk'
    };

    // Combine all recommendations
    const recommendations = [
      ...kinetic_impactor_options,
      ...gravity_tractor_options,
      nuclear_option
    ];

    // Sort by effectiveness (delta_v) and probability
    const sorted_recommendations = recommendations
      .map(rec => ({
        ...rec,
        effectiveness_score: rec.delta_v_m_s * rec.success_probability
      }))
      .sort((a, b) => b.effectiveness_score - a.effectiveness_score);

    // Store best options in mitigation_run table
    const best_kinetic = kinetic_impactor_options[kinetic_impactor_options.length - 1];
    const best_gravity = gravity_tractor_options[gravity_tractor_options.length - 1];

    // Insert kinetic impactor run
    await supabaseClient.from('mitigation_run').insert({
      scenario_id: scenarioId,
      strategy_type: 'kinetic_impactor',
      delta_v_m_s: best_kinetic.delta_v_m_s,
      impactor_mass_kg: best_kinetic.impactor_mass_kg,
      recommendations: kinetic_impactor_options
    });

    // Insert gravity tractor run
    await supabaseClient.from('mitigation_run').insert({
      scenario_id: scenarioId,
      strategy_type: 'gravity_tractor',
      delta_v_m_s: best_gravity.delta_v_m_s,
      duration_years: best_gravity.duration_years,
      recommendations: gravity_tractor_options
    });

    console.log(`Successfully computed mitigation strategies for scenario ${scenarioId}`);

    return new Response(JSON.stringify({
      success: true,
      scenario: {
        name: scenario.name,
        asteroid_mass_kg,
        time_to_impact_years: scenario.time_to_impact_years
      },
      recommendations: sorted_recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in compareMitigation:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
