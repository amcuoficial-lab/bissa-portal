const fs = require('fs');
const path = require('path');

// GitHub configurations
const GITHUB_OWNER = 'amcuoficial-lab';
const GITHUB_REPO = 'bissa-portal';
const DB_FILE_PATH = 'db.json';

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = process.env.GITHUB_TOKEN;

  // 1. GET Request: Read database
  if (req.method === 'GET') {
    try {
      if (!token) {
        // Fallback: Read local db.json if GITHUB_TOKEN is not set yet
        const localDbPath = path.join(process.cwd(), 'db.json');
        if (fs.existsSync(localDbPath)) {
          const localData = fs.readFileSync(localDbPath, 'utf8');
          return res.status(200).json(JSON.parse(localData));
        }
        return res.status(500).json({ error: 'GITHUB_TOKEN not found and local db.json missing' });
      }

      // Fetch from GitHub REST API
      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Bissa-Portal-App'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      
      return res.status(200).json(JSON.parse(content));
    } catch (error) {
      console.error('Error fetching db.json from GitHub:', error);
      // Secondary fallback to local file
      const localDbPath = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(localDbPath)) {
        const localData = fs.readFileSync(localDbPath, 'utf8');
        return res.status(200).json(JSON.parse(localData));
      }
      return res.status(500).json({ error: error.message });
    }
  }

  // 2. POST Request: Write database or upload file
  if (req.method === 'POST') {
    try {
      if (!token) {
        return res.status(401).json({ error: 'GITHUB_TOKEN is required to make updates. Please configure it in Vercel settings.' });
      }

      const body = req.body;

      // Handle File Upload Action
      if (body.action === 'upload_file') {
        const { fileName, fileContentBase64 } = body;
        if (!fileName || !fileContentBase64) {
          return res.status(400).json({ error: 'fileName and fileContentBase64 are required' });
        }

        const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const uploadPath = `uploads/${cleanFileName}`;
        const commitUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${uploadPath}`;

        const commitResponse = await fetch(commitUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Bissa-Portal-App'
          },
          body: JSON.stringify({
            message: `upload: ${cleanFileName} via admin panel`,
            content: fileContentBase64
          })
        });

        if (!commitResponse.ok) {
          const errMsg = await commitResponse.text();
          throw new Error(`GitHub upload failed: ${errMsg}`);
        }

        // Return the Raw GitHub file URL
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${uploadPath}`;
        return res.status(200).json({ url: rawUrl, fileName: cleanFileName });
      }

      // Handle Full Database Sync Action
      const { releases, shopProducts, submittedDemos } = body;
      if (!releases || !shopProducts || !submittedDemos) {
        return res.status(400).json({ error: 'releases, shopProducts, and submittedDemos fields are required' });
      }

      const newContentString = JSON.stringify({ releases, shopProducts, submittedDemos }, null, 2);
      const newContentBase64 = Buffer.from(newContentString).toString('base64');

      // Fetch the current file meta to get SHA
      const getMetaUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`;
      const metaResponse = await fetch(getMetaUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Bissa-Portal-App'
        }
      });

      let sha = '';
      if (metaResponse.ok) {
        const metaData = await metaResponse.json();
        sha = metaData.sha;
      }

      // Commit changes to GitHub
      const putUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`;
      const putResponse = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Bissa-Portal-App'
        },
        body: JSON.stringify({
          message: 'database update: sync data state',
          content: newContentBase64,
          sha: sha || undefined
        })
      });

      if (!putResponse.ok) {
        const errMsg = await putResponse.text();
        throw new Error(`GitHub commit failed: ${errMsg}`);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error writing to GitHub database:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
