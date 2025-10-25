import { NewLayout } from "../newComponents";
import "../newStyles.css";

interface NewHomeProps {
    onNavigate: (page: string) => void;
}

export function NewHome({ onNavigate }: NewHomeProps) {

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
        <NewLayout>
            <div className="space-y-16">
                {/* Hero Section */}
                <section className="text-center py-12">
                    <h1
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
                    </h1>

                    <div
                        className="mt-8 space-y-2 text-[14px] font-semibold uppercase tracking-[0.08em] text-coral-red"
                        style={{
                            fontFamily:
                                "JetBrains Mono, Monaco, 'Courier New', monospace",
                        }}
                    >
                        <p>PRIVACY FIRST TRADING</p>
                        <p>100% ANONYMOUS</p>
                        <p>ZERO-KNOWLEDGE PROOFS</p>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            type="button"
                            onClick={() => onNavigate("dashboard")}
                            className="btn-primary text-base px-8 py-4"
                        >
                            Launch App →
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate("registration")}
                            className="btn-secondary text-base px-8 py-4"
                        >
                            Get Started
                        </button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </section>

                {/* How it Works */}
                <section className="frost-card p-8 md:p-12">
                    <h2 className="text-4xl font-bold text-coral-red mb-8">
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
                </section>
            </div>
        </NewLayout>
    );
}

interface FeatureCardProps {
    tag: string;
    title: string;
    description: string;
    accent: "green" | "orange" | "yellow";
}

function FeatureCard({ tag, title, description, accent }: FeatureCardProps) {
    const accentColors = {
        green: "#00A667",
        orange: "#FF6B6B",
        yellow: "#C4A600",
    };

    const color = accentColors[accent];

    return (
        <article className="frost-card p-6 md:p-7 lg:p-8 interactive-card">
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

            <h3 className="text-[22px] leading-[1.15] md:text-[24px] lg:text-[26px] font-semibold text-balance">
                {title}
            </h3>

            <p className="mt-3 text-[12px] md:text-[13px] leading-[1.45] text-muted-foreground max-w-[58ch]">
                {description}
            </p>
        </article>
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
                <h3 className="text-xl font-semibold text-black mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}
