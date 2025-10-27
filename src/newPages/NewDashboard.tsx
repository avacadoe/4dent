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
} from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { formatUnits } from "viem";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSwap } from "react-icons/ai";
import { NewLayout } from "../newComponents";
import { CIRCUIT_CONFIG, CONTRACTS, URLS } from "../config/contracts";
import "../newStyles.css";

interface NewDashboardProps {
    onNavigate: (page: string) => void;
    mode: "standalone" | "converter";
}

export function NewDashboard({ onNavigate, mode }: NewDashboardProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const hasRedirectedRef = useRef(false);

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient({ chainId: avalancheFuji.id });
    const { data: walletClient } = useWalletClient();

    const {
        isRegistered,
        symbol,
        publicKey,
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
        encryptedBalance,
        decryptedBalance,
        decimals,
        refetchBalance,
    } = useEncryptedBalance(mode === "converter" ? CONTRACTS.ERC20 : undefined);

    // Redirect to registration if not registered (only once)
    useEffect(() => {
        if (!isRegistered && isConnected && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            const timer = setTimeout(() => {
                toast.info("Please complete registration first", {
                    autoClose: 2000,
                    toastId: "not-registered"
                });
                onNavigate("registration");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isRegistered, isConnected, onNavigate]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetchBalance();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const formattedBalance = decryptedBalance
        ? formatUnits(decryptedBalance, Number(decimals || 18))
        : "0.00";

    if (!isConnected) {
        return (
            <NewLayout onNavigate={onNavigate} currentPage="dashboard">
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-5xl font-bold text-coral-red mb-6">
                        Connect Your Wallet
                    </h1>
                    <p className="text-lg text-gray-600">
                        Please connect your wallet to view your dashboard
                    </p>
                </div>
            </NewLayout>
        );
    }

    if (!isRegistered) {
        return (
            <NewLayout onNavigate={onNavigate} currentPage="dashboard">
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-5xl font-bold text-coral-red mb-6">
                        Registration Required
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        You need to register before using encrypted transactions
                    </p>
                    <button
                        type="button"
                        onClick={() => onNavigate("registration")}
                        className="btn-primary text-base px-8 py-4"
                    >
                        Register Now
                    </button>
                </div>
            </NewLayout>
        );
    }

    return (
        <NewLayout onNavigate={onNavigate} currentPage="dashboard">
            <div className="space-y-8">
                {/* Header */}
                <div className="relative">
                    {/* Radial glow behind heading */}
                    <div
                        className="pointer-events-none absolute left-0 top-0 h-[180px] w-[180px] -translate-y-8 rounded-full md:h-[220px] md:w-[220px]"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,107,107,0.14) 0%, rgba(255,107,107,0) 70%)",
                        }}
                        aria-hidden="true"
                    />
                    
                    <h1 
                        className="relative text-5xl font-bold text-coral-red mb-2"
                        style={{
                            fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your encrypted balance and recent activity
                    </p>
                </div>

                {/* Balance Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="frost-card p-6">
                        <span className="mono-kicker text-coral-red mb-4 block">
                            [ ENCRYPTED BALANCE ]
                        </span>
                        
                        {!showBalance && !isDecrypting ? (
                            <div className="text-center py-12">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDecrypting(true);
                                        setTimeout(() => {
                                            setIsDecrypting(false);
                                            setShowBalance(true);
                                        }, 1500);
                                    }}
                                    className="btn-primary"
                                >
                                    Decrypt Balance
                                </button>
                            </div>
                        ) : isDecrypting ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red mb-3"></div>
                                <p className="text-sm text-gray-600">
                                    Decrypting balance...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <p className="text-4xl font-bold text-black mb-2">
                                        {formattedBalance}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {symbol || "eERC"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="btn-secondary text-sm w-full"
                                >
                                    {isRefreshing ? "Refreshing..." : "Refresh Balance"}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="frost-card p-6">
                        <span className="mono-kicker text-coral-red mb-4 block">
                            [ ACCOUNT INFO ]
                        </span>
                        <div className="space-y-3">
                            <div className="rounded-[8px] border border-black/10 bg-white/80 p-3">
                                <p className="text-xs text-gray-600 mb-1">
                                    Wallet Address
                                </p>
                                <p className="text-sm font-mono font-semibold break-all">
                                    {address}
                                </p>
                            </div>
                            {publicKey && (
                                <div className="rounded-[8px] border border-black/10 bg-white/80 p-3">
                                    <p className="text-xs text-gray-600 mb-1">
                                        Public Key
                                    </p>
                                    <p
                                        className="text-xs font-mono break-all text-gray-700"
                                        style={{
                                            fontFamily:
                                                "JetBrains Mono, Monaco, monospace",
                                        }}
                                    >
                                        {JSON.stringify(publicKey).slice(0, 40)}...
                                    </p>
                                </div>
                            )}
                            <div className="rounded-[8px] border border-black/10 bg-white/80 p-3">
                                <p className="text-xs text-gray-600 mb-1">
                                    Auditor Address
                                </p>
                                <p className="text-sm font-mono font-semibold break-all">
                                    0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="frost-card p-8"
                >
                    <span className="mono-kicker text-coral-red mb-6 block">
                        [ QUICK ACTIONS ]
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ActionCard
                            icon={<AiOutlineArrowDown className="h-8 w-8" />}
                            title="Deposit"
                            description="Convert public tokens to encrypted"
                            onClick={() => onNavigate("deposit")}
                            color="#00A667"
                        />
                        <ActionCard
                            icon={<AiOutlineSwap className="h-8 w-8" />}
                            title="Transfer"
                            description="Send encrypted tokens privately"
                            onClick={() => onNavigate("transfer")}
                            color="#FF6B6B"
                        />
                        <ActionCard
                            icon={<AiOutlineArrowUp className="h-8 w-8" />}
                            title="Withdraw"
                            description="Convert encrypted back to public"
                            onClick={() => onNavigate("withdraw")}
                            color="#C4A600"
                        />
                    </div>
                </motion.div>
            </div>
        </NewLayout>
    );
}

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    color: string;
}

function ActionCard({ icon, title, description, onClick, color }: ActionCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="frost-card p-6 interactive-card text-left hover:shadow-lg transition-all"
            style={{
                borderColor: `${color}20`,
            }}
        >
            <div
                className="mb-4 inline-flex items-center justify-center rounded-[2px] p-3"
                style={{ backgroundColor: `${color}15`, color }}
            >
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </motion.button>
    );
}
