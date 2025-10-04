import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { ImpactMap } from "@/components/ImpactMap";

const MapImpacts = () => {
  const regions = [
    {
      name: "Arctic Region",
      impact: "Critical",
      temp: "+2.8°C",
      ice: "-40% coverage",
      severity: "high",
    },
    {
      name: "Sub-Saharan Africa",
      impact: "Severe",
      temp: "+1.9°C",
      drought: "+35% frequency",
      severity: "high",
    },
    {
      name: "South Asia",
      impact: "High",
      temp: "+1.6°C",
      flooding: "+28% risk",
      severity: "medium",
    },
    {
      name: "Pacific Islands",
      impact: "Critical",
      temp: "+1.4°C",
      sealevel: "+45cm projected",
      severity: "high",
    },
    {
      name: "Western Europe",
      impact: "Moderate",
      temp: "+1.3°C",
      heatwaves: "+22% frequency",
      severity: "medium",
    },
    {
      name: "Amazon Basin",
      impact: "Severe",
      temp: "+2.1°C",
      deforestation: "+18% risk",
      severity: "high",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Map & Impacts</h1>
        <p className="text-muted-foreground text-lg">
          Regional climate change impacts and projections
        </p>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Interactive Impact Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImpactMap />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          Regional Impact Analysis
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((region, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground">{region.name}</CardTitle>
                  <Badge
                    variant={region.severity === "high" ? "destructive" : "secondary"}
                    className="font-semibold"
                  >
                    {region.impact}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Temperature Change</span>
                  <span className="font-bold text-destructive flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {region.temp}
                  </span>
                </div>
                {region.ice && (
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Ice Coverage</span>
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <TrendingDown className="h-4 w-4" />
                      {region.ice}
                    </span>
                  </div>
                )}
                {region.drought && (
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Drought Frequency</span>
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {region.drought}
                    </span>
                  </div>
                )}
                {region.flooding && (
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Flooding Risk</span>
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {region.flooding}
                    </span>
                  </div>
                )}
                {region.sealevel && (
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Sea Level Rise</span>
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {region.sealevel}
                    </span>
                  </div>
                )}
                {region.heatwaves && (
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Heatwave Frequency</span>
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {region.heatwaves}
                    </span>
                  </div>
                )}
                {region.deforestation && (
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Deforestation Risk</span>
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {region.deforestation}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapImpacts;
