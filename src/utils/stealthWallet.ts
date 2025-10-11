/**
 * Stealth Wallet Utilities
 *
 * Provides utilities for working with stealth wallets
 * to enhance privacy for encrypted metadata withdrawals
 */

import type { PublicClient } from 'viem';

/**
 * Recommended stealth wallet services
 */
export const STEALTH_WALLET_SERVICES = [
  {
    name: "Umbra",
    url: "https://app.umbra.cash",
    description: "Stealth address protocol for private payments",
    chainSupport: ["Avalanche", "Ethereum", "Polygon"],
  },
  {
    name: "Railgun",
    url: "https://railgun.org",
    description: "Privacy system for DeFi transactions",
    chainSupport: ["Avalanche", "Ethereum", "BSC", "Polygon"],
  },
] as const;

/**
 * Check if an address is likely a stealth wallet
 * (Fresh wallet with no or minimal transaction history)
 *
 * @param address - Address to check
 * @param publicClient - Viem public client
 * @returns true if likely a stealth wallet
 */
export async function isLikelyStealthWallet(
  address: string,
  publicClient: PublicClient
): Promise<boolean> {
  try {
    const txCount = await publicClient.getTransactionCount({
      address: address as `0x${string}`,
    });

    // Consider it a stealth wallet if it has 5 or fewer transactions
    return txCount <= 5;
  } catch (error) {
    console.error("Failed to check transaction count:", error);
    return false;
  }
}

/**
 * Generate warning message if using a non-stealth wallet
 *
 * @param address - Address to check
 * @param txCount - Transaction count
 * @returns Warning message or null
 */
export function getStealthWalletWarning(
  address: string,
  txCount: number
): string | null {
  if (txCount === 0) {
    return null; // Perfect stealth wallet
  }

  if (txCount <= 5) {
    return `ℹ️ This wallet has ${txCount} transaction${txCount === 1 ? '' : 's'}. Still relatively private.`;
  }

  if (txCount <= 20) {
    return `⚠️ This wallet has ${txCount} transactions. Consider using a fresher wallet for better privacy.`;
  }

  return `🚨 This wallet has ${txCount} transactions. Highly recommend using a fresh stealth wallet for maximum privacy.`;
}

/**
 * Get privacy score based on transaction history
 *
 * @param txCount - Transaction count
 * @returns Privacy score (0-5)
 */
export function getPrivacyScore(txCount: number): number {
  if (txCount === 0) return 5;
  if (txCount <= 2) return 4;
  if (txCount <= 5) return 3;
  if (txCount <= 10) return 2;
  if (txCount <= 20) return 1;
  return 0;
}

/**
 * Format privacy score for display
 *
 * @param score - Privacy score (0-5)
 * @returns Formatted string
 */
export function formatPrivacyScore(score: number): string {
  const stars = '⭐'.repeat(score);
  const empty = '☆'.repeat(5 - score);
  return `${stars}${empty} (${score}/5)`;
}

/**
 * Validate Ethereum address format
 *
 * @param address - Address to validate
 * @returns true if valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
