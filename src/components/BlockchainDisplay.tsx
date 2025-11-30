import { Clock, Hash, Link2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Block {
  index: number;
  sender: string;
  receiver: string;
  data: string;
  timestamp: number;
  nonce: number;
  prevHash: string;
  hash: string;
}

interface BlockchainDisplayProps {
  blockchain: Block[];
  invalidBlocks?: Set<number>;
}

export const BlockchainDisplay = ({ blockchain, invalidBlocks = new Set() }: BlockchainDisplayProps) => {
  return (
    <div className="glass-card rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Blockchain Ledger
      </h2>

      <div className="space-y-4">
        {blockchain.slice().reverse().map((block, idx) => (
          <div
            key={`${block.index}-${block.hash}`}
            className={cn(
              "glass-card rounded-xl p-6 border-l-4 transition-all duration-300 hover:translate-x-1 animate-slide-in",
              invalidBlocks.has(block.index)
                ? "border-l-destructive bg-destructive/5"
                : "border-l-primary"
            )}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-border/50">
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground">
                  Block #{block.index}
                </h3>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold",
                block.index === 0
                  ? "bg-accent/20 text-accent"
                  : "bg-primary/20 text-primary"
              )}>
                {block.index === 0 ? "Genesis" : "Mined"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">Route</div>
                  <div className="text-sm font-medium text-foreground break-words">
                    {block.sender} → {block.receiver}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">Timestamp</div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date(block.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <Hash className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Data</div>
                  <div className="text-sm font-medium text-foreground break-words">
                    {block.data}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Link2 className="h-5 w-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Previous Hash</div>
                  <div className="text-xs font-mono text-primary/70 break-all">
                    {block.prevHash.substring(0, 16)}...
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Hash (Nonce: {block.nonce})</div>
                  <div className="text-xs font-mono text-primary break-all">
                    {block.hash.substring(0, 16)}...
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
