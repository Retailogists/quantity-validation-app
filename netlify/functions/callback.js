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
    console.log('🔍 DEBUG: Token response:', { 
      hasAccessToken: !!tokenData.access_token, 
      tokenLength: tokenData.access_token ? tokenData.access_token.length : 0,
      shop 
    });
    
    if (tokenData.access_token) {
      // Store access token for future use
      console.log(`App installed for shop: ${shop}`);
      
      try {
        // Store the token
        await fetch(`${process.env.URL || 'https://quanvalapp.netlify.app'}/store-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shop: shop,
            accessToken: tokenData.access_token
          })
        });
        console.log('🔍 DEBUG: Token stored successfully');
      } catch (error) {
        console.error('🔍 DEBUG: Failed to store token:', error);
      }
      
      // Redirect to app interface with access token (base64 encoded for security)
      const tokenParam = Buffer.from(tokenData.access_token).toString('base64');
      const redirectUrl = `/?shop=${shop}${host ? `&host=${host}` : ''}&token=${tokenParam}`;
      
      console.log('🔍 DEBUG: Redirect URL:', redirectUrl);
      console.log('🔍 DEBUG: Token param length:', tokenParam.length);
      
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