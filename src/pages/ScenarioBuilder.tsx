import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlayCircle, RotateCcw } from "lucide-react";

const ScenarioBuilder = () => {
  const [emissions, setEmissions] = useState([50]);
  const [renewables, setRenewables] = useState([30]);
  const [deforestation, setDeforestation] = useState([40]);

  const handleReset = () => {
    setEmissions([50]);
    setRenewables([30]);
    setDeforestation([40]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Scenario Builder</h1>
        <p className="text-muted-foreground text-lg">
          Adjust parameters to model different climate futures
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-gradient-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Model Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emissions" className="text-base font-medium text-foreground">
                  Emissions Reduction
                </Label>
                <span className="text-primary font-bold text-xl">{emissions[0]}%</span>
              </div>
              <Slider
                id="emissions"
                min={0}
                max={100}
                step={1}
                value={emissions}
                onValueChange={setEmissions}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Target reduction in global greenhouse gas emissions by 2050
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="renewables" className="text-base font-medium text-foreground">
                  Renewable Energy Adoption
                </Label>
                <span className="text-accent font-bold text-xl">{renewables[0]}%</span>
              </div>
              <Slider
                id="renewables"
                min={0}
                max={100}
                step={1}
                value={renewables}
                onValueChange={setRenewables}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Percentage of global energy from renewable sources by 2050
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="deforestation" className="text-base font-medium text-foreground">
                  Forest Conservation
                </Label>
                <span className="text-green-400 font-bold text-xl">{deforestation[0]}%</span>
              </div>
              <Slider
                id="deforestation"
                min={0}
                max={100}
                step={1}
                value={deforestation}
                onValueChange={setDeforestation}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Reduction in global deforestation rates
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow-primary"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Run Simulation
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="border-border hover:bg-secondary/50"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Projected Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Temperature Change (2100)</p>
              <p className="text-2xl font-bold text-foreground">
                +{(2.5 - (emissions[0] / 100) * 1.2).toFixed(1)}°C
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Sea Level Rise (2100)</p>
              <p className="text-2xl font-bold text-foreground">
                +{(80 - (emissions[0] / 100) * 30).toFixed(0)} cm
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">CO₂ Concentration (2100)</p>
              <p className="text-2xl font-bold text-foreground">
                {(550 - (emissions[0] / 100) * 150).toFixed(0)} ppm
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Renewable Energy Share</p>
              <p className="text-2xl font-bold text-foreground">{renewables[0]}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioBuilder;
