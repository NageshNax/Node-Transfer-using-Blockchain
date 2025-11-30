import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NetworkVisualizationProps {
  activeNodes: { sender: string; receiver: string } | null;
}

const nodes = ["Node1", "Node2", "Node3", "Node4", "Node5"];

export const NetworkVisualization = ({ activeNodes }: NetworkVisualizationProps) => {
  const [animatePacket, setAnimatePacket] = useState(false);

  useEffect(() => {
    if (activeNodes) {
      setAnimatePacket(true);
      setTimeout(() => setAnimatePacket(false), 1500);
    }
  }, [activeNodes]);

  return (
    <div className="glass-card rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-heading font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Network Nodes
      </h2>
      
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 -translate-y-1/2 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full w-8 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-1500",
              animatePacket ? "animate-packet" : "opacity-0"
            )}
          />
        </div>

        {/* Nodes */}
        <div className="flex justify-around items-center relative z-10">
          {nodes.map((node) => (
            <div
              key={node}
              className={cn(
                "w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-sm text-primary-foreground shadow-xl transition-all duration-300 cursor-pointer hover:scale-110",
                activeNodes?.sender === node || activeNodes?.receiver === node
                  ? "animate-pulse-glow scale-110"
                  : ""
              )}
            >
              <span>{node.replace("Node", "N")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
