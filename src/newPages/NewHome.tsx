import {
    type CompatiblePublicClient,
    type CompatibleWalletClient,
    useEERC,
} from "@avalabs/eerc-sdk";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { motion } from "framer-motion";
import { NewLayout } from "../newComponents";
import { CIRCUIT_CONFIG, CONTRACTS, URLS } from "../config/contracts";
import "../newStyles.css";

interface NewHomeProps {
    onNavigate: (page: string) => void;
    mode?: "standalone" | "converter";
}

export function NewHome({ onNavigate, mode = "standalone" }: NewHomeProps) {
    const { isConnected } = useAccount();
    const publicClient = usePublicClient({ chainId: avalancheFuji.id });
    const { data: walletClient } = useWalletClient();

    // Only initialize useEERC if wallet is connected
    const { isRegistered } = useEERC(
        publicClient as CompatiblePublicClient,
        walletClient as CompatibleWalletClient,
        mode === "converter"
            ? CONTRACTS.EERC_CONVERTER
            : CONTRACTS.EERC_STANDALONE,
        URLS,
        CIRCUIT_CONFIG
    );

    // Smart navigation: Check registration status and navigate accordingly
    const handleGetStarted = () => {
        if (!isConnected) {
            // If not connected, go to registration page where they'll be prompted to connect
            onNavigate("registration");
            return;
        }

        if (isRegistered) {
            // Already registered, go straight to dashboard
            onNavigate("dashboard");
        } else {
            // Not registered, go to registration flow
            onNavigate("registration");
        }
    };

    // Auto-redirect registered users who click "Launch App"
    const handleLaunchApp = () => {
        onNavigate("dashboard");
    };

    const features = [
        {
            tag: "Privacy",
            title: "Fully Encrypted Transactions",
            description:
                "All your balances and transactions are encrypted using zero-knowledge proofs. Only you can decrypt and view your private balance.",
            accent: "green" as const,
        },
        {
            tag: "Security",
            title: "Baby JubJub Elliptic Curves",
            description:
                "Built on battle-tested cryptographic primitives. Your keys are generated locally and never leave your device.",
            accent: "orange" as const,
        },
        {
            tag: "Anonymous",
            title: "Private Transfers",
            description:
                "Send tokens to anyone without revealing amounts to the public. Only sender and recipient can see transaction details.",
            accent: "yellow" as const,
        },
    ];

    return (
        <NewLayout onNavigate={onNavigate} currentPage="home">
            <div className="space-y-16">
                {/* Hero Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative text-center py-12"
                >
                    {/* Subtle red gradient tint */}
                    <div className="absolute inset-0 bg-gradient-to-b from-coral-red/[0.03] via-transparent to-transparent -mx-8 -my-4 pointer-events-none" />
                    
                    {/* Radial glow behind heading */}
                    <div
                        className="pointer-events-none absolute left-1/2 top-8 h-[300px] w-[300px] -translate-x-1/2 rounded-full md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,107,107,0.15) 0%, rgba(255,107,107,0) 70%)",
                        }}
                        aria-hidden="true"
                    />
                    
                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-6xl md:text-8xl font-bold leading-[1.02] mb-6"
                            style={{
                                letterSpacing: "-0.02em",
                                color: "#FF6B6B",
                                fontFamily:
                                    "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                            }}
                        >
                            The Privacy Wallet
                            <br />
                            For Your Crypto
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8 space-y-2 text-[14px] font-semibold uppercase tracking-[0.08em] text-coral-red"
                            style={{
                                fontFamily:
                                    "JetBrains Mono, Monaco, 'Courier New', monospace",
                            }}
                        >
                            <p>PRIVACY FIRST TRADING</p>
                            <p>100% ANONYMOUS</p>
                            <p>ZERO-KNOWLEDGE PROOFS</p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <button
                                type="button"
                                onClick={handleLaunchApp}
                                className="btn-primary text-base px-8 py-4"
                            >
                                Launch App →
                            </button>
                            <button
                                type="button"
                                onClick={handleGetStarted}
                                className="btn-secondary text-base px-8 py-4"
                            >
                                {isConnected && isRegistered ? "Go to Dashboard" : "Get Started"}
                            </button>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Features Grid */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </motion.section>

                {/* Learning Tools */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative"
                >
                    {/* Subtle red tint background */}
                    <div className="absolute inset-0 bg-coral-red/[0.02] rounded-lg -mx-4 -my-8 pointer-events-none" />
                    
                    {/* Radial glow behind heading */}
                    <div
                        className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[200px] -translate-x-1/2 rounded-full md:h-[280px] md:w-[280px]"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,107,107,0.12) 0%, rgba(255,107,107,0) 70%)",
                        }}
                        aria-hidden="true"
                    />
                    
                    <div className="relative py-8">
                        <h2 
                            className="text-4xl md:text-5xl font-bold text-coral-red mb-4 text-center"
                            style={{
                                fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Learn the Technology
                        </h2>
                        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                            Explore the cryptographic primitives that power encrypted transactions
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button
                            type="button"
                            onClick={() => onNavigate("ecc")}
                            className="frost-card p-8 text-left hover:border-coral-red/40 transition-all group"
                        >
                            <div className="mono-kicker text-coral-red mb-3">
                                [ CRYPTOGRAPHY ]
                            </div>
                            <h3 
                                className="text-2xl font-bold text-black mb-3 group-hover:text-coral-red transition-colors"
                                style={{
                                    fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Elliptic Curves
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Explore Baby JubJub elliptic curve operations, point arithmetic, and ElGamal encryption
                            </p>
                            <span className="text-coral-red font-mono text-sm">
                                Explore ECC →
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onNavigate("hashes")}
                            className="frost-card p-8 text-left hover:border-coral-red/40 transition-all group"
                        >
                            <div className="mono-kicker text-coral-red mb-3">
                                [ ZK-FRIENDLY ]
                            </div>
                            <h3 
                                className="text-2xl font-bold text-black mb-3 group-hover:text-coral-red transition-colors"
                                style={{
                                    fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Hash Functions
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try Poseidon and MiMC hash functions optimized for zero-knowledge proofs
                            </p>
                            <span className="text-coral-red font-mono text-sm">
                                Try Hashes →
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onNavigate("poseidon")}
                            className="frost-card p-8 text-left hover:border-coral-red/40 transition-all group"
                        >
                            <div className="mono-kicker text-coral-red mb-3">
                                [ ENCRYPTION ]
                            </div>
                            <h3 
                                className="text-2xl font-bold text-black mb-3 group-hover:text-coral-red transition-colors"
                                style={{
                                    fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Poseidon Cipher
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Learn how Poseidon encryption works for privacy-preserving applications
                            </p>
                            <span className="text-coral-red font-mono text-sm">
                                Learn Encryption →
                            </span>
                        </button>
                    </div>
                </motion.section>

                {/* How it Works */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="frost-card p-8 md:p-12"
                >
                    <h2 
                        className="text-4xl md:text-5xl font-bold text-coral-red mb-8"
                        style={{
                            fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StepCard
                            number="01"
                            title="Register"
                            description="Generate your encryption keys and register your public key on-chain"
                        />
                        <StepCard
                            number="02"
                            title="Deposit"
                            description="Convert public tokens to encrypted tokens that only you can see"
                        />
                        <StepCard
                            number="03"
                            title="Transfer"
                            description="Send encrypted tokens privately to any registered address"
                        />
                        <StepCard
                            number="04"
                            title="Withdraw"
                            description="Convert your encrypted tokens back to public tokens anytime"
                        />
                    </div>
                </motion.section>
            </div>
        </NewLayout>
    );
}

interface FeatureCardProps {
    tag: string;
    title: string;
    description: string;
    accent: "green" | "orange" | "yellow";
    index: number;
}

function FeatureCard({ tag, title, description, accent, index }: FeatureCardProps) {
    const accentColors = {
        green: "#00A667",
        orange: "#FF6B6B",
        yellow: "#C4A600",
    };

    const color = accentColors[accent];

    return (
        <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="frost-card p-6 md:p-7 lg:p-8 interactive-card"
        >
            <div className="mb-4 md:mb-5 flex items-center justify-between">
                <span
                    className="mono-kicker"
                    style={{ color }}
                >
                    [ {tag} ]
                </span>

                <span
                    className="corner-badge"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2 2h6v6" stroke="white" strokeWidth="1" />
                        <path d="M8 2L2 8" stroke="white" strokeWidth="1" />
                    </svg>
                </span>
            </div>

            <h3 className="text-[22px] leading-[1.15] md:text-[24px] lg:text-[26px] font-semibold text-balance"
                style={{
                    fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: "-0.01em",
                }}
            >
                {title}
            </h3>

            <p className="mt-3 text-[12px] md:text-[13px] leading-[1.45] text-black max-w-[58ch]">
                {description}
            </p>
        </motion.article>
    );
}

interface StepCardProps {
    number: string;
    title: string;
    description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
    return (
        <div className="relative">
            <div
                className="text-6xl font-bold opacity-10 absolute -top-4 -left-2"
                style={{ color: "#FF6B6B" }}
            >
                {number}
            </div>
            <div className="relative">
                <h3 
                    className="text-xl font-semibold text-black mb-2"
                    style={{
                        fontFamily: "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {title}
                </h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}
