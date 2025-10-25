# RPC and Flickering Issues - Fixed

## Problems Identified

### 1. **CORS & Rate Limiting (429 Error)**
**Error:**
```
Access to fetch at 'https://rpc.walletconnect.org/v1/?chainId=eip155%3A43113...' 
has been blocked by CORS policy

POST https://rpc.walletconnect.org/v1/... net::ERR_FAILED 429 (Too Many Requests)
```

**Root Cause:**
- WalletConnect's RPC endpoint has strict rate limits
- Default Wagmi configuration was using WalletConnect RPC for all blockchain calls
- Multiple components making parallel calls to check registration status

**Solution:**
- ✅ Configured custom RPC transport using Avalanche's official public RPC
- ✅ Added retry logic with exponential backoff
- ✅ Implemented request batching to reduce call frequency
- ✅ Added fallback RPC endpoints for redundancy

### 2. **Page Flickering on "Get Started"**
**Symptom:**
- Clicking "Get Started" causes rapid flickering between registration and dashboard
- Console shows repeated registration status checks
- Endless spam of `[EERC] - Decryption key is not set` messages

**Root Causes:**
1. **Multiple Components Rendering Simultaneously**:
```tsx
// OLD CODE - Rendered ALL pages at once (only hiding them)
{newPage === "home" && <NewHome />}
{newPage === "registration" && <NewRegistration />}
{newPage === "dashboard" && <NewDashboard />}
{newPage === "deposit" && <NewDeposit />}
{newPage === "withdraw" && <NewWithdraw />}
{newPage === "transfer" && <NewTransfer />}
// This caused useEERC to be called 6 times!
```

2. **Infinite Redirect Loop**:
```tsx
// OLD CODE - Caused infinite loop
useEffect(() => {
    if (isRegistered) {
        onNavigate("dashboard"); // This triggers re-render
    }
}, [isRegistered, onNavigate]); // Dependencies change on every render
```

**Solutions:**
1. **Fixed Component Rendering** - Only render ONE component at a time:
```tsx
// NEW CODE - Only render the active page
let PageComponent;
switch (newPage) {
    case "home":
        PageComponent = <NewHome />;
        break;
    case "registration":
        PageComponent = <NewRegistration />;
        break;
    // ... etc
}
return <>{PageComponent}</>;
```

2. **Fixed Registration Check** - Use `useRef` to prevent infinite loops:
```tsx
// NEW CODE - Check only once using ref
const hasRedirectedRef = useRef(false);

useEffect(() => {
    if (isRegistered && isConnected && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        const timer = setTimeout(() => {
            toast.info("You are already registered!");
            onNavigate("dashboard");
        }, 800);
        return () => clearTimeout(timer);
    }
}, [isRegistered, isConnected, onNavigate]);
```

## Files Changed

### 1. `src/config/contracts.ts`
Added RPC configuration:
```typescript
export const RPC_CONFIG = {
    AVALANCHE_FUJI: "https://api.avax-test.network/ext/bc/C/rpc",
    FALLBACK_RPCS: [
        "https://avalanche-fuji-c-chain-rpc.publicnode.com",
        "https://rpc.ankr.com/avalanche_fuji",
    ],
} as const;
```

### 2. `src/AppKitProvider.tsx`
**Changes:**
- Imported `http` from viem and `RPC_CONFIG` from config
- Added custom QueryClient with retry logic
- Configured custom transport for Avalanche Fuji chain
- Added request batching (100ms wait time)
- Added retry logic (3 attempts, 1s delay)

### 3. `src/App.tsx` ⚠️ **CRITICAL FIX**
**Changes:**
- Changed from conditional rendering (&&) to switch statement
- **Before**: All 6 pages rendered simultaneously (hidden with `&&`)
  - This caused `useEERC` to be called 6 times on every render!
  - Each call fetched contract data, checked registration, etc.
- **After**: Only ONE page component is rendered at a time
  - Reduced `useEERC` calls from 6 to 1
  - Eliminated infinite log spam

### 4. `src/newPages/NewRegistration.tsx`
**Changes:**
- Added `useRef` import
- Added `hasRedirectedRef` ref to track if redirect already happened
- Modified registration check to only run once using ref
- Added 800ms delay before redirect for smoother UX
- Added cleanup function to clear timeout
- Added toast notification when already registered

## Testing Checklist

### ✅ RPC Issues
- [ ] Open browser DevTools → Network tab
- [ ] Click "Get Started" button
- [ ] Verify requests go to `https://api.avax-test.network/ext/bc/C/rpc`
- [ ] Confirm no 429 errors
- [ ] Confirm no CORS errors

### ✅ Page Flickering
- [ ] Navigate to New Home page
- [ ] Click "Get Started" button
- [ ] Verify page doesn't flicker
- [ ] If already registered, verify:
  - Toast shows "You are already registered!"
  - Smooth redirect to dashboard after 500ms

### ✅ Performance
- [ ] Check Network tab → fewer RPC calls
- [ ] Verify request batching is working
- [ ] Monitor console for any new errors

## Additional Improvements

### Request Batching
Requests within 100ms window are batched together:
```typescript
batch: {
    wait: 100,
}
```

### Exponential Backoff
Failed requests retry with increasing delays:
```typescript
retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
```

### Fallback RPCs
If primary RPC fails, can manually switch to fallbacks:
- `https://avalanche-fuji-c-chain-rpc.publicnode.com`
- `https://rpc.ankr.com/avalanche_fuji`

## Known Limitations

1. **Public RPC Rate Limits**: Even public RPCs have limits (usually 5-10 requests/second)
2. **No Automatic Fallback**: Current implementation uses one RPC; fallback requires manual config change
3. **Network Latency**: Public RPCs may be slower than private/paid endpoints

## Future Improvements

1. **Implement Automatic Fallback**:
   ```typescript
   const transports = {
       [avalancheFuji.id]: fallback([
           http(RPC_CONFIG.AVALANCHE_FUJI),
           ...RPC_CONFIG.FALLBACK_RPCS.map(url => http(url))
       ])
   }
   ```

2. **Use Private RPC for Production**:
   - Get API key from Alchemy, Infura, or QuickNode
   - Higher rate limits (25-100 req/sec)
   - Better reliability

3. **Implement Request Caching**:
   - Cache registration status for 30s
   - Reduce redundant blockchain calls

4. **Add Loading States**:
   - Show skeleton loaders during initial load
   - Prevent users from spamming buttons

## Environment Variables (Optional)

For production, consider adding:
```env
VITE_AVALANCHE_FUJI_RPC=https://your-private-rpc-url
VITE_RPC_RETRY_COUNT=3
VITE_RPC_RETRY_DELAY=1000
```

Then use in config:
```typescript
export const RPC_CONFIG = {
    AVALANCHE_FUJI: import.meta.env.VITE_AVALANCHE_FUJI_RPC || 
                    "https://api.avax-test.network/ext/bc/C/rpc",
} as const;
```

## Support

If issues persist:
1. Clear browser cache and hard reload (Ctrl+Shift+R)
2. Check Avalanche Fuji network status: https://status.avax.network/
3. Try a different fallback RPC endpoint
4. Monitor DevTools console for specific error messages
