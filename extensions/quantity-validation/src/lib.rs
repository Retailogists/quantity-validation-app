use serde::{Deserialize, Serialize};
use std::io::{self, Read};

#[derive(Deserialize)]
struct Input {
    cart: Cart,
}

#[derive(Deserialize)]
struct Cart {
    lines: Vec<CartLine>,
}

#[derive(Deserialize)]
struct CartLine {
    id: String,
    quantity: i32,
    merchandise: Merchandise,
}

#[derive(Deserialize)]
struct Merchandise {
    #[serde(flatten)]
    variant: Option<ProductVariant>,
}

#[derive(Deserialize)]
struct ProductVariant {
    id: String,
    title: String,
    product: Product,
}

#[derive(Deserialize)]
struct Product {
    id: String,
    title: String,
}

#[derive(Serialize)]
struct FunctionResult {
    errors: Vec<ValidationError>,
}

#[derive(Serialize)]
struct ValidationError {
    localized_message: String,
    target: String,
}

const MINIMUM_QUANTITY: i32 = 3;

#[no_mangle]
pub extern "C" fn run() -> i32 {
    let result = main();
    match result {
        Ok(_) => 0,
        Err(_) => 1,
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input)?;
    
    let input_data: Input = serde_json::from_str(&input)?;
    let mut errors = Vec::new();
    
    // Check each cart line for minimum quantity requirement
    for line in &input_data.cart.lines {
        if line.quantity < MINIMUM_QUANTITY {
            let product_title = if let Some(ref variant) = line.merchandise.variant {
                format!("{} - {}", variant.product.title, variant.title)
            } else {
                "Product".to_string()
            };
            
            errors.push(ValidationError {
                localized_message: format!(
                    "Minimum quantity of {} is required for '{}'. Current quantity: {}",
                    MINIMUM_QUANTITY,
                    product_title,
                    line.quantity
                ),
                target: format!("$.cart.lines[?(@.id == '{}')].quantity", line.id),
            });
        }
    }
    
    let result = FunctionResult { errors };
    let output = serde_json::to_string(&result)?;
    println!("{}", output);
    
    Ok(())
} 