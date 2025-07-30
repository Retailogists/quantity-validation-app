// Function to get access token for a shop
export const handler = async (event, context) => {
  console.log('🔍 DEBUG: get-shop-token called');
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { shop } = JSON.parse(event.body || '{}');
    console.log('🔍 DEBUG: Getting token for shop:', shop);
    
    if (!shop) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing shop parameter' })
      };
    }

    // Method 1: Try to get stored token
    try {
      const tokenResponse = await fetch(`${process.env.URL || 'https://quanvalapp.netlify.app'}/store-token?shop=${shop}`);
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('🔍 DEBUG: Found stored token');
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: tokenData.accessToken,
            source: 'stored'
          })
        };
      }
    } catch (error) {
      console.log('🔍 DEBUG: Error fetching stored token:', error.message);
    }

    // Method 2: Environment variable fallback (for single shop)
    const envToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const envShop = process.env.SHOPIFY_SHOP_DOMAIN;
    
    if (envToken && envShop && shop === envShop) {
      console.log('🔍 DEBUG: Using environment variable token');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: envToken,
          source: 'environment'
        })
      };
    }

    // Method 3: No token found
    console.log('🔍 DEBUG: No token found anywhere');
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'No access token found',
        message: 'Please install the app via OAuth first',
        installUrl: `https://quanvalapp.netlify.app/auth?shop=${shop}`
      })
    };
  } catch (error) {
    console.error('Error in get-shop-token:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
}; 