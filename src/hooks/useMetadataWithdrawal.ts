import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { EERC } from '@avalabs/ac-eerc-sdk';
import { CONTRACTS, CIRCUIT_CONFIG } from '../config/contracts';

/**
 * Hook for encrypted withdrawal using EERC SDK
 *
 * PRIVACY FEATURES:
 * - User maintains decryption keys
 * - Encrypted balance operations
 * - ZK proof-based withdrawals
 *
 * Uses eerc-sdk-fork's built-in withdraw() method
 */
export function useMetadataWithdrawal() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [eercInstance, setEercInstance] = useState<EERC | null>(null);

  // This dummy function is required for the EERC constructor, even in snarkjs mode.
  const dummyProveFunc = async () => {
    return { proof: [], publicInputs: [] };
  };

  // Initialize EERC SDK instance
  useEffect(() => {
    let mounted = true;

    const initSDK = async () => {
      if (!publicClient || !walletClient || !address) {
        setEercInstance(null);
        return;
      }

      try {
        // Circuit URLs for proof generation
        const circuitURLs = {
          register: {
            wasm: CIRCUIT_CONFIG.register.wasm,
            zkey: CIRCUIT_CONFIG.register.zkey,
          },
          mint: {
            wasm: CIRCUIT_CONFIG.mint.wasm,
            zkey: CIRCUIT_CONFIG.mint.zkey,
          },
          transfer: {
            wasm: CIRCUIT_CONFIG.transfer.wasm,
            zkey: CIRCUIT_CONFIG.transfer.zkey,
          },
          withdraw: {
            wasm: CIRCUIT_CONFIG.withdraw.wasm,
            zkey: CIRCUIT_CONFIG.withdraw.zkey,
          },
          burn: {
            wasm: '/BurnCircuit.wasm',
            zkey: '/BurnCircuit.groth16.zkey',
          },
        };

        // Create EERC instance
        const eerc = new EERC(
          publicClient as any,
          walletClient as any,
          CONTRACTS.EERC_CONVERTER as `0x${string}`,
          CONTRACTS.REGISTRAR as `0x${string}`,
          true, // isConverter = true
          dummyProveFunc as any, // Pass the dummy prove function
          circuitURLs,
          undefined // decryptionKey will be generated when needed
        );

        // Enable snarkjs mode (uses snarkjs.groth16.fullProve internally)
        eerc.snarkjsMode = true;

        // Generate decryption key if not already set
        if (!eerc.isDecryptionKeySet) {
          console.log('Generating decryption key...');
          await eerc.generateDecryptionKey();
          console.log('Decryption key generated. Public key:', eerc.publicKey);
        }

        if (mounted) {
          console.log('DEBUG: Type of prime field is', typeof eerc.field.p);
          console.log('DEBUG: Public key at mount:', eerc.publicKey);
          console.log('DEBUG: Decryption key set:', eerc.isDecryptionKeySet);
          setEercInstance(eerc);
        }
      } catch (error) {
        console.error('Failed to initialize EERC SDK:', error);
        if (mounted) {
          setEercInstance(null);
        }
      }
    };

    initSDK();

    return () => {
      mounted = false;
    };
  }, [publicClient, walletClient, address]);

  /**
   * Execute encrypted withdrawal
   *
   * SDK automatically handles:
   * 1. Generate ZK proofs
   * 2. Create poseidon ciphertexts
   * 3. Submit transaction
   *
   * @param recipient - Where to send tokens (stealth wallet recommended)
   * @param amount - Amount to withdraw
   * @param encryptedBalance - Current encrypted balance
   * @param decryptedBalance - Current decrypted balance
   * @param tokenAddress - ERC20 token address
   * @returns Transaction hash
   */
  async function withdrawWithMetadata(
    recipient: string,
    amount: bigint,
    encryptedBalance: bigint[],
    decryptedBalance: bigint,
    tokenAddress: string
  ): Promise<{ transactionHash: `0x${string}` }> {
    if (!address || !walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    if (!eercInstance) {
      throw new Error('EERC SDK not initialized');
    }

    if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      throw new Error('Invalid recipient address');
    }

    setIsProcessing(true);

    try {
      // Get auditor public key from contract (it's a Point struct)
      const auditorPubKeyStruct = await publicClient.readContract({
        address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
        abi: [{
          inputs: [],
          name: 'auditorPublicKey',
          outputs: [{
            type: 'tuple',
            components: [
              { name: 'x', type: 'uint256' },
              { name: 'y', type: 'uint256' }
            ]
          }],
          stateMutability: 'view',
          type: 'function',
        }],
        functionName: 'auditorPublicKey',
      }) as { x: bigint; y: bigint };

      if (!auditorPubKeyStruct || auditorPubKeyStruct.x === 0n) {
        throw new Error('Auditor public key not set on contract');
      }

      const auditorPubKey = [auditorPubKeyStruct.x, auditorPubKeyStruct.y];

      console.log('=== Before withdraw ===');
      console.log('eercInstance.publicKey:', eercInstance.publicKey);
      console.log('eercInstance.isDecryptionKeySet:', eercInstance.isDecryptionKeySet);
      console.log('amount:', amount, typeof amount);
      console.log('recipient:', recipient);
      console.log('auditorPubKey:', auditorPubKey);

      // Use the standard EERC withdraw method
      const result = await eercInstance.withdraw(
        amount,
        encryptedBalance,
        decryptedBalance,
        auditorPubKey,
        tokenAddress
      );

      return { transactionHash: result.transactionHash };
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }

  /**
   * Get user's withdrawal history
   * NOTE: This is a simplified implementation as the SDK doesn't have built-in history tracking
   *
   * @returns Array of withdrawal records (empty for now)
   */
  async function getMyHistory(): Promise<Array<WithdrawalHistoryRecord>> {
    if (!address || !walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    if (!eercInstance) {
      throw new Error('EERC SDK not initialized');
    }

    try {
      // TODO: Implement withdrawal history tracking
      // For now, return empty array since the SDK doesn't have built-in history
      console.log('Withdrawal history not yet implemented in SDK');
      return [];
    } catch (error) {
      console.error('Failed to load withdrawal history:', error);
      // Return empty array instead of throwing - history is optional
      return [];
    }
  }

  /**
   * Check if recipient address is likely a stealth wallet
   * (Fresh wallet with no previous transactions)
   */
  async function checkIfStealthWallet(address: string): Promise<boolean> {
    if (!publicClient) return false;

    try {
      const txCount = await publicClient.getTransactionCount({
        address: address as `0x${string}`,
      });
      return txCount === 0;
    } catch {
      return false;
    }
  }

  return {
    // Actions
    withdrawWithMetadata,
    getMyHistory,
    checkIfStealthWallet,

    // State
    isProcessing,
    isReady: !!address && !!walletClient && !!publicClient && !!eercInstance,
    connectedAddress: address,
    sdkInitialized: !!eercInstance,
  };
}

/**
 * Withdrawal history record type
 */
export interface WithdrawalHistoryRecord {
  owner: string;
  amount: string;
  recipient: string;
  nonce: string;
  deadline: string;
  timestamp: number;
  transactionHash?: string;
}
