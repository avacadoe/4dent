// Contract addresses - WORKING deployment Oct 14, 2025
// Auditor keys set directly via setAuditorPublicKeyDirect
// Auditor keys MATCH auditor-keys.json (generated 2025-10-14T05:57:13.242Z)
export const CONTRACTS = {
	EERC_STANDALONE: "0x5E9c6F952fB9615583182e70eDDC4e6E4E0aC0e0",
	EERC_CONVERTER: "0xB74d1e1c1dC61a709eD73ca48015A6d625e26641", // WORKING: Keys match perfectly
	ERC20: "0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD",
	REGISTRAR: "0x37cA898f669bDE5257a191c716B50FA1480105F8", // OLD registrar (you're already registered)
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
