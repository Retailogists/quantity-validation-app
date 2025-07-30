// OAuth callback function for Netlify
export const handler = async (event, context) => {
  const { queryStringParameters } = event;
  const { code, shop, host } = queryStringParameters || {};

  if (!code || !shop) {
    return {
      statusCode: 400,
      body: 'Missing required parameters'
    };
  }

  try {
    // App configuration
    const CLIENT_ID = process.env.SHOPIFY_API_KEY || '6d06fe10e07175aeba07d7225e48f3b1';
    const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET;

    if (!CLIENT_SECRET) {
      throw new Error('SHOPIFY_API_SECRET environment variable is required');
    }

    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      // Store access token (in production, store in database)
      console.log(`App installed for shop: ${shop}`);
      
      // Redirect to app interface
      const redirectUrl = `/?shop=${shop}${host ? `&host=${host}` : ''}`;
      
      return {
        statusCode: 302,
        headers: {
          Location: redirectUrl,
        },
      };
    } else {
      return {
        statusCode: 400,
        body: 'Failed to obtain access token'
      };
    }
  } catch (error) {
    console.error('OAuth error:', error);
    return {
      statusCode: 500,
      body: `Authentication failed: ${error.message}`
    };
  }
}; 