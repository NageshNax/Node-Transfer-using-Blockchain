import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle, Download, Radio } from "lucide-react";
import { toast } from "sonner";

interface TransactionFormProps {
  onSendTransaction: (sender: string, receiver: string, data: string) => void;
  onBroadcastTransaction: (sender: string, data: string) => void;
  onVerifyChain: () => void;
  onDownloadChain: () => void;
}

const nodes = ["Node1", "Node2", "Node3", "Node4", "Node5"];

export const TransactionForm = ({
  onSendTransaction,
  onBroadcastTransaction,
  onVerifyChain,
  onDownloadChain,
}: TransactionFormProps) => {
  const [sender, setSender] = useState("Node1");
  const [receiver, setReceiver] = useState("Node2");
  const [data, setData] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);

  const handleSend = () => {
    if (!data.trim()) {
      toast.error("Please enter transaction data");
      return;
    }

    if (isBroadcast) {
      onBroadcastTransaction(sender, data);
    } else {
      if (sender === receiver) {
        toast.error("Sender and receiver cannot be the same");
        return;
      }
      onSendTransaction(sender, receiver, data);
    }
    setData("");
  };

  return (
    <div className="glass-card rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Send Transaction
      </h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50 border border-border/30">
          <Checkbox
            id="broadcast"
            checked={isBroadcast}
            onCheckedChange={(checked) => setIsBroadcast(checked as boolean)}
          />
          <Label
            htmlFor="broadcast"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
          >
            <Radio className="h-4 w-4 text-primary" />
            Broadcast to all nodes
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sender" className="text-foreground/80">Sender Node</Label>
            <Select value={sender} onValueChange={setSender}>
              <SelectTrigger id="sender" className="bg-muted border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node} value={node}>
                    {node}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver" className="text-foreground/80">
              {isBroadcast ? "Receiver Nodes" : "Receiver Node"}
            </Label>
            <Select value={isBroadcast ? "all" : receiver} onValueChange={setReceiver} disabled={isBroadcast}>
              <SelectTrigger id="receiver" className="bg-muted border-border/50">
                <SelectValue placeholder={isBroadcast ? "All Nodes" : "Select node"} />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node} value={node}>
                    {node}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data" className="text-foreground/80">Transaction Data</Label>
          <Input
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter transaction message..."
            className="bg-muted border-border/50"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleSend}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {isBroadcast ? <Radio className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
          {isBroadcast ? "Broadcast Transaction" : "Send Transaction"}
        </Button>
        <Button
          onClick={onVerifyChain}
          variant="outline"
          className="border-accent/50 text-accent hover:bg-accent/10 font-semibold"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Verify Chain
        </Button>
        <Button
          onClick={onDownloadChain}
          variant="outline"
          className="border-secondary/50 text-secondary hover:bg-secondary/10 font-semibold"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};
