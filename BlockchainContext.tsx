
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
}

interface BlockchainContextType {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  isConnected: boolean;
  walletAddress: string | null;
  balance: number;
  createTransaction: (to: string, amount: number, description: string) => Promise<boolean>;
  transactions: Transaction[];
  pendingTransactions: number;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const connect = async (): Promise<boolean> => {
    try {
      // Mock blockchain connection
      const mockAddress = "0x" + Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
      setWalletAddress(mockAddress);
      setBalance(Math.floor(Math.random() * 100));
      setIsConnected(true);
      
      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: "tx-" + Math.random().toString(36).substring(2, 10),
          from: mockAddress,
          to: "0x" + Math.random().toString(36).substring(2, 15),
          amount: Math.random() * 10,
          status: 'completed',
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 10),
          description: "Initial project payment"
        },
        {
          id: "tx-" + Math.random().toString(36).substring(2, 10),
          from: "0x" + Math.random().toString(36).substring(2, 15),
          to: mockAddress,
          amount: Math.random() * 15,
          status: 'completed',
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 5),
          description: "Milestone completion payment"
        }
      ];
      
      setTransactions(mockTransactions);
      toast.success("Wallet connected");
      return true;
    } catch (error) {
      toast.error("Failed to connect wallet");
      return false;
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(0);
    setTransactions([]);
    toast.success("Wallet disconnected");
  };

  const createTransaction = async (to: string, amount: number, description: string): Promise<boolean> => {
    try {
      if (!isConnected || !walletAddress) {
        toast.error("Wallet not connected");
        return false;
      }

      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: "tx-" + Math.random().toString(36).substring(2, 10),
        from: walletAddress,
        to,
        amount,
        status: 'completed',
        timestamp: new Date(),
        description
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev - amount);
      
      toast.success("Transaction completed");
      return true;
    } catch (error) {
      toast.error("Transaction failed");
      return false;
    }
  };

  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;

  const value = {
    connect,
    disconnect,
    isConnected,
    walletAddress,
    balance,
    createTransaction,
    transactions,
    pendingTransactions
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
