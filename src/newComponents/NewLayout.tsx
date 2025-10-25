import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

interface NewLayoutProps {
    children: ReactNode;
}

export function NewLayout({ children }: NewLayoutProps) {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();

    return (
        <div className="min-h-screen dotted-bg">
            {/* Header/Navbar */}
            <header
                className="sticky top-0 z-50 border-b border-black/10 bg-[#ECECEC]/90 backdrop-blur transition-colors"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                }}
            >
                <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center justify-between px-6 lg:h-[88px] lg:px-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <span
                            className="text-[24px] font-semibold tracking-[-0.04em] text-coral-red"
                            style={{
                                fontFamily:
                                    "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                            }}
                        >
                            avacado
                        </span>
                        <span className="text-[12px] font-mono text-gray-500">
                            / 4dent
                        </span>
                    </div>

                    {/* Right side - Connect wallet */}
                    <div className="flex items-center gap-4">
                        {isConnected && address ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block">
                                    <p className="mono-kicker text-gray-500">
                                        Connected
                                    </p>
                                    <p className="text-sm font-medium text-black">
                                        {address.slice(0, 6)}...
                                        {address.slice(-4)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="btn-secondary"
                                >
                                    Wallet
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="btn-primary"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:px-16 lg:py-14">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-black/10 py-8">
                <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
                    <p
                        className="text-center text-xs text-gray-500"
                        style={{
                            fontFamily:
                                "JetBrains Mono, Monaco, 'Courier New', monospace",
                        }}
                    >
                        © {new Date().getFullYear()} 4dent • Privacy-First
                        Encrypted Transactions
                    </p>
                </div>
            </footer>
        </div>
    );
}
