#!/bin/bash

echo "Testing Quantity Validation Function..."
echo "======================================"

# Test with the sample input that has items with quantities < 3
echo "Input (has items with quantity < 3):"
cat input.json
echo ""

echo "Function output:"
cat input.json | wasmtime target/wasm32-wasip1/release/quantity_validation_function.wasm

echo ""
echo "Expected: Should show validation errors for items with quantity < 3"
echo "- T-Shirt (quantity: 2) should trigger error"
echo "- Jacket (quantity: 1) should trigger error"
echo "- Hoodie (quantity: 5) should be fine" 