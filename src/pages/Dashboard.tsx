import { Thermometer, Cloud, Droplets, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Climate Analytics Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Monitor global climate metrics and scenario projections
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Global Temperature"
          value="+1.2°C"
          icon={Thermometer}
          trend="+0.08°C from last year"
          trendPositive={false}
        />
        <MetricCard
          title="CO₂ Concentration"
          value="420 ppm"
          icon={Cloud}
          trend="+2.4 ppm annually"
          trendPositive={false}
        />
        <MetricCard
          title="Sea Level Rise"
          value="+3.4 mm"
          icon={Droplets}
          trend="Annual average"
          trendPositive={false}
        />
        <MetricCard
          title="Renewable Adoption"
          value="28%"
          icon={TrendingUp}
          trend="+4% from last year"
          trendPositive={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-gradient-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Active Scenarios</h2>
          <div className="space-y-3">
            {[
              { name: "Baseline (RCP 8.5)", impact: "High", color: "text-destructive" },
              { name: "Moderate Mitigation (RCP 4.5)", impact: "Medium", color: "text-yellow-400" },
              { name: "Aggressive Action (RCP 2.6)", impact: "Low", color: "text-green-400" },
            ].map((scenario, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
              >
                <span className="font-medium text-foreground">{scenario.name}</span>
                <span className={`text-sm font-semibold ${scenario.color}`}>
                  {scenario.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recent Analysis</h2>
          <div className="space-y-3">
            {[
              { title: "Arctic Ice Extent Analysis", date: "2 hours ago" },
              { title: "Carbon Budget Assessment", date: "5 hours ago" },
              { title: "Regional Temperature Projections", date: "1 day ago" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col p-4 bg-secondary/30 rounded-lg border border-border/50 hover:border-accent/50 transition-all cursor-pointer"
              >
                <span className="font-medium text-foreground">{item.title}</span>
                <span className="text-sm text-muted-foreground mt-1">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
