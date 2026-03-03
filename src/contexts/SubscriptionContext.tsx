import React, { createContext, useContext, useState } from "react";

export interface SubscriptionPackage {
  id: string;
  name: string;
  maxFolders: number;
  maxNestingLevel: number;
  allowedFileTypes: string[];
  maxFileSizeMB: number;
  totalFileLimit: number;
  filesPerFolder: number;
}

export interface SubscriptionUsage {
  totalFiles: number;
  totalFolders: number;
}

interface SubscriptionContextType {
  activePackage: SubscriptionPackage;
  usage: SubscriptionUsage;
  packages: SubscriptionPackage[];
  refreshSubscription: () => void;
}

export const mockPackages: SubscriptionPackage[] = [
  {
    id: "free",
    name: "Free",
    maxFolders: 3,
    maxNestingLevel: 1,
    allowedFileTypes: ["jpg", "png", "pdf"],
    maxFileSizeMB: 5,
    totalFileLimit: 20,
    filesPerFolder: 10,
  },
  {
    id: "pro",
    name: "Pro",
    maxFolders: 20,
    maxNestingLevel: 3,
    allowedFileTypes: ["jpg", "png", "pdf", "docx", "xlsx", "mp4"],
    maxFileSizeMB: 50,
    totalFileLimit: 500,
    filesPerFolder: 50,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    maxFolders: 100,
    maxNestingLevel: 5,
    allowedFileTypes: ["*"],
    maxFileSizeMB: 500,
    totalFileLimit: 10000,
    filesPerFolder: 500,
  },
];

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [activePackage] = useState<SubscriptionPackage>(mockPackages[1]); // Pro by default
  const [usage] = useState<SubscriptionUsage>({ totalFiles: 47, totalFolders: 8 });

  const refreshSubscription = () => {
    // No-op for mock
  };

  return (
    <SubscriptionContext.Provider
      value={{ activePackage, usage, packages: mockPackages, refreshSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
