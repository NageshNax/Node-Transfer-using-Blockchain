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
  onBroadcastTransaction: (sender: string, data: string, receivers?: string[]) => void;
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
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [data, setData] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const handleSend = () => {
    if (!data.trim()) {
      toast.error("Please enter transaction data");
      return;
    }

    if (isBroadcast) {
      onBroadcastTransaction(sender, data);
    } else if (isMultiSelect) {
      if (selectedReceivers.length === 0) {
        toast.error("Please select at least one receiver node");
        return;
      }
      onBroadcastTransaction(sender, data, selectedReceivers);
    } else {
      if (sender === receiver) {
        toast.error("Sender and receiver cannot be the same");
        return;
      }
      onSendTransaction(sender, receiver, data);
    }
    setData("");
  };

  const toggleReceiverSelection = (node: string) => {
    setSelectedReceivers(prev =>
      prev.includes(node)
        ? prev.filter(n => n !== node)
        : [...prev, node]
    );
  };

  const availableReceivers = nodes.filter(node => node !== sender);

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl font-heading font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Send Transaction
      </h2>

      <div className="space-y-6 mb-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/50 border border-border/40 hover:border-border/60 transition-colors">
            <Checkbox
              id="broadcast"
              checked={isBroadcast}
              onCheckedChange={(checked) => {
                setIsBroadcast(checked as boolean);
                if (checked) setIsMultiSelect(false);
              }}
              className="h-5 w-5"
            />
            <Label
              htmlFor="broadcast"
              className="text-base font-medium leading-none cursor-pointer flex items-center gap-2 text-foreground"
            >
              <Radio className="h-5 w-5 text-primary" />
              Broadcast to all nodes
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/50 border border-border/40 hover:border-border/60 transition-colors">
            <Checkbox
              id="multiselect"
              checked={isMultiSelect}
              onCheckedChange={(checked) => {
                setIsMultiSelect(checked as boolean);
                if (checked) {
                  setIsBroadcast(false);
                  setSelectedReceivers([]);
                }
              }}
              className="h-5 w-5"
            />
            <Label
              htmlFor="multiselect"
              className="text-base font-medium leading-none cursor-pointer flex items-center gap-2 text-foreground"
            >
              <Send className="h-5 w-5 text-secondary" />
              Select specific nodes
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <Label htmlFor="sender" className="text-sm font-medium text-foreground">
              Sender Node
            </Label>
            <Select value={sender} onValueChange={setSender}>
              <SelectTrigger id="sender" className="h-12 bg-muted/80 border-border/50 hover:border-border/80 transition-colors">
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

          <div className="space-y-2.5">
            <Label htmlFor="receiver" className="text-sm font-medium text-foreground">
              {isBroadcast ? "Receiver Nodes" : isMultiSelect ? "Select Receiver Nodes" : "Receiver Node"}
            </Label>
            {isMultiSelect ? (
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted/80 border border-border/50 rounded-xl">
                {availableReceivers.map((node) => (
                  <div key={node} className="flex items-center space-x-2">
                    <Checkbox
                      id={`receiver-${node}`}
                      checked={selectedReceivers.includes(node)}
                      onCheckedChange={() => toggleReceiverSelection(node)}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`receiver-${node}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {node}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <Select value={isBroadcast ? "all" : receiver} onValueChange={setReceiver} disabled={isBroadcast}>
                <SelectTrigger 
                  id="receiver" 
                  className="h-12 bg-muted/80 border-border/50 hover:border-border/80 transition-colors disabled:opacity-60"
                >
                  <SelectValue placeholder={isBroadcast ? "All Nodes" : "Select node"} />
                </SelectTrigger>
                <SelectContent>
                  {availableReceivers.map((node) => (
                    <SelectItem key={node} value={node}>
                      {node}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="data" className="text-sm font-medium text-foreground">
            Transaction Data
          </Label>
          <Input
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter transaction message..."
            className="h-12 bg-muted/80 border-border/50 hover:border-border/80 focus:border-primary/50 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          onClick={handleSend}
          className="h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all md:col-span-1"
        >
          {isBroadcast ? (
            <Radio className="mr-2 h-5 w-5" />
          ) : isMultiSelect ? (
            <Send className="mr-2 h-5 w-5" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {isBroadcast ? "Broadcast" : isMultiSelect ? `Send to ${selectedReceivers.length} nodes` : "Send"}
        </Button>
        <Button
          onClick={onVerifyChain}
          variant="outline"
          className="h-12 border-accent/50 text-accent hover:bg-accent/10 font-semibold transition-all"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Verify Chain
        </Button>
        <Button
          onClick={onDownloadChain}
          variant="outline"
          className="h-12 border-secondary/50 text-secondary hover:bg-secondary/10 font-semibold transition-all"
        >
          <Download className="mr-2 h-5 w-5" />
          Download
        </Button>
      </div>
    </div>
  );
};
