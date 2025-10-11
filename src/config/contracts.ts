// Contract addresses - Fresh deployment Oct 10, 2025
export const CONTRACTS = {
	EERC_STANDALONE: "0x5E9c6F952fB9615583182e70eDDC4e6E4E0aC0e0",
	EERC_CONVERTER: "0x65b92b0DC1BfD159759a3B2c97D3Eb1B8dd0B228", // EncryptedERC (Fuji)
	ERC20: "0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD",
	REGISTRAR: "0x37cA898f669bDE5257a191c716B50FA1480105F8", // eERC Registrar (Fuji)
} as const;

// Circuit configuration
export const CIRCUIT_CONFIG = {
	register: {
		wasm: "/RegistrationCircuit.wasm",
		zkey: "/RegistrationCircuit.groth16.zkey",
	},
	mint: {
		wasm: "/MintCircuit.wasm",
		zkey: "/MintCircuit.groth16.zkey",
	},
	transfer: {
		wasm: "/TransferCircuit.wasm",
		zkey: "/TransferCircuit.groth16.zkey",
	},
	withdraw: {
		wasm: "/WithdrawCircuit.wasm",
		zkey: "/WithdrawCircuit.groth16.zkey",
	},
} as const;

// Explorer URL
export const EXPLORER_BASE_URL = "https://testnet.snowtrace.io/address/";
export const EXPLORER_BASE_URL_TX = "https://testnet.snowtrace.io/tx/";

// Mode types
export type EERCMode = "standalone" | "converter";

// Encrypted withdrawal configuration
export const ENCRYPTED_WITHDRAWAL = {
	ENABLED: true,
	RECOMMEND_STEALTH_WALLETS: true,
	STEALTH_WALLET_SERVICES: [
		{ name: "Umbra", url: "https://app.umbra.cash" },
		{ name: "Railgun", url: "https://railgun.org" },
	],
} as const;

// Metadata withdrawal configuration (MAXIMUM PRIVACY: 5/5)
export const METADATA_WITHDRAWAL = {
	ENABLED: true,
	PRIVACY_SCORE: "5/5 - Maximum",
	GAS_SAVINGS: "56% vs index system",
	RECOMMEND_STEALTH_WALLETS: true,
	FEATURES: {
		DUAL_ENCRYPTION: true, // User + Auditor can both decrypt
		USER_SOVEREIGNTY: true, // User maintains own records
		NO_INDEX_STORAGE: true, // No on-chain index mappings
		HIDDEN_MAIN_WALLET: true, // Main wallet never on-chain
	},
} as const;
