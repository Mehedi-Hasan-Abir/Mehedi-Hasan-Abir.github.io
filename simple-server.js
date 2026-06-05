import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Serve static files from client/public
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'client', 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Portfolio Performance Test</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <h1>Portfolio Performance Test</h1>
        <p>This is a test page for load testing.</p>
        <script>
          // Simulate some loading time
          setTimeout(() => {
            console.log('Page loaded successfully');
          }, 200);
        </script>
      </body>
      </html>
    `);
  }
});

// Simulate portfolio data API
app.get('/api/portfolio-data', (req, res) => {
  res.json({
    name: "Mehedi Hasan",
    title: "AI Engineer",
    responseTime: Math.random() * 100 + 50,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple test server running on http://localhost:${PORT}`);
});

export default app;