# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally

### TypeScript
- Use `tsc --noEmit` for type checking (no dedicated script in package.json)
- TypeScript configured with strict mode and unused parameter/local checks

## Architecture Overview

This is a React application showcasing cryptographic operations and blockchain interactions, specifically focused on:

### Core Functional Areas
1. **eERC (Encrypted ERC)** - Privacy-preserving token operations using zero-knowledge proofs
2. **ECC (Elliptic Curve Cryptography)** - BabyJubjub curve operations and ElGamal encryption
3. **Hash Functions** - Poseidon and MiMC hash implementations
4. **Poseidon Encryption** - Symmetric encryption using Poseidon cipher

### Key Technologies
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **3D Graphics**: Three.js via @react-three/fiber and @react-three/drei
- **Blockchain**: Wagmi + Viem for Ethereum interactions, Reown AppKit for wallet connections
- **Cryptography**: @zk-kit packages for Baby Jubjub curves, circomlibjs, @darkforest_eth/hashing
- **ZK Proofs**: Uses Groth16 circuits (wasm/zkey files in `public/` directory) for eERC operations

### Application Structure
- **Pages**: `src/pages/` - Four main sections (EERC, ECC, Hashes, PoseidonEncrypt)
- **Components**: `src/components/` - Organized by feature (`ecc/`, `eerc/`, `elgamal/`, `hash/`, `operations/`, `layout/`)
- **Hooks**: `src/hooks/` - Custom React hooks including `useMetadataWithdrawal`, `useEncryptedWithdrawal`, `useHashCalculation`
- **Utils**: `src/utils/` and `src/pkg/` - Cryptographic utilities and helper functions
- **Configuration**: `src/config/contracts.ts` - Contract addresses, circuit paths, and feature flags

### eERC Implementation
- **Two modes**: Standalone and Converter (configurable via `src/config/contracts.ts`)
- **Network**: Avalanche Fuji testnet contracts
- **Operations**: Mint, transfer, withdraw (standard + metadata-based), burn with ZK proofs
- **SDK Integration**: Uses `@avalabs/ac-eerc-sdk` (linked from `../eerc-sdk-fork`)
  - SDK location: `/home/ghoul/graveyard/avacadoe/eerc-sdk-fork`
  - Linked via `npm link` to `@avalabs/ac-eerc-sdk`
  - If SDK changes, rebuild SDK and restart dev server

### Metadata Withdrawal System
- **Privacy Model**: Maximum privacy (5/5 score) - main wallet never on-chain
- **Features**: Dual encryption (user + auditor), EIP-712 signatures, stealth wallet recommendations
- **Hook**: `useMetadataWithdrawal` in `src/hooks/useMetadataWithdrawal.ts`
- **Utilities**: Stealth wallet helpers in `src/utils/stealthWallet.ts` and address encryption in `src/utils/addressEncryption.ts`
- **Configuration**: `METADATA_WITHDRAWAL` and `ENCRYPTED_WITHDRAWAL` constants in `src/config/contracts.ts`
- **Implementation Status**: Backend complete, frontend integration in progress (see PLAN.md)

### Build Configuration
- **Vite**: Configured with Node.js polyfills for crypto operations (`vite.config.ts`)
- **Node Polyfills**: Includes crypto, buffer, stream, util, process for browser compatibility
- **Path Aliases**: Node module aliases configured for browser (e.g., `node:crypto` → `crypto`)
- **Optimized Deps**: Pre-bundled crypto libraries (poseidon-lite, snarkjs, blake-hash, js-sha256)
- **TypeScript**: Strict configuration with ESNext modules, `@types/node` for Node.js types

### Styling
- Tailwind CSS with custom "cyber" theme colors (cyber-green, cyber-dark, cyber-black)
- Consistent mono font family for technical content

### Contract Addresses (Avalanche Fuji Testnet)
- **EERC Standalone**: `0x5E9c6F952fB9615583182e70eDDC4e6E4E0aC0e0`
- **EERC Converter**: `0x65b92b0DC1BfD159759a3B2c97D3Eb1B8dd0B228`
- **ERC20**: `0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD`
- **Registrar**: `0x37cA898f669bDE5257a191c716B50FA1480105F8`

All contracts deployed on Fuji testnet - verify on https://testnet.snowtrace.io