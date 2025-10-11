# Project Overview

This is a React-based web application designed as a developer tool for exploring and interacting with various cryptographic concepts, particularly those related to zero-knowledge proofs and blockchain technologies. The application provides a user interface for experimenting with eERC, ECC (BabyJubjub), different hash functions, and Poseidon encryption.

## Key Technologies

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **Cryptography:**
    *   `circomlibjs`
    *   `snarkjs`
    *   `@zk-kit/baby-jubjub`
    *   `@zk-kit/poseidon-cipher`
    *   `poseidon-lite`
*   **Blockchain Integration:**
    *   `@avalabs/eerc-sdk`
    *   `wagmi`
    *   `viem`

# Building and Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    or if you have pnpm installed:
    ```bash
    pnpm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

4.  **Preview Production Build:**
    ```bash
    npm run preview
    ```

# Development Conventions

*   The project uses TypeScript for static typing.
*   Styling is done using Tailwind CSS.
*   The application is structured with a main `App.tsx` component that lazy-loads different pages, each dedicated to a specific cryptographic function.
*   Vite is used for the build process, and it's configured to polyfill Node.js built-in modules like `crypto` and `buffer` for browser compatibility.
