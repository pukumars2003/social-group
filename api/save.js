export default async function handler(req, res) {
  // Add CORS headers so GitHub Pages can call this API if hosted separately
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // You can restrict this to your GitHub Pages URL later
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Configuration
    const GITHUB_OWNER = 'pukumars2003'; // Extracted from your Vercel screenshot
    const GITHUB_REPO = 'social-group';
    
    // Hit the GitHub Actions repository_dispatch API
    const githubResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'Vercel-Serverless-Function'
        },
        body: JSON.stringify({
          event_type: 'save_location_data',
          client_payload: payload
        })
      }
    );

    if (!githubResponse.ok) {
      throw new Error(`GitHub API returned ${githubResponse.status}`);
    }

    return res.status(200).json({ success: true });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
