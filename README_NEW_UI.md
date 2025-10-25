# 4dent New UI Implementation

## 🎨 Overview

This document describes the new minimal UI implementation for the 4dent encrypted ERC application. The new UI provides a cleaner, more modern interface while maintaining all the functionality of the classic version.

## 🚀 How to Use

### Switching Between UIs

**From Classic UI → New UI:**
- Click the **"Try New UI →"** button in the bottom of the sidebar in the classic interface

**From New UI → Classic UI:**
- Click the **"← Classic UI"** button in the bottom-right corner of the screen

### Navigation Flow

1. **Home Page** - Landing page with features and quick actions
2. **Registration** - Generate keys and register on-chain
3. **Dashboard** - View encrypted balance and account info
4. **Deposit** - Convert public tokens to encrypted tokens
5. **Transfer** - Send encrypted tokens privately
6. **Withdraw** - Convert encrypted tokens back to public

## 📁 File Structure

```
src/
├── newComponents/           # Reusable UI components for new design
│   ├── AmountInput.tsx     # Large amount input with quick percentages
│   ├── BalanceCard.tsx     # Balance display with privacy toggle
│   ├── LoadingSpinner.tsx  # Loading states for proof generation
│   ├── NewLayout.tsx       # Base layout with header/footer
│   ├── StatusIndicator.tsx # Status messages with icons
│   └── index.ts            # Component exports
│
├── newPages/               # New UI page components
│   ├── NewHome.tsx         # Landing/home page
│   ├── NewRegistration.tsx # Key generation & registration
│   ├── NewDashboard.tsx    # Balance overview & quick actions
│   ├── NewDeposit.tsx      # Deposit flow with ZK proofs
│   ├── NewWithdraw.tsx     # Withdrawal flow
│   ├── NewTransfer.tsx     # Private transfer flow
│   └── index.ts            # Page exports
│
└── newStyles.css           # New UI styling system
```

## 🎨 Design System

### Colors

- **Primary (Coral Red):** `#FF6B6B` - Headings, CTAs, primary actions
- **Success (Emerald Green):** `#00A667` - Success states, confirmations
- **Warning (Warm Yellow):** `#C4A600` - Warnings, highlights
- **Background:** `#ECECEC` with dotted pattern
- **Cards:** White `rgba(255, 255, 255, 0.85)` with subtle blur

### Typography

- **Headings:** Scto Grotesk A (fallback: Inter)
- **Body Text:** Inter
- **Code/Labels:** JetBrains Mono

### Key CSS Classes

```css
.dotted-bg          /* Background with dot pattern */
.frost-card         /* White translucent card */
.mono-kicker        /* Small uppercase labels */
.btn-primary        /* Coral red primary button */
.btn-secondary      /* Light secondary button */
.btn-success        /* Green success button */
.interactive-card   /* Hoverable card */
```

## 🔧 Component Reference

### BalanceCard
```tsx
<BalanceCard
    balance="123.45"
    symbol="eERC"
    label="Encrypted Balance"
    onRefresh={() => refetchBalance()}
    isRefreshing={false}
    showPrivacyToggle={true}
/>
```

### AmountInput
```tsx
<AmountInput
    value={amount}
    onChange={setAmount}
    symbol="ETH"
    availableBalance="0.776"
    showQuickAmounts={true}
    onMax={() => setAmount(maxAmount)}
/>
```

### StatusIndicator
```tsx
<StatusIndicator
    status="success"  // "pending" | "success" | "error" | "info"
    message="Transaction successful!"
    variant="card"     // "inline" | "card"
    details="Optional details text"
/>
```

### LoadingSpinner
```tsx
<LoadingSpinner
    message="Generating zero-knowledge proof..."
    progress="This may take 10-30 seconds"
    size="md"  // "sm" | "md" | "lg"
/>
```

## ✨ Features Implemented

### ✅ All Pages

- [x] **NewHome** - Landing page with features grid
- [x] **NewRegistration** - 3-step registration flow
  - Generate encryption keys locally
  - Backup keys (download JSON)
  - Register public key on-chain
