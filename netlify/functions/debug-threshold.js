// Debug function to test threshold saving
export const handler = async (event, context) => {
  console.log('Debug threshold function called');
  console.log('Method:', event.httpMethod);
  console.log('Body:', event.body);
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);
    
    const { shop, threshold, accessToken } = body;
    
    console.log('Shop:', shop);
    console.log('Threshold:', threshold);
    console.log('AccessToken present:', !!accessToken);
    console.log('AccessToken length:', accessToken ? accessToken.length : 0);
    
    if (!shop || !threshold || !accessToken) {
      const missing = [];
      if (!shop) missing.push('shop');
      if (!threshold) missing.push('threshold');
      if (!accessToken) missing.push('accessToken');
      
      console.log('Missing parameters:', missing);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          missing: missing,
          received: { shop: !!shop, threshold: !!threshold, accessToken: !!accessToken }
        })
      };
    }

    // Test API call to Shopify
    const apiUrl = `https://${shop}/admin/api/2023-10/metafields.json`;
    console.log('API URL:', apiUrl);
    
    const metafieldData = {
      metafield: {
        namespace: 'custom',
        key: 'minimum_quantity_threshold',
        value: threshold.toString(),
        type: 'number_integer',
        description: 'Minimum quantity threshold for validation'
      }
    };
    
    console.log('Metafield data:', JSON.stringify(metafieldData, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify(metafieldData),
    });
    
    console.log('Shopify API response status:', response.status);
    console.log('Shopify API response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Shopify API response body:', responseText);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Shopify API call failed',
          status: response.status,
          details: responseText,
          url: apiUrl
        })
      };
    }
    
    const result = JSON.parse(responseText);
    console.log('Success! Metafield created:', result.metafield?.id);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        threshold: parseInt(threshold),
        metafield_id: result.metafield?.id,
        debug: {
          shop,
          apiUrl,
          responseStatus: response.status
        }
      })
    };
  } catch (error) {
    console.error('Error in debug-threshold:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      })
    };
  }
}; 