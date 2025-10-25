import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { avalancheFuji } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "viem";
import { RPC_CONFIG } from "./config/contracts";

// 0. Setup queryClient with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

if (!import.meta.env.VITE_REOWN_PROJECT_ID) {
  throw new Error("VITE_REOWN_PROJECT_ID is not set");
}

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: window.location.origin, // This will automatically match the current domain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks with custom RPC to avoid WalletConnect rate limits
const networks = [avalancheFuji];

// 4. Create Wagmi Adapter with custom transport to use Avalanche public RPC
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  transports: {
    [avalancheFuji.id]: http(RPC_CONFIG.AVALANCHE_FUJI, {
      batch: {
        wait: 100,
      },
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [avalancheFuji],
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
