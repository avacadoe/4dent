import { useState } from "react";
import { Bounce, toast } from "react-toastify";

interface WithdrawIntentProps {
    handleSubmitWithdrawIntent: (
        amount: string,
        destination: string,
        nonce: string
    ) => Promise<void>;
    isDecryptionKeySet: boolean;
}

export function WithdrawIntent({
    handleSubmitWithdrawIntent,
    isDecryptionKeySet,
}: WithdrawIntentProps) {
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [nonce, setNonce] = useState<string>("1");
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
            <div className="flex-1">
                <h3 className="text-cyber-green font-bold mb-2">
                    Withdraw Intent
                </h3>
                <p className="text-sm text-cyber-gray font-mono leading-relaxed mb-4">
                    Submit a withdraw intent with hidden amount and destination.
                    The intent is submitted as a hash, preserving privacy until
                    execution. The intent can be executed by anyone after a
                    waiting period, enabling batching and better privacy through
                    anonymity sets.
                </p>
            </div>

            <div className="space-y-3">
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

                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.trim())}
                    placeholder={"Destination address (0x...)"}
                    className="flex-1 bg-cyber-dark text-cyber-gray px-4 py-0.5 rounded-lg border border-cyber-green/20 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green outline-none font-mono w-full"
                />

                <input
                    type="text"
                    value={nonce}
                    onChange={(e) => {
                        const value = e.target.value.trim();
                        if (/^\d+$/.test(value) || value === "") {
                            setNonce(value);
                        }
                    }}
                    placeholder={"Nonce (default: 1)"}
                    className="flex-1 bg-cyber-dark text-cyber-gray px-4 py-0.5 rounded-lg border border-cyber-green/20 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green outline-none font-mono w-full"
                />

                <button
                    type="button"
                    className="bg-cyber-dark w-full text-cyber-green px-2 py-1 rounded-md text-sm border border-cyber-green/60 disabled:opacity-50 disabled:cursor-not-allowed mb-2 hover:bg-cyber-green/60 transition-all duration-200 font-mono mt-2"
                    onClick={async () => {
                        setLoading(true);
                        handleSubmitWithdrawIntent(
                            withdrawAmount,
                            destination,
                            nonce
                        )
                            .then(() => {
                                setLoading(false);
                                setWithdrawAmount("");
                                setDestination("");
                                setNonce("1");
                            })
                            .catch((error) => {
                                const isUserRejected =
                                    error?.message.includes("User rejected");

                                toast.error(
                                    <div>
                                        <p>
                                            {isUserRejected
                                                ? "Transaction rejected"
                                                : "An error occurred while submitting withdraw intent. Please try again."}
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
                                    }
                                );

                                setLoading(false);
                            });
                    }}
                    disabled={
                        !withdrawAmount ||
                        !destination ||
                        !nonce ||
                        loading ||
                        !isDecryptionKeySet
                    }
                >
                    {loading ? "Submitting..." : "Submit Withdraw Intent"}
                </button>
            </div>
        </>
    );
}
