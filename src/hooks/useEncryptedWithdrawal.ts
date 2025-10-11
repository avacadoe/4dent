import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { generateEncryptionRandomness } from '../utils/addressEncryption';
import { CONTRACTS } from '../config/contracts';

/**
 * Temporary ABI for encrypted withdrawal functions
 * Will be moved to contracts.ts config
 */
const ENCRYPTED_WITHDRAWAL_ABI = [
    {
        "type": "function",
        "name": "registerEncryptedIndex",
        "inputs": [
            {"name": "randomness", "type": "uint256"}
        ],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawViaIndex",
        "inputs": [
            {"name": "userIndex", "type": "uint256"},
            {"name": "tokenId", "type": "uint256"},
            {"name": "recipient", "type": "address"},
            {
                "name": "proof",
                "type": "tuple",
                "components": [
                    {
                        "name": "proofPoints",
                        "type": "tuple",
                        "components": [
                            {"name": "a", "type": "uint256[2]"},
                            {"name": "b", "type": "uint256[2][2]"},
                            {"name": "c", "type": "uint256[2]"}
                        ]
                    },
                    {"name": "publicSignals", "type": "uint256[16]"}
                ]
            },
            {"name": "balancePCT", "type": "uint256[7]"}
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "name": "getMyIndex",
        "type": "function",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{"name": "", "type": "uint256"}]
    },
    {
        "name": "hasIndex",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "user", "type": "address"}],
        "outputs": [{"name": "", "type": "bool"}]
    },
    {
        "type": "function",
        "name": "getEncryptedAddress",
        "inputs": [{"name": "index", "type": "uint256"}],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "components": [
                    {
                        "name": "c1",
                        "type": "tuple",
                        "components": [
                            {"name": "x", "type": "uint256"},
                            {"name": "y", "type": "uint256"}
                        ]
                    },
                    {
                        "name": "c2",
                        "type": "tuple",
                        "components": [
                            {"name": "x", "type": "uint256"},
                            {"name": "y", "type": "uint256"}
                        ]
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getAuditorPublicKeyForAddressEncryption",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "components": [
                    {"name": "x", "type": "uint256"},
                    {"name": "y", "type": "uint256"}
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "EncryptedIndexRegistered",
        "inputs": [
            {"name": "index", "type": "uint256", "indexed": true},
            {"name": "encryptedAddressHash", "type": "bytes32", "indexed": false}
        ]
    },
    {
        "type": "event",
        "name": "WithdrawViaIndex",
        "inputs": [
            {"name": "userIndex", "type": "uint256", "indexed": true},
            {"name": "amount", "type": "uint256", "indexed": false},
            {"name": "tokenId", "type": "uint256", "indexed": false},
            {"name": "balancePCT", "type": "uint256[7]", "indexed": false},
            {"name": "recipient", "type": "address", "indexed": true}
        ]
    }
] as const;

/**
 * Proof structure from @avalabs/eerc-sdk
 */
export interface WithdrawProof {
    proofPoints: {
        a: [bigint, bigint];
        b: [[bigint, bigint], [bigint, bigint]];
        c: [bigint, bigint];
    };
    publicSignals: bigint[]; // Should be 16 elements
}

/**
 * Hook for encrypted withdrawal functionality
 *
 * Privacy Model:
 * - User registers once to get numeric index
 * - Withdrawals use index (public) instead of address (hidden)
 * - Recipient address is public (users should use stealth wallets)
 * - Auditor can decrypt address-to-index mappings
 */
export function useEncryptedWithdrawal() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // Check if user has encrypted index
    const { data: hasIndex, refetch: refetchHasIndex } = useReadContract({
        address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
        abi: ENCRYPTED_WITHDRAWAL_ABI,
        functionName: 'hasIndex',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    });

    // Get user's assigned index
    const { data: userIndex, refetch: refetchUserIndex } = useReadContract({
        address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
        abi: ENCRYPTED_WITHDRAWAL_ABI,
        functionName: 'getMyIndex',
        query: {
            enabled: !!address && !!hasIndex
        }
    });

    // Get auditor's public key for address encryption
    const { data: auditorPublicKey } = useReadContract({
        address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
        abi: ENCRYPTED_WITHDRAWAL_ABI,
        functionName: 'getAuditorPublicKeyForAddressEncryption'
    });

    /**
     * Register for encrypted withdrawals
     * Assigns user a numeric index and stores encrypted address mapping
     *
     * @returns Transaction hash
     */
    async function registerForEncryptedIndex(): Promise<`0x${string}`> {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        // Generate cryptographically secure randomness
        const randomness = generateEncryptionRandomness();

        // Call contract to register
        // Contract will:
        // 1. Assign next available index
        // 2. Encrypt user's address (msg.sender) with auditor's public key
        // 3. Store encrypted address at index
        // 4. Emit EncryptedIndexRegistered event
        const hash = await writeContractAsync({
            address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
            abi: ENCRYPTED_WITHDRAWAL_ABI,
            functionName: 'registerEncryptedIndex',
            args: [randomness]
        });

        // Refetch index status after registration
        await refetchHasIndex();
        await refetchUserIndex();

        return hash;
    }

    /**
     * Perform encrypted withdrawal using index
     *
     * Privacy guarantees:
     * - Transaction calldata shows userIndex (public number)
     * - Transaction calldata does NOT show initiator address
     * - Recipient address IS visible (recommend stealth wallet)
     * - Only auditor can decrypt which address owns which index
     *
     * @param tokenId - The token ID to withdraw
     * @param recipient - Where to send the tokens (recommend stealth wallet)
     * @param proof - Withdraw proof from @avalabs/eerc-sdk
     * @param balancePCT - Balance PCT array [7]
     * @returns Transaction hash
     */
    async function withdrawViaIndex(
        tokenId: bigint,
        recipient: string,
        proof: WithdrawProof,
        balancePCT: bigint[]
    ): Promise<`0x${string}`> {
        if (!address) {
            throw new Error('Wallet not connected');
        }
        if (!userIndex) {
            throw new Error('Not registered for encrypted withdrawals. Register first.');
        }
        if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
            throw new Error('Invalid recipient address');
        }

        // Contract verifies:
        // 1. msg.sender owns userIndex
        // 2. ZK proof validates sufficient encrypted balance
        // 3. Homomorphically subtracts from encrypted balance
        // 4. Transfers ERC20 from contract reserve to recipient
        const hash = await writeContractAsync({
            address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
            abi: ENCRYPTED_WITHDRAWAL_ABI,
            functionName: 'withdrawViaIndex',
            args: [
                userIndex as bigint,
                tokenId,
                recipient as `0x${string}`,
                proof,
                balancePCT as [bigint, bigint, bigint, bigint, bigint, bigint, bigint]
            ]
        });

        return hash;
    }

    /**
     * Get encrypted address stored at an index
     * Only useful for auditor decryption
     */
    async function getEncryptedAddress(index: bigint) {
        // This is public data but useless without auditor's private key
        // Auditor uses this to decrypt address-to-index mappings
        return useReadContract({
            address: CONTRACTS.EERC_CONVERTER as `0x${string}`,
            abi: ENCRYPTED_WITHDRAWAL_ABI,
            functionName: 'getEncryptedAddress',
            args: [index]
        });
    }

    return {
        // State
        hasIndex: !!hasIndex,
        userIndex: userIndex as bigint | undefined,
        auditorPublicKey,

        // Actions
        registerForEncryptedIndex,
        withdrawViaIndex,
        getEncryptedAddress,

        // Refresh functions
        refetchHasIndex,
        refetchUserIndex
    };
}
