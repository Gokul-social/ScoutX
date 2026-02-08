/**
 * Wallet Hook
 * ===========
 * Web3 wallet connection using wagmi v2
 */

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  // Format address for display (0x1234...5678)
  const formatAddress = (addr: string | undefined): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const connect = () => {
    open();
  };

  return {
    isConnected,
    address: formatAddress(address),
    fullAddress: address,
    connect,
    disconnect,
  };
};
