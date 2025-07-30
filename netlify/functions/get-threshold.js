// Function to get current minimum quantity threshold
export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { shop, accessToken } = JSON.parse(event.body);
    
    if (!shop || !accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Get threshold metafield from shop
    const metafieldsResponse = await fetch(`https://${shop}/admin/api/2023-10/metafields.json?namespace=custom&key=minimum_quantity_threshold`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });

    if (!metafieldsResponse.ok) {
      if (metafieldsResponse.status === 404) {
        // No threshold set yet, return default
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            threshold: 3,
            isDefault: true
          })
        };
      }
      
      const errorData = await metafieldsResponse.text();
      throw new Error(`Failed to get threshold: ${errorData}`);
    }

    const result = await metafieldsResponse.json();
    
    if (result.metafields && result.metafields.length > 0) {
      const thresholdValue = parseInt(result.metafields[0].value) || 3;
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threshold: thresholdValue,
          isDefault: false
        })
      };
    } else {
      // No metafield found, return default
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threshold: 3,
          isDefault: true
        })
      };
    }
  } catch (error) {
    console.error('Error getting threshold:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to get threshold',
        details: error.message 
      })
    };
  }
}; 