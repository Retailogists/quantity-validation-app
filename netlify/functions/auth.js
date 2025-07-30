// OAuth initiation function for Netlify
export const handler = async (event, context) => {
  const { queryStringParameters } = event;
  const shop = queryStringParameters?.shop;
  
  if (!shop) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing shop parameter' })
    };
  }

  // App configuration
  const CLIENT_ID = process.env.SHOPIFY_API_KEY || '6d06fe10e07175aeba07d7225e48f3b1';
  const SCOPES = 'write_discounts,read_products,write_products';
  const REDIRECT_URI = `${process.env.URL || 'https://your-app.netlify.app'}/auth/callback`;

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;

  return {
    statusCode: 302,
    headers: {
      Location: installUrl,
    },
  };
}; 