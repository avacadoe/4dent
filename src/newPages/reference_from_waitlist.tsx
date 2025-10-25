"use client";

import { useState } from "react";
import Image from "next/image";
import { FeatureCard } from "@/components/feature-card";
import { Navbar } from "@/components/navbar";
import { SectionHeader } from "@/components/section-header";
import { WaitlistForm } from "@/components/waitlist-form";
import "./pixel-section.css";
import "./animated-lines-enhanced.css";

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen"
        style={{
          backgroundColor: "#ECECEC",
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      >
        {/* Background dotted surface removed from global scope */}
        {/* Hero */}
        <section
          className="relative min-h-[75vh] overflow-hidden"
          style={{
            // subtle dotted background
            backgroundColor: "#ECECEC",
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          {/* Horizontal Lines */}
          <div className="animated-horizontal-line line-top absolute inset-x-0 top-16 z-[2] w-full lg:top-24" />
          <div className="animated-horizontal-line line-bottom absolute inset-x-0 bottom-16 z-[2] w-full lg:bottom-24" />

          {/* Vertical Lines */}
          <div className="absolute inset-x-0 top-17 bottom-17 z-0 mx-auto max-w-[1200px] lg:top-24 lg:bottom-24">
            <div className="absolute left-6 top-0 h-full w-[1px] bg-black/20 lg:left-16" />
            <div className="absolute right-6 top-0 h-full w-[1px] bg-black/20 lg:right-16" />
          </div>

          {/* Content */}
          <div className="relative z-[1] mx-auto flex h-full w-full max-w-[1200px] px-6 py-16 lg:px-16 lg:py-24">
            <div className="grid h-full w-full min-h-[70vh] gap-8 md:grid-cols-2">
              {/* Left */}
              <div className="relative top-6 flex flex-col justify-between px-2 pt-4 lg:top-10 lg:px-4">
                <div>
                  <h1
                    className="text-balance font-bold leading-[1.02] text-[48px] sm:text-[64px] lg:text-[96px]"
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

                  {/* Feature bullets */}
                  <div
                    className="mt-8 space-y-2 text-[14px] font-semibold uppercase tracking-[0.08em]"
                    style={{
                      color: "#FF6B6B",
                      fontFamily:
                        "JetBrains Mono, Monaco, 'Courier New', monospace",
                    }}
                  >
                    <p>PRIVACY FIRST TRADING</p>
                    <p>100% ANONYMOUS</p>
                    <p>COMPLIANCE FRIENDLY</p>
                  </div>

                  {/* CTA */}
                  <div>
                    <a
                      href="#waitlist"
                      className="inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-semibold transition-colors"
                      style={{
                        backgroundColor: "#FF6B6B",
                        borderColor: "#FF6B6B",
                        color: "#FFFFFF",
                        transform: "translateY(22px)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.backgroundColor = "transparent";
                        el.style.color = "#FF6B6B";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.backgroundColor = "#FF6B6B";
                        el.style.color = "#FFFFFF";
                      }}
                    >
                      Join Waitlist →
                    </a>
                  </div>
                </div>
              </div>

              {/* Right image */}
              <div className="relative flex min-h-[70vh] items-center justify-center">
                <div className="relative h-full w-full">
                  <Image
                    src="/avocado.png"
                    alt="Large grayscale avocado illustration on the right"
                    width={1200}
                    height={1200}
                    priority
                    className="h-[70vh] w-full object-contain"
                    style={{
                      // approximate halftone look with grayscale + contrast and a touch of desaturation
                      filter: "sharpness(1.15) contrast(1.15) saturate(0.75)",
                      transform: "translateY(24px)", // push it large like the screenshot and nudge further downward
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom banner */}
          <div
            className="absolute left-0 right-0 z-[1] border-t border-black/10 py-4"
            style={{
              bottom: "-70px",
              backgroundColor: "#ECECEC",
              backgroundImage:
                "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          >
            {/* <div className="mx-auto max-w-[1200px] px-6">
              <p
                className="text-center"
                style={{
                  fontFamily: "JetBrains Mono, Monaco, Courier New, monospace",
                  color: "#333333",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                
                <span style={{ color: "#00A667" }}>EXCLUSIVELY LAUNCHING ON </span>
              </p>
              <div className="mb-4 flex justify-center">
                <Image
                  src="/avax.png"
                  alt="Avalanche logo"
                  width={140}
                  height={140}
                  style={{
                    filter: "grayscale(1) brightness(1.1)",
                    opacity: 0.6,
                  }}
                />
              </div>
            </div> */}
            <div className="h-px w-full bg-black/10" />
            <div className="mx-auto max-w-[1200px] px-6 pt-4">
              <div className="flex items-center justify-center gap-12">
                <span
                  className="font-semibold"
                  style={{
                    color: "#AAAAAA",
                    fontSize: "20px",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  base
                </span>
                <span
                  className="font-normal"
                  style={{
                    color: "#AAAAAA",
                    fontSize: "20px",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  avalanche
                </span>
                <span
                  className="font-bold"
                  style={{
                    color: "#AAAAAA",
                    fontSize: "20px",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  eth
                </span>
                <span
                  className="font-semibold"
                  style={{
                    color: "#AAAAAA",
                    fontSize: "20px",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  1inch
                </span>
                <span
                  className="font-medium"
                  style={{
                    color: "#AAAAAA",
                    fontSize: "20px",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                ></span>
              </div>
            </div>
          </div>
        </section>

        {/* Mid-page intro text (between Hero and Privacy Meets Compliance) */}
        <section
          className="relative overflow-hidden mx-auto mt-8 max-w-full px-6"
          aria-labelledby="mid-intro-text"
        >
          {/* Scoped dotted surface background */}
          <div className="relative z-[1] flex mt-[40px] mb-[40px] items-center justify-center">
            <div className="w-full text-center">
              <p
                id="mid-intro-text"
                className="mx-auto max-w-[920px] text-[15px] md:text-[17px] lg:text-[22px] leading-relaxed"
                style={{
                  color: "#3A3A3A",
                  fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Avacado provides cryptographic transaction unlinking, enabling
                institutions to transact with complete confidentiality while
                maintaining regulatory transparency. Our selective disclosure
                protocol ensures financial privacy through advanced encryption,
                revealing transaction details only to authorized compliance
                frameworks when required.
              </p>
            </div>
          </div>
        </section>

        {/* Feature section */}
        <section
          className="section-paper section-frame mx-auto mt-28 max-w-[860px] md:max-w-[980px] lg:max-w-[1080px] px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12 relative"
          aria-labelledby="greptile-section-title"
          style={{
            backgroundColor: "#ECECEC",
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          {/* Overlay toggle for pixel matching */}
          {/* <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowOverlay((v) => !v)}
              className="rounded-[2px] border border-[color:var(--color-border)] bg-card px-2.5 py-1.5 text-[11px] font-mono tracking-wide text-foreground"
              aria-pressed={showOverlay}
            >
              {showOverlay ? "Hide" : "Show"} overlay
            </button>
            <span className="sr-only">
              Toggles an overlay of the provided screenshot for alignment.
            </span>
          </div> */}

          <SectionHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            <FeatureCard
              accent="green"
              tag="Compliance, redefined."
              title="Privacy, Reinvented"
              description="Verify identity once, share zero data — thanks to zero-knowledge proofs."
            />
            <FeatureCard
              accent="orange"
              tag="Complete privacy for digital assets."
              title="Encrypted Token Transactions"
              description="Send tokens privately using cutting-edge encrypted ERC20 standards."
            />
            <FeatureCard
              accent="yellow"
              tag="Transparency without data exposure."
              title="Auditor-Ready Privacy Layer"
              description="Stay compliant while keeping transaction details completely hidden."
            />
            <FeatureCard
              accent="orange"
              tag="One protocol,to rule them all"
              title="Interoperability by Design"
              description="Convert every ERC20 token to its private counterpart and back, seamlessly."
            />
          </div>

          {showOverlay && <div className="ref-overlay" aria-hidden="true" />}
        </section>

        {/* Powered by section */}
        <section
          className="mx-auto mt-20 max-w-[1080px] px-4 md:px-6 lg:px-8"
          aria-labelledby="powered-by-title"
        >
          <div className="flex items-center justify-center">
            <span
              id="powered-by-title"
              className="text-xs font-semibold uppercase"
              style={{
                fontFamily: "JetBrains Mono, Monaco, 'Courier New', monospace",
                letterSpacing: "0.4em",
                color: "#FF8A8A",
              }}
            >
              BUILT ON
            </span>
          </div>
          <div className="relative mt-8">
            <div className="grid grid-cols-1 overflow-hidden rounded-[4px] border border-black/15 bg-[#F5F5F5]">
              <div className="flex h-24 items-center justify-center border-r border-black/15 bg-[#F0F0F0] md:h-36">
                <Image
                  src="/avax.png"
                  alt="Avalanche logo"
                  width={160}
                  height={80}
                  className="h-8 w-auto object-contain md:h-10"
                  style={{
                    filter: "grayscale(1) brightness(1.1)",
                    opacity: 0.75,
                  }}
                />
              </div>
              {/*
              <div className="flex h-24 items-center justify-center border-r border-black/15 bg-[#F0F0F0] md:h-36">
                <Image
                  src="/1inch.png"
                  alt="1inch logo"
                  width={160}
                  height={80}
                  className="h-10 w-auto object-contain md:h-12"
                  style={{
                    filter: "grayscale(1) brightness(1.1)",
                    opacity: 0.75,
                  }}
                />
              </div>
              */}
              {/*
              <div className="flex h-24 items-center justify-center bg-[#F0F0F0] md:h-36">
                <Image
                  src="/self.png"
                  alt="Self logo"
                  width={160}
                  height={80}
                  className="h-10 w-auto object-contain md:h-12"
                  style={{
                    filter: "grayscale(1) brightness(1.1)",
                    opacity: 0.75,
                  }}
                />
              </div>
              */}
            </div>
          </div>
        </section>

        <section
          id="waitlist"
          className="mt-24 px-6 pb-24 md:px-10"
          aria-labelledby="waitlist-title"
        >
          <div className="mx-auto flex w-full max-w-[980px] flex-col items-center gap-10 md:flex-row md:items-center md:justify-center">
            <div className="w-full md:w-1/2">
              <div className="h-full rounded-[12px] border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="mb-6 text-left">
                  <h2
                    id="waitlist-title"
                    className="text-[28px] font-semibold tracking-tight text-[#1F1F1F]"
                    style={{
                      fontFamily:
                        "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Secure your spot for Avacado
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We'll reach out once the privacy wallet is ready.
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </div>
            <div className="flex w-full justify-center md:w-1/2">
              <Image
                src="/wait.png"
                alt="Illustration of a person waiting to join the Avacado waitlist"
                width={420}
                height={420}
                className="h-auto w-full max-w-[360px] origin-center scale-115 object-contain opacity-95 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-300 md:max-w-[420px] md:scale-160"
                priority
              />
            </div>
          </div>
        </section>

        <footer
          className="relative mt-32 overflow-hidden border-t border-black/10"
          aria-labelledby="footer-title"
          style={{
            backgroundColor: "#ECECEC",
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div
              className="absolute left-1/2 top-12 h-[260px] w-[260px] -translate-x-1/2 rounded-full md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,107,0.18) 0%, rgba(255,107,107,0) 65%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-black/10" />
          </div>

          <div className="relative z-[1] mx-auto max-w-[1200px] px-6 py-12 md:py-16 lg:px-16 lg:py-24">
            <div className="grid gap-10 md:gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <div>
                <p
                  className="mb-6 text-[10px] uppercase md:text-xs"
                  style={{
                    color: "#FF6B6B",
                    fontFamily:
                      "JetBrains Mono, Monaco, 'Courier New', monospace",
                    letterSpacing: "0.4em",
                  }}
                >
                  Privacy-first wallet
                </p>
                <h2
                  id="footer-title"
                  style={{
                    fontFamily:
                      "'Scto Grotesk A', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "clamp(64px, 18vw, 200px)",
                    fontWeight: 700,
                    lineHeight: 0.88,
                    letterSpacing: "-0.08em",
                    textTransform: "uppercase",
                    color: "#FF6B6B",
                    textShadow: "0 24px 60px rgba(255, 107, 107, 0.35)",
                  }}
                >
                  Avacado
                </h2>
                <p
                  className="mt-6 max-w-[560px] text-xs leading-relaxed md:text-sm"
                  style={{
                    color: "#555555",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  Built for teams that expect complete privacy, zero-knowledge
                  compliance, and lightning-fast execution across chains.
                </p>
              </div>

              {/* <div className="grid gap-6 sm:grid-cols-2 sm:gap-10">
                <div className="space-y-3 sm:space-y-4">
                  <h3
                    className="text-[11px] font-semibold uppercase md:text-xs"
                    style={{
                      fontFamily: "JetBrains Mono, Monaco, 'Courier New', monospace",
                      color: "#8A8A8A",
                      letterSpacing: "0.25em",
                    }}
                  >
                    Product
                  </h3>
                  <ul
                    className="space-y-1 text-xs md:space-y-2 md:text-sm"
                    style={{
                      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                      color: "#1F1F1F",
                    }}
                  >
                    <li>Waitlist</li>
                    <li>Security Playbook</li>
                    <li>Docs &amp; SDK</li>
                    <li>Roadmap</li>
                  </ul>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3
                    className="text-[11px] font-semibold uppercase md:text-xs"
                    style={{
                      fontFamily: "JetBrains Mono, Monaco, 'Courier New', monospace",
                      color: "#8A8A8A",
                      letterSpacing: "0.25em",
                    }}
                  >
                    Company
                  </h3>
                  <ul
                    className="space-y-1 text-xs md:space-y-2 md:text-sm"
                    style={{
                      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                      color: "#1F1F1F",
                    }}
                  >
                    <li>About</li>
                    <li>Careers</li>
                    <li>Press Kit</li>
                    <li>Legal</li>
                  </ul>
                </div>
              </div> */}
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 text-[10px] md:mt-16 md:flex-row md:items-center md:justify-between md:text-xs">
              <p
                className="uppercase"
                style={{
                  fontFamily:
                    "JetBrains Mono, Monaco, 'Courier New', monospace",
                  color: "#7A7A7A",
                  letterSpacing: "0.32em",
                }}
              >
                © {currentYear} avacado.app. All rights reserved.
              </p>
              <div
                className="flex flex-wrap items-center gap-3 uppercase md:gap-6"
                style={{
                  fontFamily:
                    "JetBrains Mono, Monaco, 'Courier New', monospace",
                  color: "#7A7A7A",
                  letterSpacing: "0.28em",
                }}
              >
                <a
                  href="mailto:arkoroy302@gmail.com"
                  className="transition-opacity hover:opacity-70"
                >
                  Contact
                </a>
                <span
                  className="hidden h-[1px] w-12 bg-black/15 md:block"
                  aria-hidden="true"
                />
                <a
                  href="#waitlist"
                  className="transition-opacity hover:opacity-70"
                >
                  Join Waitlist
                </a>
                <span
                  className="hidden h-[1px] w-12 bg-black/15 md:block"
                  aria-hidden="true"
                />
                <a href="/" className="transition-opacity hover:opacity-70">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
