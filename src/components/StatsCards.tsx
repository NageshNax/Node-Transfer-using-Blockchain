import { Blocks, Activity, Zap } from "lucide-react";

interface StatsCardsProps {
  blockCount: number;
  txCount: number;
  difficulty: number;
}

export const StatsCards = ({ blockCount, txCount, difficulty }: StatsCardsProps) => {
  const stats = [
    {
      icon: Blocks,
      label: "Total Blocks",
      value: blockCount,
      gradient: "from-primary to-secondary",
    },
    {
      icon: Activity,
      label: "Transactions",
      value: txCount,
      gradient: "from-secondary to-accent",
    },
    {
      icon: Zap,
      label: "Difficulty",
      value: difficulty,
      gradient: "from-accent to-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-card rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform animate-slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl w-fit mb-4`}>
            <stat.icon className="h-6 w-6 text-background" />
          </div>
          <div className="text-4xl font-heading font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
