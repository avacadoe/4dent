/**
 * Address Encryption Utilities
 *
 * Provides cryptographic functions for encrypting Ethereum addresses
 * using ElGamal encryption on Baby Jubjub elliptic curve.
 *
 * Privacy Model:
 * - User address encrypted with auditor's public key
 * - Stored on-chain at user's assigned index
 * - Only auditor can decrypt with private key
 */

/**
 * Generate cryptographically secure random number for encryption
 * Returns a 256-bit random number
 */
export function generateEncryptionRandomness(): bigint {
    // Use browser's crypto API for secure randomness
    const randomBytes = new Uint8Array(32); // 256 bits
    crypto.getRandomValues(randomBytes);

    // Convert bytes to bigint
    let randomness = 0n;
    for (let i = 0; i < randomBytes.length; i++) {
        randomness = (randomness << 8n) | BigInt(randomBytes[i]);
    }

    return randomness;
}

/**
 * Point on elliptic curve (x, y coordinates)
 */
export interface Point {
    x: bigint;
    y: bigint;
}

/**
 * Encrypted address (two elliptic curve points)
 */
export interface EncryptedAddress {
    c1: Point;  // Randomness * Generator
    c2: Point;  // Message + Randomness * PublicKey
}

/**
 * Encrypt an Ethereum address using ElGamal on Baby Jubjub curve
 *
 * @param address - Ethereum address to encrypt
 * @param auditorPubKey - Auditor's public key (point on curve)
 * @param randomness - Random value for encryption (from generateEncryptionRandomness)
 * @returns Encrypted address (two curve points)
 *
 * Note: This is a simplified implementation for the frontend.
 * The actual encryption happens in the smart contract.
 * This function is mainly for understanding the flow.
 */
export function encryptAddress(
    address: string,
    auditorPubKey: Point,
    randomness: bigint
): EncryptedAddress {
    // In production, this would use proper Baby Jubjub curve operations
    // For now, we rely on the smart contract to do the encryption
    // This is just a placeholder to demonstrate the structure

    // Convert address to number (remove 0x prefix)
    const addressNum = BigInt(address);

    // Placeholder: In production, these would be proper elliptic curve operations
    // c1 = randomness * G (where G is generator point)
    // c2 = message + randomness * PublicKey

    return {
        c1: {
            x: randomness, // Placeholder
            y: randomness + 1n, // Placeholder
        },
        c2: {
            x: addressNum + randomness, // Placeholder
            y: addressNum + randomness + 1n, // Placeholder
        }
    };
}

/**
 * Format encrypted address for display
 */
export function formatEncryptedAddress(encrypted: EncryptedAddress): string {
    return `C1(${encrypted.c1.x.toString().slice(0, 8)}..., ${encrypted.c1.y.toString().slice(0, 8)}...) ` +
           `C2(${encrypted.c2.x.toString().slice(0, 8)}..., ${encrypted.c2.y.toString().slice(0, 8)}...)`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Hash encrypted address for efficient storage/comparison
 * Uses keccak256 of concatenated coordinates
 */
export function hashEncryptedAddress(encrypted: EncryptedAddress): string {
    // In production, use proper keccak256
    // For now, return a simple representation
    const data = `${encrypted.c1.x}${encrypted.c1.y}${encrypted.c2.x}${encrypted.c2.y}`;
    return `0x${data.slice(0, 64)}`;
}
