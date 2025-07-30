// Function to set minimum quantity threshold
export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { shop, threshold, accessToken } = JSON.parse(event.body);
    
    if (!shop || !threshold || !accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Validate threshold is a positive number
    const thresholdValue = parseInt(threshold);
    if (isNaN(thresholdValue) || thresholdValue < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Threshold must be a positive number' })
      };
    }

    // Save threshold as shop metafield
    const metafieldResponse = await fetch(`https://${shop}/admin/api/2023-10/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        metafield: {
          namespace: 'custom',
          key: 'minimum_quantity_threshold',
          value: thresholdValue.toString(),
          type: 'number_integer',
          description: 'Minimum quantity threshold for validation'
        }
      }),
    });

    if (!metafieldResponse.ok) {
      const errorData = await metafieldResponse.text();
      throw new Error(`Failed to save threshold: ${errorData}`);
    }

    const result = await metafieldResponse.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        threshold: thresholdValue,
        metafield_id: result.metafield.id
      })
    };
  } catch (error) {
    console.error('Error setting threshold:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to set threshold',
        details: error.message 
      })
    };
  }
}; 