- [x] **NewDashboard** - Overview with quick actions
  - Encrypted balance display with privacy toggle
  - Account information
  - Quick action cards
- [x] **NewDeposit** - Deposit flow
  - Amount input with quick percentages
  - Token selection (converter mode)
  - Step progress indicator
  - ZK proof generation
- [x] **NewWithdraw** - Withdrawal flow
  - Balance preview (before/after)
  - Insufficient balance warnings
  - ZK proof generation
- [x] **NewTransfer** - Private transfer
  - Recipient validation
  - Registration status check
  - Privacy notice
  - ZK proof generation

### 🔐 SDK Integration

All pages fully integrate with `@avalabs/eerc-sdk`:

- ✅ `useEERC()` hook for registration and key management
- ✅ `useEncryptedBalance()` for balance operations
- ✅ Zero-knowledge proof generation
- ✅ Transaction handling with toast notifications
- ✅ Error handling and validation

## 🧪 Testing Checklist

### Manual Testing

- [ ] **Wallet Connection**
  - [ ] Connect wallet from New UI
  - [ ] Switch networks
  - [ ] Disconnect wallet
  
- [ ] **Registration Flow**
  - [ ] Generate keys
  - [ ] Download backup
  - [ ] Register on-chain
  - [ ] Verify registration status
  
- [ ] **Deposit**
  - [ ] Enter amount
  - [ ] Use quick percentages
  - [ ] Generate proof
  - [ ] Submit transaction
  - [ ] Verify balance update
  
- [ ] **Transfer**
  - [ ] Validate recipient address
  - [ ] Check registration status
  - [ ] Enter amount
  - [ ] Generate proof
  - [ ] Submit transaction
  
- [ ] **Withdraw**
  - [ ] Check sufficient balance
  - [ ] Preview remaining balance
  - [ ] Generate proof
  - [ ] Submit transaction

- [ ] **UI Toggle**
  - [ ] Switch from Classic → New
  - [ ] Switch from New → Classic
  - [ ] Verify state preservation

## 🐛 Known Issues

None currently. All features are functional.

## 🔮 Future Enhancements

- [ ] Add transaction history timeline
- [ ] Implement address book for transfers
- [ ] Add mobile responsive design
- [ ] Dark mode toggle
- [ ] More detailed proof generation progress
- [ ] Batch operations support
- [ ] QR code scanning for addresses

## 📝 Development Notes

### Adding New Pages

1. Create page component in `src/newPages/`
2. Export from `src/newPages/index.ts`
3. Import in `App.tsx`
4. Add route condition in `App.tsx`
5. Add navigation option in NewHome or NewDashboard

### Styling Guidelines

- Use existing CSS classes from `newStyles.css`
- Follow the frost card pattern for all containers
- Use mono-kicker for all labels
- Maintain 8px spacing increments
- Use rounded-[2px] for subtle borders
- Use rounded-[8px] for input fields

### Best Practices

- Always validate user input
- Show loading states during async operations
- Display clear error messages
- Provide visual feedback for all actions
- Maintain accessibility (ARIA labels, keyboard navigation)
- Test with different wallet states (connected/disconnected, registered/unregistered)

## 🆘 Troubleshooting

**Issue: Pages not rendering**
- Check if `newStyles.css` is imported in `main.tsx`
- Verify all components are exported from `index.ts` files

**Issue: Proof generation fails**
- Check circuit files exist in `/public` directory
- Verify CIRCUIT_CONFIG in `config/contracts.ts`

**Issue: Transactions failing**
- Confirm wallet is connected
- Check user is registered
- Verify sufficient balance
- Check network (should be Avalanche Fuji)

**Issue: TypeScript errors**
- Run `npm install` to ensure all dependencies are installed
- Check for missing type definitions

## 📞 Support

For issues or questions:
1. Check this README
2. Review component code in `src/newComponents/`
3. Check SDK documentation at https://avacloud.gitbook.io/encrypted-erc/

---

**Version:** 1.0.0  
**Last Updated:** October 25, 2025  
**Maintainer:** 4dent Team
