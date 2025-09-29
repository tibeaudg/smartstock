// API endpoint for ads.txt with correct Content-Type header
export default function handler(req, res) {
  // Set the correct Content-Type header for ads.txt
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // ads.txt content
  const adsContent = `# ads.txt file for stockflow.be
# This file helps prevent unauthorized inventory sales

# Google AdSense
google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0

# Add other authorized sellers as needed
# Example format: domain.com, publisher-id, relationship, certification-authority-id`;

  res.status(200).send(adsContent);
}
