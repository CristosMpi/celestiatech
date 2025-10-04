import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface BlastRing {
  type: string;
  radius_km: number;
  overpressure_psi: number;
  description: string;
  color: string;
}

const BLAST_RINGS: BlastRing[] = [
  {
    type: "crater",
    radius_km: 0.5,
    overpressure_psi: 100,
    description: "Impact crater - total destruction",
    color: "#ef4444",
  },
  {
    type: "severe_damage",
    radius_km: 2,
    overpressure_psi: 20,
    description: "Severe structural damage, near-total casualties",
    color: "#f97316",
  },
  {
    type: "moderate_damage",
    radius_km: 5,
    overpressure_psi: 5,
    description: "Moderate structural damage, significant casualties",
    color: "#f59e0b",
  },
  {
    type: "light_damage",
    radius_km: 10,
    overpressure_psi: 1,
    description: "Light damage, broken windows, minor injuries",
    color: "#eab308",
  },
  {
    type: "thermal_radiation",
    radius_km: 15,
    overpressure_psi: 0,
    description: "3rd degree burns from thermal radiation",
    color: "#84cc16",
  },
];

export function ImpactMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);
  const markerRef = useRef<L.Marker | null>(null);
  const elevationLayerRef = useRef<L.TileLayer | null>(null);
  const populationLayerRef = useRef<L.TileLayer | null>(null);
  
  const [showElevation, setShowElevation] = useState(true);
  const [showPopulation, setShowPopulation] = useState(false);
  const [impactLocation, setImpactLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
    });

    mapRef.current = map;

    // Base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // USGS 3DEP Elevation layer (WMS)
    elevationLayerRef.current = L.tileLayer.wms(
      "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
      {
        layers: "3DEPElevation:None",
        format: "image/png",
        transparent: true,
        opacity: 0.5,
        attribution: "USGS 3DEP",
      }
    );

    // Population density layer (approximation using CartoDB)
    populationLayerRef.current = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        opacity: 0.6,
      }
    );

    if (showElevation && elevationLayerRef.current) {
      elevationLayerRef.current.addTo(map);
    }

    // Handle map clicks
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setImpactLocation({ lat, lng });

      // Clear previous circles and marker
      circlesRef.current.forEach((circle) => circle.remove());
      circlesRef.current = [];
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add marker
      markerRef.current = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `<div class="text-center">
            <strong>Impact Location</strong><br/>
            ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E
          </div>`
        )
        .openPopup();

      // Draw blast rings
      const newCircles: L.Circle[] = [];
      BLAST_RINGS.forEach((ring) => {
        const circle = L.circle([lat, lng], {
          radius: ring.radius_km * 1000,
          color: ring.color,
          fillColor: ring.color,
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(map);

        circle.bindTooltip(
          `<div class="space-y-1">
            <strong>${ring.type.replace(/_/g, " ").toUpperCase()}</strong><br/>
            <span>Radius: ${ring.radius_km} km</span><br/>
            ${ring.overpressure_psi > 0 ? `<span>Overpressure: ${ring.overpressure_psi} PSI</span><br/>` : ""}
            <span class="text-sm">${ring.description}</span>
          </div>`,
          { permanent: false, direction: "top" }
        );

        newCircles.push(circle);
      });

      circlesRef.current = newCircles;

      // Fit bounds to show all circles
      if (newCircles.length > 0) {
        const allBounds = newCircles.map((c) => c.getBounds());
        const combinedBounds = allBounds.reduce((acc, bounds) => acc.extend(bounds), L.latLngBounds([lat, lng], [lat, lng]));
        map.fitBounds(combinedBounds, { padding: [50, 50] });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle elevation layer toggle
  useEffect(() => {
    if (!mapRef.current || !elevationLayerRef.current) return;

    if (showElevation) {
      elevationLayerRef.current.addTo(mapRef.current);
    } else {
      elevationLayerRef.current.remove();
    }
  }, [showElevation]);

  // Handle population layer toggle
  useEffect(() => {
    if (!mapRef.current || !populationLayerRef.current) return;

    if (showPopulation) {
      populationLayerRef.current.addTo(mapRef.current);
    } else {
      populationLayerRef.current.remove();
    }
  }, [showPopulation]);

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-card border-border">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <Switch
              id="elevation"
              checked={showElevation}
              onCheckedChange={setShowElevation}
            />
            <Label htmlFor="elevation" className="cursor-pointer text-foreground">
              Elevation/Topography
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="population"
              checked={showPopulation}
              onCheckedChange={setShowPopulation}
            />
            <Label htmlFor="population" className="cursor-pointer text-foreground">
              Population Density
            </Label>
          </div>
          <div className="flex-1 text-sm text-muted-foreground">
            Click anywhere on the map to simulate an impact location
          </div>
        </div>
      </Card>

      {impactLocation && (
        <Card className="p-4 bg-gradient-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="destructive">Active Impact Simulation</Badge>
            <span className="text-sm text-muted-foreground">
              {impactLocation.lat.toFixed(4)}°N, {impactLocation.lng.toFixed(4)}°E
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {BLAST_RINGS.map((ring) => (
              <div
                key={ring.type}
                className="p-2 rounded border"
                style={{ borderColor: ring.color }}
              >
                <div className="text-xs font-semibold text-foreground mb-1">
                  {ring.type.replace(/_/g, " ").toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {ring.radius_km} km radius
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div
        ref={mapContainer}
        className="w-full h-[600px] rounded-lg border border-border shadow-lg"
      />
    </div>
  );
}
