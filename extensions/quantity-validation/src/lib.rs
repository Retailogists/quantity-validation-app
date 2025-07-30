use shopify_function::prelude::*;
use shopify_function::Result;
use std::collections::HashMap;

#[derive(Deserialize)]
struct Input {
    buyerJourney: BuyerJourney,
    shop: Shop,
    cart: Cart,
}

#[derive(Deserialize)]
struct BuyerJourney {
    step: Option<String>,
}

#[derive(Deserialize)]
struct Shop {
    thresholdMetafield: Option<Metafield>,
}

#[derive(Deserialize)]
struct Cart {
    lines: Vec<CartLine>,
}

#[derive(Deserialize)]
struct CartLine {
    id: String,
    quantity: i32,
    merchandise: Option<Merchandise>,
}

#[derive(Deserialize)]
struct Merchandise {
    id: Option<String>,
    title: Option<String>,
    inventoryMetafield: Option<Metafield>,
    product: Option<Product>,
}

#[derive(Deserialize)]
struct Product {
    id: Option<String>,
    title: Option<String>,
}

#[derive(Deserialize)]
struct Metafield {
    value: Option<String>,
}

const DEFAULT_MINIMUM_QUANTITY: i32 = 3;

// Function for purchase validation (works for both cart checkout and direct checkout)
#[shopify_function]
fn run(input: Input) -> Result<HashMap<String, Vec<HashMap<String, String>>>> {
    eprintln!("DEBUG: Purchase validation function started");
    eprintln!("DEBUG: Buyer journey step: {:?}", input.buyerJourney.step);
    eprintln!("DEBUG: Cart has {} lines", input.cart.lines.len());

    let mut errors = Vec::new();

    // Get minimum quantity threshold from shop metafield, fallback to default
    let minimum_quantity = if let Some(threshold_metafield) = &input.shop.thresholdMetafield {
        if let Some(threshold_value) = &threshold_metafield.value {
            threshold_value.parse::<i32>().unwrap_or(DEFAULT_MINIMUM_QUANTITY)
        } else {
            DEFAULT_MINIMUM_QUANTITY
        }
    } else {
        DEFAULT_MINIMUM_QUANTITY
    };

    eprintln!("DEBUG: Using minimum quantity threshold: {}", minimum_quantity);

    // Determine if this is a checkout context
    let is_checkout = input.buyerJourney.step.as_ref()
        .map(|step| step.contains("CHECKOUT"))
        .unwrap_or(false);

    eprintln!("DEBUG: Is checkout context: {}", is_checkout);

    for (i, line) in input.cart.lines.iter().enumerate() {
        if let Some(merchandise) = &line.merchandise {
            eprintln!("DEBUG: Line {}: {} (ID: {:?})", i, 
                merchandise.title.as_deref().unwrap_or("Unknown"), 
                merchandise.id);
            
            // Get inventory from metafield
            let inventory_available = if let Some(inventory_metafield) = &merchandise.inventoryMetafield {
                eprintln!("DEBUG: Found inventory metafield with value: {:?}", inventory_metafield.value);
                inventory_metafield.value.as_ref()
                    .and_then(|v| v.parse::<i32>().ok())
                    .unwrap_or(0)
            } else {
                eprintln!("DEBUG: No inventory metafield found");
                0
            };

                            eprintln!("DEBUG: Available inventory: {}, Minimum required: {}", inventory_available, minimum_quantity);

                // Validate inventory with context-appropriate message
                if inventory_available > 0 && inventory_available < minimum_quantity {
                let error_message = if is_checkout {
                    // Specific product name for checkout
                    let product_name = merchandise.product.as_ref()
                        .and_then(|p| p.title.as_ref())
                        .map_or("This product", |v| v);
                    
                    let variant_title = merchandise.title.as_ref()
                        .map(|t| format!(" ({})", t))
                        .unwrap_or_default();

                    let full_product_name = format!("{}{}", product_name, variant_title);
                    format!("{} is out of stock", full_product_name)
                } else {
                    // For cart interactions, try to force visibility with a more prominent message
                    let buyer_step = input.buyerJourney.step.as_deref().unwrap_or("unknown");
                    eprintln!("DEBUG: Buyer step is: {}, treating as cart checkout attempt", buyer_step);
                    "This product is out of stock".to_string()
                };

                eprintln!("DEBUG: BLOCKING purchase - {}", error_message);

                let mut error = HashMap::new();
                error.insert("localizedMessage".to_string(), error_message);
                // Try targeting the cart directly for cart interactions
                let target = if is_checkout {
                    "$.cart.lines[*].quantity".to_string()
                } else {
                    "$.cart".to_string()  // Target the cart itself for cart interactions
                };
                error.insert("target".to_string(), target);
                
                errors.push(error);
            } else if inventory_available == 0 {
                eprintln!("DEBUG: No inventory data - allowing purchase");
                            } else {
                    eprintln!("DEBUG: Sufficient inventory ({} >= {}) - allowing purchase", 
                        inventory_available, minimum_quantity);
                }
        }
    }

    let mut result = HashMap::new();
    let error_count = errors.len();
    result.insert("errors".to_string(), errors);
    
    eprintln!("DEBUG: Purchase validation returning {} errors", error_count);
    Ok(result)
} 