/**
 * Wagmi Configuration
 * ===================
 * Web3 wallet configuration using wagmi v2 + Web3Modal
 */

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, sepolia } from 'wagmi/chains';

// WalletConnect Project ID
// Get your own at https://cloud.walletconnect.com
// Using demo ID for development - REPLACE IN PRODUCTION
const projectId = 'c4f79cc821944d9680842e34466bfb';

// Define chains
const chains = [mainnet, sepolia] as const;

// Metadata for Web3Modal
const metadata = {
    name: 'ScoutX',
    description: 'Opportunity Market dApp',
    url: 'https://scoutx.xyz',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create wagmi config
export const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    enableWalletConnect: true,
    enableInjected: true, // MetaMask, etc.
    enableEIP6963: true,  // Modern wallet detection
    enableCoinbase: true,
});

// Initialize Web3Modal
createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: false,
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#7c3aed', // Match ScoutX purple
        '--w3m-border-radius-master': '8px',
    }
});

export { chains };
