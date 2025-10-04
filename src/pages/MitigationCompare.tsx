import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const MitigationCompare = () => {
  const strategies = [
    {
      name: "Renewable Energy Transition",
      cost: "$2.5T",
      reduction: "35%",
      timeline: "2030-2050",
      effectiveness: "high",
      pros: ["Sustainable long-term", "Job creation", "Energy independence"],
      cons: ["High initial cost", "Infrastructure needs", "Intermittency challenges"],
    },
    {
      name: "Carbon Capture & Storage",
      cost: "$800B",
      reduction: "12%",
      timeline: "2025-2045",
      effectiveness: "medium",
      pros: ["Existing infrastructure use", "Proven technology", "Industrial scalability"],
      cons: ["Energy intensive", "Storage risks", "Limited capacity"],
    },
    {
      name: "Reforestation Programs",
      cost: "$320B",
      reduction: "8%",
      timeline: "2024-2040",
      effectiveness: "medium",
      pros: ["Biodiversity benefits", "Low-tech solution", "Co-benefits"],
      cons: ["Long timeframe", "Land availability", "Maintenance required"],
    },
    {
      name: "Nuclear Energy Expansion",
      cost: "$1.8T",
      reduction: "22%",
      timeline: "2028-2050",
      effectiveness: "high",
      pros: ["High capacity factor", "Low emissions", "Base load power"],
      cons: ["Public perception", "Waste management", "Long construction"],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Mitigation Strategy Comparison</h1>
        <p className="text-muted-foreground text-lg">
          Analyze and compare different climate mitigation approaches
        </p>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Comparative Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Strategy
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Investment
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    CO₂ Reduction
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Timeline
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Effectiveness
                  </th>
                </tr>
              </thead>
              <tbody>
                {strategies.map((strategy, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-foreground">{strategy.name}</td>
                    <td className="py-4 px-4 text-accent font-semibold">{strategy.cost}</td>
                    <td className="py-4 px-4 text-primary font-semibold">{strategy.reduction}</td>
                    <td className="py-4 px-4 text-muted-foreground">{strategy.timeline}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={strategy.effectiveness === "high" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {strategy.effectiveness}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {strategies.map((strategy, index) => (
          <Card key={index} className="bg-gradient-card border-border hover:shadow-glow-primary transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-foreground">{strategy.name}</CardTitle>
                <Badge
                  variant={strategy.effectiveness === "high" ? "default" : "secondary"}
                  className="capitalize font-semibold"
                >
                  {strategy.effectiveness}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Investment</p>
                  <p className="font-bold text-accent">{strategy.cost}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">CO₂ Cut</p>
                  <p className="font-bold text-primary">{strategy.reduction}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                  <p className="font-bold text-foreground text-xs">{strategy.timeline}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Advantages
                </h4>
                <ul className="space-y-1">
                  {strategy.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Challenges
                </h4>
                <ul className="space-y-1">
                  {strategy.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MitigationCompare;
