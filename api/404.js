// Vercel serverless function to handle 404 errors with proper status code
export default function handler(req, res) {
  res.status(404).json({
    error: 'Page Not Found',
    message: 'The requested page does not exist',
    statusCode: 404
  });
}

