import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}

export function MetricCard({ title, value, icon: Icon, trend, trendPositive }: MetricCardProps) {
  return (
    <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className={`text-xs mt-2 ${trendPositive ? "text-green-400" : "text-destructive"}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
