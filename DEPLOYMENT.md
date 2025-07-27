# Deployment Instructions

## Prerequisites

1. **Shopify CLI**: Install the latest version
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Shopify Partner Account**: You need access to a Shopify Partner account

3. **Development Store**: A Shopify development store for testing

## Step-by-Step Deployment

### 1. Initialize Shopify App (if needed)
If this function is not part of an existing app:
```bash
shopify app init
```

### 2. Navigate to Project
```bash
cd quantity-validation-function
```

### 3. Build the Function
```bash
cargo build --target=wasm32-wasip1 --release
```

### 4. Deploy to Shopify
```bash
shopify app deploy
```

### 5. Install on Development Store
After deployment, install the app on your development store through the Partner Dashboard.

## Testing the Function

### Test Scenario 1: Validation Fails
1. Add products to cart with quantities less than 3
2. Proceed to checkout
3. Verify error messages appear
4. Confirm checkout is blocked

### Test Scenario 2: Validation Passes
1. Ensure all cart items have quantity ≥ 3
2. Proceed to checkout
3. Confirm checkout completes successfully

## Configuration Options

To modify the minimum quantity threshold:
1. Edit `src/lib.rs`
2. Change the `MINIMUM_QUANTITY` constant
3. Rebuild and redeploy

```rust
const MINIMUM_QUANTITY: i32 = 5; // Change from 3 to 5
```

## Troubleshooting

### Build Issues
- Ensure `wasm32-wasip1` target is installed: `rustup target add wasm32-wasip1`
- Check Rust version: `rustc --version` (should be 1.70+)

### Deployment Issues
- Verify Shopify CLI is authenticated: `shopify auth status`
- Check function size is under 256KB: `ls -lh target/wasm32-wasip1/release/*.wasm`

### Function Not Working
- Check function is activated in Shopify admin
- Verify the function appears in checkout validation settings
- Review function logs in Partner Dashboard

## Performance Considerations

- Function size: 123KB (well under 256KB limit)
- Optimized for speed with LTO and size optimization
- Minimal memory usage for large carts
- Error messages are localized and user-friendly

## Support

For issues with the Shopify Functions API, refer to:
- [Shopify Functions Documentation](https://shopify.dev/docs/api/functions/latest)
- [Shopify Community Forums](https://community.shopify.com/)
- [Shopify Partners Slack](https://shopifypartners.slack.com/) 