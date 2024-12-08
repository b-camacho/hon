import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import sharp from 'sharp';

config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000;
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME
});

app.use(cors());
app.use(express.json());

app.get('/api/placeholder/:width/:height', async (req, res) => {
  try {
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e2e8f0"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial" 
          font-size="20" 
          fill="#64748b"
          text-anchor="middle" 
          dominant-baseline="middle"
        >${width}x${height}</text>
      </svg>
    `;

    const buffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error('Error generating placeholder:', err);
    res.status(500).json({ error: 'Error generating placeholder image' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/images', async (req, res) => {
    try {
      const kind = req.query.kind;
      const result = await pool.query(`
        SELECT i.id, i.href, i.name
        FROM images i
        JOIN kinds k ON i.kind_id = k.id
        WHERE k.name = $1
      `, [kind]);

      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.post('/api/vote', async (req, res) => {
  try {
    const { user_id, image_id, vote } = req.body;
    
    // Validate required fields
    if (!user_id || !image_id || vote === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure vote value is either -1 or 1
    if (vote !== "HOT" && vote !== "NOT") {
      return res.status(400).json({ error: 'Vote value must be either -1 or 1' });
    }

    const result = await pool.query(
      `INSERT INTO votes (user_id, image_id, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, image_id)
       DO UPDATE SET value = $3
       RETURNING *`,
      [user_id, image_id, vote === "HOT" ? 1 : -1]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting vote:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});