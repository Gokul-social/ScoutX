import { useState, useCallback } from "react";

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const address = isConnected ? "0x1a2B...9f4E" : "";

  return { isConnected, address, connect, disconnect };
};
