"use client"

import { useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { AlertTriangle } from "lucide-react"

export default function DepositsPage() {
  const [token, setToken] = useState<"ETH" | "TEST">("ETH")
  const [amount, setAmount] = useState<string>("")

  const presetAmounts = token === "ETH" ? [0.1, 0.5, 1] : [10, 50, 100]
  const walletBalance = token === "ETH" ? 0.776 : 2500

  const handlePreset = (val: number) => setAmount(String(val))
  const handleMax = () => setAmount(String(walletBalance))

  const canConfirm = Number(amount) > 0

  return (
    <>
      <Navbar />
      <main
        className="relative min-h-[calc(100vh-68px)] lg:min-h-[calc(100vh-88px)] overflow-x-hidden lg:overflow-y-hidden dotted-bg"
      >
        {/* Page background decorative images (fixed to viewport for stability) */}
        <div className="pointer-events-none fixed left-[-170px] bottom-[-30px] z-0 hidden lg:block">
          <div className="relative h-[clamp(600px,90vh,1300px)] w-[clamp(420px,46vw,900px)] opacity-80">
            <Image src="/sam1.png" alt="Decorative device" fill className="object-contain object-left-bottom" sizes="(min-width: 1024px) 42vw, 0px" />
          </div>
        </div>
        {/* Mirrored image on the right */}
        <div className="pointer-events-none fixed right-[-415px] bottom-[-30px] z-0 hidden lg:block">
          <div className="relative h-[clamp(600px,90vh,1300px)] w-[clamp(420px,46vw,900px)] opacity-80">
            <Image src="/sam1.png" alt="Decorative device mirrored" fill className="object-contain object-right-bottom -scale-x-100" sizes="(min-width: 1024px) 42vw, 0px" />
          </div>
        </div>
        <section className="relative mx-auto w-full max-w-[1200px] px-6 py-10 lg:py-14">
          {/* Top breadcrumb/title */}
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em]" style={{ color: "#7A7A7A", fontFamily: "JetBrains Mono, Monaco, 'Courier New', monospace" }}>
            <span>Deposit</span>
            <span aria-hidden>•</span>
            <span className="rounded-[2px] border border-black/10 bg-white/70 px-1.5 py-0.5">public → private</span>
          </div>

          {/* Registration banner */}
          <div
            className="mb-6 flex items-start justify-between gap-4 rounded-[2px] frost-card p-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-[2px] bg-[#FF6B6B] text-white"><AlertTriangle className="h-3.5 w-3.5" /></span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1F1F1F" }}>Registration Required</p>
                <p className="text-xs text-muted-foreground">You need to register with the ERC system before making deposits.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-[2px] border border-black/10 bg-white/70 px-3 py-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[#3F3F3F] hover:text-[#FF6B6B]">Refresh</button>
              <button className="rounded-[2px] border border-[#FF6B6B] bg-[#FF6B6B] px-3 py-2 text-[12px] font-mono uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(255,107,107,0.35)] hover:bg-transparent hover:text-[#FF6B6B]">Register Now</button>
            </div>
          </div>

          <div className="relative z-[1] grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Token & Amount */}
              <div className="rounded-[2px] frost-card p-4">
                <p className="mb-3 mono-kicker" style={{ color: "var(--color-chart-5, #FF6B6B)" }}>Token & Amount</p>

                {/* token tabs */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {(["ETH", "TEST"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setToken(t)}
                      className={`rounded-[8px] border px-4 py-2 text-left ${
                        token === t
                          ? "border-[#FF6B6B] bg-white shadow-[0_8px_24px_rgba(255,107,107,0.18)]"
                          : "border-black/10 bg-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: t === "ETH" ? "var(--color-chart-4,#C4A600)" : "var(--color-chart-5,#FF6B6B)" }} />
                          <span className="text-sm font-semibold">{t}</span>
                        </div>
                        <span className="text-[11px] text-[#7A7A7A]">Balance: {walletBalance} {t}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* amount input row */}
                <div className="rounded-[8px] border border-black/10 bg-white/80 p-4">
                  <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#313131]">Amount</label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-[8px] border border-[#E2DDDA] bg-[#FEFBFA] px-3 py-2 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/30"
                        />
                        <span className="text-sm text-[#7A7A7A]">{token}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleMax} className="rounded-[6px] border border-black/10 bg-white/70 px-3 py-2 text-xs font-mono uppercase tracking-[0.16em] text-[#3F3F3F] hover:text-[#FF6B6B]">
                        Max
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#7A7A7A]">Wallet balance: {walletBalance} {token}</p>
                </div>
              </div>

              {/* Quick amounts */}
              <div className="rounded-[2px] frost-card p-4">
                <p className="mb-3 mono-kicker">Quick Amounts</p>
                <div className="flex flex-wrap gap-3">
                  {presetAmounts.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePreset(p)}
                      className="rounded-[8px] border border-black/10 bg-white/80 px-4 py-2 text-sm hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                    >
                      {p} {token}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Balance */}
              <div className="rounded-[2px] frost-card p-4">
                <p className="mb-3 mono-kicker">Current Balance</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-[8px] border border-black/10 bg-white/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A7A7A]">Public {token}</span>
                      <span className="font-semibold">{walletBalance} {token}</span>
                    </div>
                  </div>
                  <div className="rounded-[8px] border border-black/10 bg-white/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A7A7A]">Private e{token}</span>
                      <span className="font-semibold">0.00 e{token}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Transaction summary */}
            <aside className="h-max rounded-[2px] frost-card p-4">
              <p className="mb-3 mono-kicker">Transaction Summary</p>

              <div className="space-y-2 text-sm">
                <SummaryRow label="Action" value={`Deposit ${token} → Receive e${token}`} />
                <SummaryRow label="Shielded/Vault" value="0xAbAf...0cc4" muted />
                <SummaryRow label="Network fees" value="$0.50" />
                <div className="rounded-[8px] border border-black/10 bg-white/70 p-3 text-xs text-[#7A7A7A]">
                  Step 1: Send {token} • Step 2: Lock in Shielded vault • Step 3: Mint e{token}
                </div>
              </div>

              <button
                disabled={!canConfirm}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-[#00A667] bg-[#00A667] px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_36px_rgba(0,166,103,0.35)] transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:bg-transparent hover:text-[#00A667]"
              >
                Confirm Deposit
              </button>

            </aside>
          </div>
        </section>
      </main>
    </>
  )
}

function SummaryRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-black/10 bg-white/80 px-3 py-2">
      <span className="text-[#7A7A7A] text-xs">{label}</span>
      <span className={muted ? "text-[#7A7A7A]" : "font-semibold"}>{value}</span>
    </div>
  )
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] px-3 py-2 text-xs text-white" style={{ backgroundColor: color }}>
      <span>{label}</span>
      <span className="inline-flex h-3 w-3 items-center justify-center rounded-[2px] bg-white/20">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2h6v6" stroke="white" strokeWidth="1" />
          <path d="M8 2L2 8" stroke="white" strokeWidth="1" />
        </svg>
      </span>
    </div>
  )
}

