import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { useEncryptedWithdrawal } from "../../hooks/useEncryptedWithdrawal";
import { useMetadataWithdrawal } from "../../hooks/useMetadataWithdrawal";
import { ENCRYPTED_WITHDRAWAL, METADATA_WITHDRAWAL } from "../../config/contracts";
import { isValidAddress } from "../../utils/stealthWallet";

interface WithdrawProps {
	handlePrivateWithdraw: (amount: string) => Promise<void>;
	isDecryptionKeySet: boolean;
	encryptedBalance?: bigint[];
	decryptedBalance?: bigint;
	tokenAddress?: string;
}

export function Withdraw({
	handlePrivateWithdraw,
	isDecryptionKeySet,
	encryptedBalance,
	decryptedBalance,
	tokenAddress,
}: WithdrawProps) {
	const { address } = useAccount();
	const [withdrawAmount, setWithdrawAmount] = useState<string>("");
	const [recipient, setRecipient] = useState<string>("");
	const [useEncrypted, setUseEncrypted] = useState<boolean>(false);
	const [useMetadata, setUseMetadata] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	// Encrypted withdrawal hook (only if feature enabled)
	const encryptedWithdrawal = ENCRYPTED_WITHDRAWAL.ENABLED
		? useEncryptedWithdrawal()
		: {
			hasIndex: false,
			userIndex: undefined,
			registerForEncryptedIndex: async (): Promise<any> => undefined,
			withdrawViaIndex: async (): Promise<any> => undefined,
			getEncryptedAddress: async (): Promise<any> => undefined,
			refetchHasIndex: async () => undefined,
			refetchUserIndex: async () => undefined,
			auditorPublicKey: undefined,
		};

	const {
		hasIndex,
		userIndex,
		registerForEncryptedIndex,
		withdrawViaIndex
	} = encryptedWithdrawal;

	// Metadata withdrawal hook (MAXIMUM PRIVACY: 5/5)
	const {
		withdrawWithMetadata,
		isProcessing: isMetadataProcessing,
		isReady: isMetadataReady,
	} = useMetadataWithdrawal();
	return (
		<>
			<div className="flex-1">
				<h3 className="text-cyber-green font-bold mb-2">Withdraw</h3>
				<p className="text-sm text-cyber-gray font-mono leading-relaxed mb-4">
					When user try to withdraw tokens, user generates a proof that the
					encrypted balance is sufficient for the requested withdrawn amount —
					without revealing the actual balance. Contract will then encrypt the
					withdrawn amount using user's public key and homomorphically subtract
					it from the user's encrypted balance. Once the proof is verified, the
					corresponding ERC-20 tokens are transferred back to user's wallet.
				</p>
			</div>

			{/* Metadata Withdrawal Toggle */}
			{METADATA_WITHDRAWAL.ENABLED && (
				<div className="mb-4 p-3 bg-cyber-dark/50 rounded-lg border border-cyber-green/20">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={useMetadata}
							onChange={(e) => setUseMetadata(e.target.checked)}
							className="w-4 h-4 accent-cyber-green"
						/>
						<span className="text-sm font-mono text-cyber-green">
							🔒 Use Metadata Withdrawal (MAXIMUM Privacy)
						</span>
					</label>

					{useMetadata && (
						<div className="mt-3 space-y-3">
							{/* Privacy Score */}
							<div className="text-xs text-cyber-green font-mono space-y-1 bg-black/20 p-2 rounded">
								<div>✅ Privacy Score: {METADATA_WITHDRAWAL.PRIVACY_SCORE}</div>
								<div>💰 Gas Savings: {METADATA_WITHDRAWAL.GAS_SAVINGS}</div>
								<div>🔐 Your address: Hidden</div>
								<div>📜 Your records: Encrypted for you</div>
							</div>

							{/* Recipient Input */}
							<div>
								<label className="text-xs text-cyber-gray font-mono block mb-1">
									Recipient Address
								</label>
								<input
									type="text"
									value={recipient}
									onChange={(e) => setRecipient(e.target.value)}
									placeholder="0x..."
									className="w-full bg-cyber-dark text-cyber-gray px-4 py-2 rounded-lg border border-cyber-green/20 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green outline-none font-mono text-sm"
								/>
								{recipient && !isValidAddress(recipient) && (
									<p className="text-xs text-red-500 font-mono mt-1">
										⚠️ Invalid Ethereum address
									</p>
								)}
								{recipient && isValidAddress(recipient) && (
									<p className="text-xs text-yellow-500/80 font-mono mt-1">
										💡 Recommend using a fresh stealth wallet as recipient
									</p>
								)}
							</div>

							{/* Stealth Wallet Info */}
							<details className="text-xs">
								<summary className="text-cyber-green cursor-pointer font-mono hover:underline">
									What's a stealth wallet?
								</summary>
								<div className="text-cyber-gray font-mono mt-2 space-y-1 bg-black/20 p-2 rounded">
									<p>A fresh wallet with no transaction history for maximum privacy.</p>
									<p className="text-cyber-green">Recommended services:</p>
									<ul className="list-disc list-inside space-y-1 ml-2">
										<li>
											<a
												href="https://app.umbra.cash"
												target="_blank"
												rel="noopener noreferrer"
												className="text-cyber-green hover:underline"
											>
												Umbra Protocol
											</a>
										</li>
										<li>
											<a
												href="https://railgun.org"
												target="_blank"
												rel="noopener noreferrer"
												className="text-cyber-green hover:underline"
											>
												Railgun
											</a>
										</li>
									</ul>
								</div>
							</details>
						</div>
					)}
				</div>
			)}

			<div>
				<input
					type="text"
					value={withdrawAmount}
					onChange={(e) => {
						const value = e.target.value.trim();
						if (/^\d*\.?\d{0,2}$/.test(value)) {
							setWithdrawAmount(value);
						}
					}}
					placeholder={"Amount in ether (eg. 1.5, 0.01)"}
					className="flex-1 bg-cyber-dark text-cyber-gray px-4 py-0.5 rounded-lg border border-cyber-green/20 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green outline-none font-mono w-full"
				/>
				<button
					type="button"
					className="bg-cyber-dark w-full text-cyber-green px-2 py-1 rounded-md text-sm border border-cyber-green/60 disabled:opacity-50 disabled:cursor-not-allowed mb-2 hover:bg-cyber-green/60 transition-all duration-200 font-mono mt-2"
					onClick={async () => {
						// Validation
						if (useMetadata && !isValidAddress(recipient)) {
							toast.error("Please enter a valid recipient address", {
								position: "top-right",
								autoClose: 3000,
								transition: Bounce,
							});
							return;
						}

						setLoading(true);

						try {
							if (useMetadata) {
								// Metadata withdrawal (MAXIMUM PRIVACY)
								toast.info("Initiating metadata withdrawal...", {
									position: "top-right",
									autoClose: 2000,
									transition: Bounce,
								});

								// Verify we have all required data
								if (!encryptedBalance || !decryptedBalance || !tokenAddress) {
									toast.error("Missing balance or token address data", {
										position: "top-right",
										autoClose: 3000,
										transition: Bounce,
									});
									setLoading(false);
									return;
								}

								// Execute metadata withdrawal
								const result = await withdrawWithMetadata(
									recipient,
									parseUnits(withdrawAmount, 18),
									encryptedBalance,
									decryptedBalance,
									tokenAddress
								);

								toast.success(
									<div>
										<p className="font-bold">✅ Metadata Withdrawal Complete!</p>
										<p className="text-xs mt-1">
											TX: {result.transactionHash.slice(0, 10)}...
											{result.transactionHash.slice(-8)}
										</p>
									</div>,
									{
										position: "top-right",
										autoClose: 5000,
										transition: Bounce,
									}
								);

								setWithdrawAmount("");
								setRecipient("");
								setUseMetadata(false);
							} else {
								// Standard withdrawal
								await handlePrivateWithdraw(withdrawAmount);
								setWithdrawAmount("");
							}
						} catch (error: any) {
							const isUserRejected = error?.message.includes("User rejected");

							toast.error(
								<div>
									<p>
										{isUserRejected
											? "Transaction rejected"
											: "An error occurred while withdrawing tokens. Please try again."}
									</p>
								</div>,
								{
									position: "top-right",
									autoClose: 5000,
									hideProgressBar: true,
									closeOnClick: true,
									pauseOnHover: false,
									draggable: true,
									progress: undefined,
									transition: Bounce,
								},
							);
						} finally {
							setLoading(false);
						}
					}}
					disabled={
						!withdrawAmount ||
						loading ||
						isMetadataProcessing ||
						!isDecryptionKeySet ||
						(useMetadata && (!recipient || !isValidAddress(recipient)))
					}
				>
					{loading || isMetadataProcessing
						? useMetadata
							? "🔒 Processing Metadata Withdrawal..."
							: "Withdrawing..."
						: useMetadata
						? "🔒 Withdraw with Metadata"
						: "Withdraw"}
				</button>
			</div>
		</>
	);
}
