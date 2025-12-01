import { useState } from "react";
import { NetworkVisualization } from "@/components/NetworkVisualization";
import { TransactionForm } from "@/components/TransactionForm";
import { StatsCards } from "@/components/StatsCards";
import { BlockchainDisplay, Block } from "@/components/BlockchainDisplay";
import {
  createGenesisBlock,
  createBlock,
  verifyBlockchain,
  downloadBlockchain,
} from "@/lib/blockchain";
import { toast } from "sonner";
import { Network } from "lucide-react";

const Index = () => {
  const [blockchain, setBlockchain] = useState<Block[]>([createGenesisBlock()]);
  const [activeNodes, setActiveNodes] = useState<{ sender: string; receiver: string } | null>(
    null
  );
  const [invalidBlocks, setInvalidBlocks] = useState<Set<number>>(new Set());

  const handleSendTransaction = (sender: string, receiver: string, data: string) => {
    setActiveNodes({ sender, receiver });
    toast.info("Mining new block...", {
      description: "Computing proof of work",
    });

    setTimeout(() => {
      const prevBlock = blockchain[blockchain.length - 1];
      const newBlock = createBlock(prevBlock, sender, receiver, data);
      
      setBlockchain([...blockchain, newBlock]);
      setActiveNodes(null);
      
      toast.success("Block mined successfully!", {
        description: `Block #${newBlock.index} added to chain`,
      });
    }, 1500);
  };

  const handleBroadcastTransaction = (sender: string, data: string, receivers?: string[]) => {
    const nodes = ["Node1", "Node2", "Node3", "Node4", "Node5"];
    const targetReceivers = receivers || nodes.filter(node => node !== sender);
    
    toast.info(receivers ? "Sending to selected nodes..." : "Broadcasting to all nodes...", {
      description: `Mining ${targetReceivers.length} blocks`,
    });

    let delay = 0;
    const newBlocks: Block[] = [];
    
    targetReceivers.forEach((receiver, index) => {
      setTimeout(() => {
        setActiveNodes({ sender, receiver });
        
        setTimeout(() => {
          const prevBlock = index === 0 
            ? blockchain[blockchain.length - 1]
            : newBlocks[index - 1];
          
          const newBlock = createBlock(prevBlock, sender, receiver, data);
          newBlocks.push(newBlock);
          
          if (index === targetReceivers.length - 1) {
            setBlockchain([...blockchain, ...newBlocks]);
            setActiveNodes(null);
            toast.success(receivers ? "Transmission complete!" : "Broadcast complete!", {
              description: `${targetReceivers.length} blocks added to chain`,
            });
          }
        }, 800);
      }, delay);
      
      delay += 1300;
    });
  };

  const handleVerifyChain = () => {
    const invalid = verifyBlockchain(blockchain);
    setInvalidBlocks(invalid);

    if (invalid.size === 0) {
      toast.success("Blockchain verified", {
        description: "All blocks have valid integrity ✓",
      });
    } else {
      toast.error("Chain compromised", {
        description: `${invalid.size} invalid block(s) detected`,
      });
    }
  };

  const handleDownloadChain = () => {
    downloadBlockchain(blockchain);
    toast.success("Blockchain exported", {
      description: "Chain data downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8 shadow-lg text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Network className="h-10 w-10 text-primary animate-pulse-glow" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Node Transfer
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Blockchain Network Simulator
          </p>
        </div>

        {/* Network Visualization */}
        <NetworkVisualization activeNodes={activeNodes} />

        {/* Transaction Form */}
        <TransactionForm
          onSendTransaction={handleSendTransaction}
          onBroadcastTransaction={handleBroadcastTransaction}
          onVerifyChain={handleVerifyChain}
          onDownloadChain={handleDownloadChain}
        />

        {/* Stats */}
        <StatsCards
          blockCount={blockchain.length}
          txCount={blockchain.length - 1}
          difficulty={4}
        />

        {/* Blockchain Display */}
        <BlockchainDisplay blockchain={blockchain} invalidBlocks={invalidBlocks} />
      </div>
    </div>
  );
};

export default Index;
