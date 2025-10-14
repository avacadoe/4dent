# 3dent - Privacy-Enhanced eERC Token Interface

A React application showcasing **privacy-enhanced encrypted ERC-20 tokens (eERC)** with custom metadata-based withdrawals for maximum privacy.

## What Are eERC Tokens?

eERC (encrypted ERC-20) tokens provide **on-chain privacy** using zero-knowledge proofs and ElGamal encryption:

- **Hidden balances** - All balances encrypted on-chain
- **Private transfers** - Transfer amounts remain encrypted
- **Zero-knowledge proofs** - Prove operations without revealing amounts
- **Auditor support** - Optional third-party auditability

## What We're Building

Standard eERC implementations have **privacy limitations** during withdrawals:

- **Standard withdrawal**: Main wallet address visible on-chain when withdrawing

### Our Enhancement: Metadata-Based Withdrawals

We've extended the eERC SDK to support **metadata-based encrypted withdrawals**:

#### Privacy Benefits
- **Maximum privacy**: Main wallet NEVER appears on-chain
- **Dual encryption**: Both user and auditor can decrypt withdrawal records
- **User sovereignty**: Users maintain their own withdrawal history
- **Stealth wallet compatible**: Withdraw to fresh addresses for complete unlinkability

#### How It Works
1. User generates encrypted proof containing withdrawal details (amount, recipient, nonce, deadline)
2. Proof is encrypted TWICE: once for user, once for auditor
3. User signs encrypted proofs with EIP-712 signature
4. ZK proof validates the withdrawal without revealing amounts
5. Encrypted metadata stored on-chain in `PrivateMessage` events
6. Only user (and auditor) can decrypt their records

## SDK Modifications

We maintain a **fork of the eERC SDK** with the following additions:

### New Methods

#### `generateEncryptedProof()`
Generates dual-encrypted withdrawal proofs (user + auditor) containing:
- Withdrawal amount
- Recipient address
- Nonce (for replay protection)
- Deadline (for time-limited signatures)

#### `generateEncryptedProofSignature()`
Creates EIP-712 signature over encrypted proofs for verification on-chain.

#### `withdrawWithEncryptedProof()`
Executes metadata-based withdrawal:
- Submits encrypted proofs + signature + ZK proof
- Emits `PrivateMessage` event with encrypted metadata
- Transfers tokens to recipient address

#### `getMyWithdrawalHistory()`
Queries and decrypts user's withdrawal history from `PrivateMessage` events.

### Contract Requirements

