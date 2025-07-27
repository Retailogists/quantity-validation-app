# Quantity Validation Function

A Shopify Function extension that prevents customers from checking out if any cart line item has a quantity less than 3.

## Overview

This function implements cart and checkout validation to enforce minimum quantity requirements. It runs during the final validation step of the checkout process and will display error messages to customers if any product in their cart doesn't meet the minimum quantity threshold.

## Features

- Validates all cart line items during checkout
- Enforces minimum quantity of 3 for all products
- Provides clear error messages indicating which products need more quantity
- Prevents checkout completion until validation passes

## Function Behavior

- **Minimum Quantity**: 3 items per product
- **Validation Target**: All cart line items
- **Error Handling**: Displays localized error messages for each product that doesn't meet the requirement
- **Checkout Prevention**: Blocks checkout until all items meet the minimum quantity

## Setup and Deployment

### Prerequisites

- Shopify CLI installed
- Rust toolchain with `wasm32-wasip1` target
- Access to a Shopify development store

### Installation

1. Install Rust target for WebAssembly:
   ```bash
   rustup target add wasm32-wasip1
   ```

2. Build the function:
   ```bash
   cargo build --target=wasm32-wasip1 --release
   ```

3. Deploy using Shopify CLI:
   ```bash
   shopify app deploy
   ```

### Configuration

The function is configured in `shopify.extension.toml`:
- **API Version**: 2025-07
- **Target**: `purchase.validation.run`
- **Build Command**: Compiles to WebAssembly

### Testing

You can test the function by:
1. Adding products to a cart with quantities less than 3
2. Attempting to checkout
3. Verifying that validation errors are displayed
4. Increasing quantities to 3 or more
5. Confirming checkout proceeds successfully

## Technical Details

- **Language**: Rust (compiled to WebAssembly)
- **Input**: Cart data including line items and quantities
- **Output**: Validation errors or empty array if validation passes
- **Performance**: Optimized for production with LTO and size optimization

## Error Messages

When validation fails, customers will see messages like:
```
Minimum quantity of 3 is required for 'Product Name - Variant'. Current quantity: 1
```

## Customization

To modify the minimum quantity requirement, update the `MINIMUM_QUANTITY` constant in `src/lib.rs`:

```rust
const MINIMUM_QUANTITY: i32 = 3; // Change this value as needed
``` 