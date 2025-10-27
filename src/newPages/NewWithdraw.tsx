import { useState, useEffect, useRef } from "react";
import {
    type CompatiblePublicClient,
    type CompatibleWalletClient,
    useEERC,
} from "@avalabs/eerc-sdk";
import {
    useAccount,
    usePublicClient,
    useWalletClient,
    useWaitForTransactionReceipt,
} from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { parseUnits, formatUnits } from "viem";
import { toast } from "react-toastify";
import { NewLayout, AmountInput, LoadingSpinner, StatusIndicator } from "../newComponents";
import { CIRCUIT_CONFIG, CONTRACTS, URLS, EXPLORER_BASE_URL_TX } from "../config/contracts";
import "../newStyles.css";

interface NewWithdrawProps {
    onNavigate: (page: string) => void;
    mode: "standalone" | "converter";
}

export function NewWithdraw({ onNavigate, mode }: NewWithdrawProps) {
    const [amount, setAmount] = useState("");
    const [withdrawAddress, setWithdrawAddress] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}`>("" as `0x${string}`);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState<"input" | "prove" | "withdraw">("input");
    const hasRedirectedRef = useRef(false);

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient({ chainId: avalancheFuji.id });
    const { data: walletClient } = useWalletClient();

    const { data: transactionReceipt, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: Boolean(txHash) },
        confirmations: 1,
    });

    const {
        isRegistered,
        symbol,
        useEncryptedBalance,
    } = useEERC(
        publicClient as CompatiblePublicClient,
        walletClient as CompatibleWalletClient,
        mode === "converter"
            ? CONTRACTS.EERC_CONVERTER
            : CONTRACTS.EERC_STANDALONE,
        URLS,
        CIRCUIT_CONFIG
    );

    const {
        withdraw,
        privateBurn,
        decimals,
        decryptedBalance,
        refetchBalance,
    } = useEncryptedBalance(mode === "converter" ? CONTRACTS.ERC20 : undefined);

    useEffect(() => {
        if (txHash && isSuccess && transactionReceipt) {
            toast.success(
                <div>
                    <p>Withdrawal successful!</p>
                    <a
                        href={`${EXPLORER_BASE_URL_TX}${transactionReceipt?.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-green underline"
                    >
                        View on Explorer →
                    </a>
                </div>
            );
            setTxHash("" as `0x${string}`);
            setIsProcessing(false);
            setCurrentStep("input");
            setAmount("");
            refetchBalance();
        }
    }, [txHash, isSuccess, transactionReceipt, refetchBalance]);

    // Redirect to registration if not registered (only once)
    useEffect(() => {
        if (!isRegistered && isConnected && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            const timer = setTimeout(() => {
                toast.info("Please complete registration first", {
                    autoClose: 2000,
                    toastId: "not-registered-withdraw"
                });
                onNavigate("registration");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isRegistered, isConnected, onNavigate]);

    const handleWithdraw = async () => {
        if (!isConnected || !address) {
            toast.error("Please connect your wallet");
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const parsedAmount = parseUnits(amount, Number(decimals || 18));
        
        if (decryptedBalance && parsedAmount > decryptedBalance) {
            toast.error("Insufficient encrypted balance");
            return;
        }

        setIsProcessing(true);

        try {
            setCurrentStep("prove");
            
            if (mode === "converter") {
                const { transactionHash } = await withdraw(parsedAmount);
                setCurrentStep("withdraw");
                setTxHash(transactionHash as `0x${string}`);
            } else {
                const { transactionHash } = await privateBurn(parsedAmount);
                setCurrentStep("withdraw");
                setTxHash(transactionHash as `0x${string}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Withdrawal failed");
            setIsProcessing(false);
            setCurrentStep("input");
        }
    };

    const currentBalance = decryptedBalance
        ? formatUnits(decryptedBalance, Number(decimals || 18))
        : "0.00";

    const remainingBalance = decryptedBalance && amount
        ? formatUnits(decryptedBalance - parseUnits(amount, Number(decimals || 18)), Number(decimals || 18))
        : currentBalance;

    const tokenSymbol = symbol || "eERC";

    if (!isConnected) {
        return (
            <NewLayout onNavigate={onNavigate} currentPage="withdraw">
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-5xl font-bold text-coral-red mb-6">
                        Connect Your Wallet
                    </h1>
                    <p className="text-lg text-gray-600">
                        Please connect your wallet to make withdrawals
                    </p>
                </div>
            </NewLayout>
        );
    }

    return (
        <NewLayout onNavigate={onNavigate} currentPage="withdraw">
            {/* Light red tint background */}
            <div className="absolute inset-0 bg-coral-red/[0.02] -mx-8 -my-8 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto space-y-6 relative">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between relative">
                    {/* Radial glow behind heading */}
                    <div
                        className="pointer-events-none absolute left-0 top-0 h-[160px] w-[160px] -translate-y-6 rounded-full md:h-[200px] md:w-[200px]"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,107,107,0.12) 0%, rgba(255,107,107,0) 70%)",
                        }}
                        aria-hidden="true"
                    />
                    
                    <div className="relative">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">
                            <span>Withdraw Intent</span>
                            <span aria-hidden>•</span>
                            <span className="rounded-[2px] border border-black/10 bg-white/70 px-1.5 py-0.5">
                                batched withdrawal
                            </span>
                        </div>
                        <h1 
                            className="text-5xl font-bold text-coral-red"
                            style={{
                                fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Withdraw Intent
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm">
                            Create a withdrawal intent. Your profile will be locked until the batch is approved by the community.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onNavigate("dashboard")}
                        className="btn-secondary"
                    >
                        ← Back
                    </button>
                </div>

                {!isRegistered && (
                    <StatusIndicator
                        status="error"
                        message="Registration Required"
                        variant="card"
                        details="You need to register with the EERC system before making withdrawals."
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <div className="frost-card p-6">
                            <p className="mono-kicker text-coral-red mb-4">
                                [ AMOUNT ]
                            </p>
                            <AmountInput
                                value={amount}
                                onChange={setAmount}
                                symbol={tokenSymbol}
                                availableBalance={currentBalance}
                                placeholder="0.00"
                                showQuickAmounts={true}
                                onMax={() => setAmount(currentBalance)}
                            />
                        </div>

                        {/* Withdraw Address Input */}
                        <div className="frost-card p-6">
                            <p className="mono-kicker text-coral-red mb-4">
                                [ WITHDRAW TO ADDRESS ]
                            </p>
                            <input
                                type="text"
                                value={withdrawAddress}
                                onChange={(e) => setWithdrawAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full px-4 py-3 rounded-[8px] border border-black/10 bg-white/70 font-mono text-sm focus:outline-none focus:border-coral-red/40 transition-colors"
                            />
                            <p className="text-xs text-gray-600 mt-2">
                                Enter the destination address (unregistered addresses allowed)
                            </p>
                        </div>

                        {/* Balance Preview */}
                        <div className="frost-card p-6">
                            <p className="mono-kicker text-gray-600 mb-4">
                                [ BALANCE PREVIEW ]
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-[8px] border border-black/10 bg-white/70 p-4">
                                    <p className="text-xs text-gray-600 mb-2">
                                        Current Balance
                                    </p>
                                    <p className="text-xl font-bold text-black">
                                        {currentBalance} {tokenSymbol}
                                    </p>
                                </div>
                                <div className="rounded-[8px] border border-black/10 bg-white/70 p-4">
                                    <p className="text-xs text-gray-600 mb-2">
                                        After Withdrawal
                                    </p>
                                    <p className="text-xl font-bold text-emerald-green">
                                        {remainingBalance} {tokenSymbol}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Insufficient Balance Warning */}
                        {decryptedBalance && amount && parseUnits(amount, Number(decimals || 18)) > decryptedBalance ? (
                            <StatusIndicator
                                status="error"
                                message="Insufficient Balance"
                                variant="card"
                                details={`You only have ${currentBalance} ${tokenSymbol} available`}
                            />
                        ) : null}

                        {/* Step Indicator */}
                        {isProcessing && (
                            <div className="frost-card p-6">
                                <p className="mono-kicker text-emerald-green mb-6">
                                    [ TRANSACTION PROGRESS ]
                                </p>
                                <div className="step-indicator">
                                    <div className={`step ${currentStep === "prove" ? "active" : currentStep === "withdraw" ? "completed" : ""}`}>
                                        <div className="step-circle">1</div>
                                        <span className="text-sm">Generate Proof</span>
                                    </div>
                                    <div className="step-connector" />
                                    <div className={`step ${currentStep === "withdraw" ? "active" : ""}`}>
                                        <div className="step-circle">2</div>
                                        <span className="text-sm">Withdraw</span>
                                    </div>
                                </div>

                                {currentStep === "prove" && (
                                    <div className="mt-6">
                                        <LoadingSpinner
                                            message="Generating zero-knowledge proof..."
                                            progress="This may take 10-30 seconds"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <aside className="frost-card p-6 h-max">
                        <p className="mono-kicker text-coral-red mb-4">
                            [ INTENT SUMMARY ]
                        </p>

                        <div className="space-y-3">
                            <SummaryRow
                                label="Action"
                                value="Create Withdraw Intent"
                            />
                            <SummaryRow
                                label="Amount"
                                value={amount || "0.00"}
                            />
                            <SummaryRow
                                label="To Address"
                                value={withdrawAddress ? `${withdrawAddress.slice(0, 6)}...${withdrawAddress.slice(-4)}` : "Not set"}
                            />
                            <SummaryRow
                                label="Batch System"
                                value="50 intents per batch"
                            />
                            <SummaryRow
                                label="Status"
                                value="Balance will lock"
                                muted
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleWithdraw}
                            disabled={
                                isProcessing ||
                                !amount ||
                                parseFloat(amount) <= 0 ||
                                !isRegistered ||
                                (decryptedBalance ? parseUnits(amount || "0", Number(decimals || 18)) > decryptedBalance : false)
                            }
                            className="btn-success w-full mt-6"
                        >
                            {isProcessing ? "Processing..." : "Make Withdraw Intent"}
                        </button>

                        {/* Timeline */}
                        <div className="frost-card p-6 mt-6">
                            <p className="mono-kicker text-coral-red mb-3">
                                [ INTENT TIMELINE ]
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-coral-red">→</span>
                                    <span className="font-medium text-gray-900">Create intent</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-coral-red">→</span>
                                    <span className="font-semibold text-yellow-800">Balance locked</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-coral-red">→</span>
                                    <span className="font-medium text-gray-900">Batch collection</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-coral-red">→</span>
                                    <span className="font-medium text-gray-900">Community approval</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-emerald-600">✓</span>
                                    <span className="font-medium text-emerald-700">Execution complete</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </NewLayout>
    );
}

function SummaryRow({
    label,
    value,
    muted = false,
}: {
    label: string;
    value: string;
    muted?: boolean;
}) {
    return (
        <div className="flex items-center justify-between rounded-[8px] border border-black/10 bg-white/80 px-3 py-2">
            <span className="text-xs text-gray-600">{label}</span>
            <span className={muted ? "text-xs text-gray-600" : "text-sm font-semibold text-black"}>
                {value}
            </span>
        </div>
    );
}