The eERC contract must support:
- `withdrawWithEncryptedProof()` function
- `PrivateMessage` event emission
- Auditor public key storage
- EIP-712 signature verification

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd 4dent
npm install
```

### 2. Link the Custom eERC SDK

We use a forked version of the eERC SDK with metadata withdrawal support.

**Option A: Local Development (Recommended)**

Clone the SDK fork locally:
```bash
cd ..
git clone https://github.com/avacadoe/teerc-sdk teerc-sdk
cd teerc-sdk
git checkout updated
npm install
npm run build
```

Link it to your project:
```bash
npm link
cd ../4dent
npm link @avalabs/ac-eerc-sdk
```

**Option B: Direct GitHub Install**

Edit `package.json` and change the SDK dependency:
```json
{
  "dependencies": {
    "@avalabs/ac-eerc-sdk": "github:avacadoe/teerc-sdk#updated"
  }
}
```

Then run:
```bash
npm install
```

### 3. Configure Contract Addresses

Edit `src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  EERC_STANDALONE: "0x5E9c6F952fB9615583182e70eDDC4e6E4E0aC0e0",
  EERC_CONVERTER: "0xB74d1e1c1dC61a709eD73ca48015A6d625e26641",
  ERC20: "0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD",
  REGISTRAR: "0x37cA898f669bDE5257a191c716B50FA1480105F8",
} as const;
```

**Important**: These are Avalanche Fuji testnet addresses. For mainnet or other networks:
1. Deploy your eERC contracts with metadata withdrawal support
2. Update addresses in `CONTRACTS` object
3. Verify contracts on block explorer

### 4. Circuit Files

ZK proof circuits must be available in `public/`:
- `RegistrationCircuit.wasm` + `RegistrationCircuit.groth16.zkey`
- `MintCircuit.wasm` + `MintCircuit.groth16.zkey`
- `TransferCircuit.wasm` + `TransferCircuit.groth16.zkey`
- `WithdrawCircuit.wasm` + `WithdrawCircuit.groth16.zkey`
- `BurnCircuit.wasm` + `BurnCircuit.groth16.zkey`

These files are already included in the repository.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Architecture

### Key Files

**Hooks**
- `src/hooks/useMetadataWithdrawal.ts` - Metadata withdrawal logic using SDK

**Configuration**
- `src/config/contracts.ts` - Contract addresses, circuit paths, feature flags

**Components**
- `src/components/eerc/` - eERC operation components
- `src/components/operations/MetadataWithdrawal.tsx` - Metadata withdrawal UI

**Utilities**
- `src/utils/stealthWallet.ts` - Stealth wallet helpers
- `src/utils/addressEncryption.ts` - Address encryption utilities

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Blockchain**: Wagmi + Viem (Ethereum interactions)
- **Wallet**: Reown AppKit (wallet connections)
- **Cryptography**: @zk-kit (Baby Jubjub curves), circomlibjs
- **ZK Proofs**: Groth16 circuits via SnarkJS
- **3D Graphics**: Three.js (via @react-three/fiber)

## Usage

### 1. Connect Wallet
Click "Connect Wallet" and choose your wallet provider (MetaMask, WalletConnect, etc.)

### 2. Register
First-time users must register to generate encryption keys for the eERC system.

### 3. Deposit Tokens
Deposit eERC tokens (requires ERC20 approval in converter mode).

### 4. Transfer
Transfer encrypted tokens to other registered users.

### 5. Withdraw (Standard)
Standard withdrawal exposes your main wallet on-chain.

### 6. Withdraw (Metadata - RECOMMENDED)
Maximum privacy withdrawal:
1. Enter recipient address (stealth wallet recommended)
2. Enter amount to withdraw
3. System generates dual-encrypted proofs
4. Sign EIP-712 message
5. Generate ZK proof and submit transaction
6. Your main wallet NEVER appears on-chain!

### 7. View History
Query and decrypt your personal withdrawal records from on-chain `PrivateMessage` events.

## Privacy Comparison

| Feature | Standard Withdrawal | Index Withdrawal | **Metadata Withdrawal** |
|---------|-------------------|------------------|------------------------|
| Main wallet hidden | ❌ Visible | ✅ Hidden | ✅ **Hidden** |
| Gas cost | Low | High (index storage) | **56% cheaper** |
| User sovereignty | ❌ No history | ❌ Relies on indexer | ✅ **User maintains records** |
| Auditor support | ❌ No | ⚠️ Limited | ✅ **Full dual encryption** |
| Privacy score | 3/5 | 4/5 | **5/5 Maximum** |

## Development

### Type Checking
```bash
tsc --noEmit
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Testing (Avalanche Fuji Testnet)

1. **Get testnet AVAX**: https://faucet.avax.network/
2. **Get test ERC20 tokens**: Mint from `0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD`
3. **Register**: Generate your encryption keys
4. **Test privacy withdrawals**: Use metadata withdrawal to stealth wallets

### Block Explorer
- **Fuji Testnet**: https://testnet.snowtrace.io
- **Your eERC contract**: https://testnet.snowtrace.io/address/0xB74d1e1c1dC61a709eD73ca48015A6d625e26641

## Repository Structure

```
3dent/
├── src/
│   ├── components/       # React components
│   │   ├── eerc/        # eERC-specific components
│   │   └── operations/  # Operation forms (mint, transfer, withdraw)
│   ├── hooks/           # Custom React hooks
│   │   └── useMetadataWithdrawal.ts  # Metadata withdrawal logic
│   ├── config/          # Configuration
│   │   └── contracts.ts # Contract addresses & circuit paths
│   ├── utils/           # Utility functions
│   └── pages/           # Page components
├── public/              # Static assets (circuits)
└── package.json         # Dependencies
```

## SDK Fork Repository

**Source**: https://github.com/avacadoe/teerc-sdk/tree/updated

**Branch**: `updated`

Changes from upstream:
- Added `generateEncryptedProof()` for dual encryption
- Added `generateEncryptedProofSignature()` for EIP-712 signing
- Added `withdrawWithEncryptedProof()` for metadata withdrawals
- Added `getMyWithdrawalHistory()` for decrypting withdrawal records
- Enhanced privacy guarantees (5/5 vs 3/5)

## Contributing

Contributions welcome! Areas of interest:
- UI/UX improvements
- Additional privacy features
- Performance optimizations
- Test coverage
- Documentation

## License

MIT

## Resources

- **eERC Specification**: [Original eERC whitepaper]
- **SDK Fork**: https://github.com/avacadoe/teerc-sdk
- **Avalanche Fuji Faucet**: https://faucet.avax.network/
- **Block Explorer**: https://testnet.snowtrace.io

## Support

For issues or questions:
1. Check existing GitHub issues
2. Open a new issue with detailed description
3. Include transaction hashes for on-chain issues
