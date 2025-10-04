import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Constants for calculations
const CONSTANTS = {
  TNT_ENERGY_JOULES: 4.184e9, // 1 megaton TNT in joules
  PI_SCALING_K: 0.074, // Crater scaling constant for competent rock
  PI_SCALING_N: 0.34, // Crater scaling exponent
  GRAVITY: 9.81, // m/s^2
  TARGET_DENSITY: 2600, // kg/m^3 for typical rock
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

    console.log(`Computing impact for scenario: ${scenarioId}`);

    // Fetch scenario data
    const { data: scenario, error: fetchError } = await supabaseClient
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();

    if (fetchError || !scenario) {
      throw new Error(`Failed to fetch scenario: ${fetchError?.message}`);
    }

    // Calculate mass (sphere volume * density)
    const radius = scenario.diameter_meters / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass_kg = volume * scenario.density_kg_m3;

    // Calculate kinetic energy: KE = 0.5 * m * v^2
    const velocity_m_s = scenario.velocity_km_s * 1000;
    const kinetic_energy_joules = 0.5 * mass_kg * Math.pow(velocity_m_s, 2);

    // Convert to TNT megatons
    const tnt_megatons = kinetic_energy_joules / CONSTANTS.TNT_ENERGY_JOULES;

    // Calculate crater diameter using pi-scaling
    // D = K * (E / ρg)^n where E is energy, ρ is target density, g is gravity
    const energy_per_gravity = kinetic_energy_joules / (CONSTANTS.TARGET_DENSITY * CONSTANTS.GRAVITY);
    const crater_diameter_meters = CONSTANTS.PI_SCALING_K * Math.pow(energy_per_gravity, CONSTANTS.PI_SCALING_N);

    // Calculate conservative blast rings (overpressure zones)
    // Based on nuclear blast scaling: R ∝ (yield)^(1/3)
    const blast_rings = [
      {
        type: 'severe_damage',
        overpressure_psi: 20,
        radius_km: 0.8 * Math.pow(tnt_megatons, 1/3),
        description: 'Severe structural damage, near-total casualties'
      },
      {
        type: 'moderate_damage',
        overpressure_psi: 5,
        radius_km: 2.2 * Math.pow(tnt_megatons, 1/3),
        description: 'Moderate structural damage, significant casualties'
      },
      {
        type: 'light_damage',
        overpressure_psi: 1,
        radius_km: 6.0 * Math.pow(tnt_megatons, 1/3),
        description: 'Light damage, broken windows, minor injuries'
      },
      {
        type: 'thermal_radiation',
        overpressure_psi: 0,
        radius_km: 8.5 * Math.pow(tnt_megatons, 1/3),
        description: '3rd degree burns from thermal radiation'
      }
    ];

    // Insert results into sim_results table
    const { data: result, error: insertError } = await supabaseClient
      .from('sim_results')
      .insert({
        scenario_id: scenarioId,
        mass_kg,
        kinetic_energy_joules,
        tnt_megatons,
        crater_diameter_meters,
        blast_rings
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert sim_results: ${insertError.message}`);
    }

    console.log(`Successfully computed impact for scenario ${scenarioId}`);

    return new Response(JSON.stringify({
      success: true,
      result: {
        id: result.id,
        mass_kg,
        kinetic_energy_joules,
        tnt_megatons,
        crater_diameter_meters,
        blast_rings
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in computeImpact:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
