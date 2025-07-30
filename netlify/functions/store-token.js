// Simple token storage function
const tokens = new Map(); // In production, use a database

export const handler = async (event, context) => {
  console.log('🔍 DEBUG: store-token called');
  
  if (event.httpMethod === 'POST') {
    // Store token
    try {
      const { shop, accessToken } = JSON.parse(event.body);
      console.log('🔍 DEBUG: Storing token for shop:', shop);
      
      if (!shop || !accessToken) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing shop or accessToken' })
        };
      }
      
      tokens.set(shop, accessToken);
      console.log('🔍 DEBUG: Token stored successfully');
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      console.error('Error storing token:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to store token' })
      };
    }
  } else if (event.httpMethod === 'GET') {
    // Retrieve token
    const shop = event.queryStringParameters?.shop;
    console.log('🔍 DEBUG: Getting token for shop:', shop);
    
    if (!shop) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing shop parameter' })
      };
    }
    
    const accessToken = tokens.get(shop);
    console.log('🔍 DEBUG: Token found:', !!accessToken);
    
    if (accessToken) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accessToken: accessToken,
          shop: shop 
        })
      };
    } else {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No token found for shop' })
      };
    }
  }
  
  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 