// Vercel serverless function to handle 500 errors with proper status code
export default function handler(req, res) {
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the server',
    statusCode: 500
  });
}



