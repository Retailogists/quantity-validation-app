// Health check function for Netlify
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'OK',
      app: 'quantity-validation-app',
      platform: 'netlify',
      timestamp: new Date().toISOString()
    })
  };
}; 