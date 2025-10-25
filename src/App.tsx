import { Suspense, lazy, useState } from "react";
import { Logo } from "./components/layout/Logo";
import {
	NewHome,
	NewRegistration,
	NewDashboard,
	NewDeposit,
	NewWithdraw,
	NewTransfer,
} from "./newPages";

// Lazy load page components
const ECC = lazy(() =>
	import("./pages/ECC").then((module) => ({ default: module.ECC })),
);
const EERC = lazy(() =>
	import("./pages/EERC").then((module) => ({ default: module.EERC })),
);
const Hashes = lazy(() =>
	import("./pages/Hashes").then((module) => ({ default: module.Hashes })),
);
const PoseidonEncrypt = lazy(() =>
	import("./pages/PoseidonEncrypt").then((module) => ({
		default: module.PoseidonEncrypt,
	})),
);

// Loading component
const LoadingFallback = () => (
	<div className="flex items-center justify-center h-full">
		<div className="text-cyber-green font-mono">Loading...</div>
	</div>
);

export function App() {
	const [selectedPage, setSelectedPage] = useState<
		"hashes" | "ecc" | "EERC" | "poseidon"
	>("EERC");
	const [uiVersion, setUiVersion] = useState<"classic" | "new">("classic");
	const [newPage, setNewPage] = useState<
		"home" | "registration" | "dashboard" | "deposit" | "withdraw" | "transfer"
	>("home");
	const [mode] = useState<"standalone" | "converter">("standalone");

	const handleNewPageNavigate = (page: string) => {
		setNewPage(
			page as
				| "home"
				| "registration"
				| "dashboard"
				| "deposit"
				| "withdraw"
				| "transfer"
		);
	};

	// If new UI is selected, render new pages
	if (uiVersion === "new") {
		let PageComponent;
		
		switch (newPage) {
			case "home":
				PageComponent = <NewHome onNavigate={handleNewPageNavigate} />;
				break;
			case "registration":
				PageComponent = <NewRegistration onNavigate={handleNewPageNavigate} mode={mode} />;
				break;
			case "dashboard":
				PageComponent = <NewDashboard onNavigate={handleNewPageNavigate} mode={mode} />;
				break;
			case "deposit":
				PageComponent = <NewDeposit onNavigate={handleNewPageNavigate} mode={mode} />;
				break;
			case "withdraw":
				PageComponent = <NewWithdraw onNavigate={handleNewPageNavigate} mode={mode} />;
				break;
			case "transfer":
				PageComponent = <NewTransfer onNavigate={handleNewPageNavigate} mode={mode} />;
				break;
			default:
				PageComponent = <NewHome onNavigate={handleNewPageNavigate} />;
		}
		
		return (
			<>
				{PageComponent}
				
				{/* Toggle back to classic UI */}
				<button
					type="button"
					onClick={() => setUiVersion("classic")}
					className="fixed bottom-6 right-6 z-50 btn-secondary shadow-lg"
					style={{
						fontFamily: "JetBrains Mono, Monaco, monospace",
					}}
				>
					← Classic UI
				</button>
			</>
		);
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<nav className="sticky top-0 w-64 bg-cyber-dark text-white flex flex-col p-2 h-screen">
				<div className="p-4 font-bold text-lg flex justify-center items-center">
					<Logo />
				</div>
				<ul className="flex-grow space-y-2 p-4">
					<li>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<p
							onClick={() => setSelectedPage("EERC")}
							className="block px-4 py-2 rounded text-center text-cyber-green cursor-pointer font-mono"
						>
							eERC
						</p>
					</li>
					<div className="border-b border-cyber-green/30 my-2" />
					<li>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<p
							onClick={() => setSelectedPage("ecc")}
							className="block px-4 py-2 rounded text-center text-cyber-green cursor-pointer font-mono"
						>
							ECC (BabyJubjub)
						</p>
					</li>
					<div className="border-b border-cyber-green/30 my-2" />
					<li>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<p
							onClick={() => setSelectedPage("hashes")}
							className="block px-4 py-2 rounded text-center text-cyber-green cursor-pointer font-mono"
						>
							Hash Functions
						</p>
					</li>
					<div className="border-b border-cyber-green/30 my-2" />
					<li>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<p
							onClick={() => setSelectedPage("poseidon")}
							className="block px-4 py-2 rounded text-center text-cyber-green cursor-pointer font-mono"
						>
							Poseidon Encryption
						</p>
					</li>
				</ul>

				{/* New UI Toggle Button */}
				<div className="p-4 border-t border-cyber-green/30">
					<button
						type="button"
						onClick={() => setUiVersion("new")}
						className="w-full px-4 py-3 bg-cyber-green text-cyber-dark font-mono font-bold rounded hover:bg-cyber-green/80 transition-colors"
					>
						Try New UI →
					</button>
				</div>
			</nav>

			{/* Page Content */}
			<main className="flex-grow p-6 bg-cyber-black">
				<Suspense fallback={<LoadingFallback />}>
					{selectedPage === "hashes" ? (
						<Hashes />
					) : selectedPage === "ecc" ? (
						<ECC />
					) : selectedPage === "EERC" ? (
						<EERC />
					) : (
						<PoseidonEncrypt />
					)}
				</Suspense>
			</main>
		</div>
	);
}

export default App;
