import { useEffect, useState } from "react";
import { useMetadataWithdrawal, type WithdrawalHistoryRecord } from "../../hooks/useMetadataWithdrawal";
import { METADATA_WITHDRAWAL } from "../../config/contracts";

interface WithdrawalHistoryProps {
	isOpen?: boolean;
}

/**
 * Withdrawal History Component
 *
 * Displays user's withdrawal history by decrypting their own metadata
 * Demonstrates USER SOVEREIGNTY - only user can decrypt their own records
 */
export function WithdrawalHistory({ isOpen = false }: WithdrawalHistoryProps) {
	const [history, setHistory] = useState<WithdrawalHistoryRecord[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isExpanded, setIsExpanded] = useState(isOpen);

	const { getMyHistory, isReady } = useMetadataWithdrawal();

	useEffect(() => {
		if (isReady && isExpanded) {
			loadHistory();
		}
	}, [isReady, isExpanded]);

	async function loadHistory() {
		setIsLoading(true);
		setError(null);

		try {
			const records = await getMyHistory();
			setHistory(records);
		} catch (err) {
			console.error("Failed to load withdrawal history:", err);
			setError("Failed to decrypt withdrawal history. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	if (!METADATA_WITHDRAWAL.ENABLED) {
		return null;
	}

	return (
		<div className="border border-cyber-green/30 bg-black/10 rounded-lg overflow-hidden">
			{/* Header */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full p-4 flex items-center justify-between hover:bg-cyber-green/5 transition-colors"
			>
				<div className="flex items-center gap-2">
					<span className="text-cyber-green font-bold text-sm">
						🔐 Your Withdrawal History
					</span>
					<span className="text-xs text-cyber-gray font-mono">
						(Only you can decrypt this)
					</span>
				</div>
				<span className="text-cyber-green text-xl">
					{isExpanded ? "−" : "+"}
				</span>
			</button>

			{/* Content */}
			{isExpanded && (
				<div className="p-4 border-t border-cyber-green/20">
					<p className="text-xs text-cyber-gray font-mono mb-4">
						Your withdrawal records are encrypted on-chain. Only you can decrypt and
						view them with your private key. Not stored on any centralized server.
					</p>

					{/* Loading State */}
					{isLoading && (
						<div className="text-center py-8">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyber-green border-t-transparent"></div>
							<p className="text-sm text-cyber-gray font-mono mt-2">
								Decrypting your records...
							</p>
						</div>
					)}

					{/* Error State */}
					{error && (
						<div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4">
							<p className="text-xs text-red-400 font-mono">{error}</p>
							<button
								onClick={loadHistory}
								className="text-xs text-cyber-green hover:underline mt-2"
							>
								Try Again
							</button>
						</div>
					)}

					{/* Empty State */}
					{!isLoading && !error && history.length === 0 && (
						<div className="text-center py-8">
							<p className="text-sm text-cyber-gray font-mono">
								No metadata withdrawals yet
							</p>
							<p className="text-xs text-cyber-gray/60 font-mono mt-1">
								Your encrypted withdrawal history will appear here
							</p>
						</div>
					)}

					{/* History Records */}
					{!isLoading && !error && history.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs text-cyber-green font-mono">
									{history.length} withdrawal{history.length === 1 ? "" : "s"} found
								</p>
								<button
									onClick={loadHistory}
									className="text-xs text-cyber-green hover:underline font-mono"
								>
									🔄 Refresh
								</button>
							</div>

							{history.map((record, index) => (
								<div
									key={index}
									className="bg-cyber-dark/50 p-3 rounded border border-cyber-green/10 hover:border-cyber-green/30 transition-colors"
								>
									<div className="text-xs font-mono space-y-1.5">
										{/* Amount */}
										<div className="flex justify-between items-center">
											<span className="text-cyber-gray">Amount:</span>
											<span className="text-cyber-green font-bold">
												{record.amount} tokens
											</span>
										</div>

										{/* Recipient */}
										<div className="flex justify-between items-start gap-2">
											<span className="text-cyber-gray">To:</span>
											<span className="text-cyber-green text-right break-all">
												{record.recipient.slice(0, 6)}...{record.recipient.slice(-4)}
											</span>
										</div>

										{/* Date */}
										<div className="flex justify-between items-center">
											<span className="text-cyber-gray">Date:</span>
											<span className="text-cyber-green">
												{new Date(record.timestamp).toLocaleString()}
											</span>
										</div>

										{/* Nonce */}
										<div className="flex justify-between items-center">
											<span className="text-cyber-gray">Nonce:</span>
											<span className="text-cyber-green/70">{record.nonce}</span>
										</div>

										{/* Transaction Hash (if available) */}
										{record.transactionHash && (
											<div className="flex justify-between items-start gap-2 pt-1 border-t border-cyber-green/10">
												<span className="text-cyber-gray">Tx:</span>
												<a
													href={`https://testnet.snowtrace.io/tx/${record.transactionHash}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-cyber-green hover:underline text-right break-all"
												>
													{record.transactionHash.slice(0, 6)}...
													{record.transactionHash.slice(-4)}
												</a>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}

					{/* Privacy Info */}
					<div className="mt-4 pt-4 border-t border-cyber-green/20">
						<details className="text-xs">
							<summary className="text-cyber-green cursor-pointer hover:underline font-mono">
								🔒 How does this work?
							</summary>
							<div className="text-cyber-gray font-mono mt-2 space-y-2 bg-black/20 p-3 rounded">
								<p>
									Your withdrawal data is encrypted with YOUR public key before being
									emitted as blockchain events.
								</p>
								<p>
									Only YOU can decrypt these events with your private key. The auditor
									also receives an encrypted copy for compliance.
								</p>
								<p className="text-cyber-green">
									✅ Decentralized: No server stores your data
									<br />
									✅ Sovereign: Only you control access
									<br />
									✅ Compliant: Auditor can verify if needed
								</p>
							</div>
						</details>
					</div>
				</div>
			)}
		</div>
	);
}
