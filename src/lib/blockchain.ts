import CryptoJS from 'crypto-js';

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

const DIFFICULTY = 4;

export const generateHash = (str: string): string => {
  return CryptoJS.SHA256(str).toString();
};

export const createGenesisBlock = (): Block => {
  return {
    index: 0,
    sender: "System",
    receiver: "Network",
    data: "Genesis Block - Network Initialized",
    timestamp: Date.now(),
    nonce: 0,
    prevHash: "0",
    hash: generateHash("Genesis Block" + Date.now()),
  };
};

export const mineBlock = (block: Block): Block => {
  const minedBlock = { ...block };
  while (!minedBlock.hash.startsWith("0".repeat(DIFFICULTY))) {
    minedBlock.nonce++;
    minedBlock.hash = generateHash(
      minedBlock.index +
      minedBlock.sender +
      minedBlock.receiver +
      minedBlock.data +
      minedBlock.timestamp +
      minedBlock.prevHash +
      minedBlock.nonce
    );
  }
  return minedBlock;
};

export const createBlock = (
  prevBlock: Block,
  sender: string,
  receiver: string,
  data: string
): Block => {
  const newBlock: Block = {
    index: prevBlock.index + 1,
    sender,
    receiver,
    data,
    timestamp: Date.now(),
    nonce: 0,
    prevHash: prevBlock.hash,
    hash: "",
  };
  return mineBlock(newBlock);
};

export const verifyBlockchain = (blockchain: Block[]): Set<number> => {
  const invalidBlocks = new Set<number>();

  for (let i = 1; i < blockchain.length; i++) {
    const block = blockchain[i];
    const prev = blockchain[i - 1];

    const checkHash = generateHash(
      block.index +
      block.sender +
      block.receiver +
      block.data +
      block.timestamp +
      block.prevHash +
      block.nonce
    );

    if (block.hash !== checkHash || block.prevHash !== prev.hash) {
      invalidBlocks.add(block.index);
    }
  }

  return invalidBlocks;
};

export const downloadBlockchain = (blockchain: Block[]): void => {
  const data = JSON.stringify(blockchain, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `blockchain_${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
};
