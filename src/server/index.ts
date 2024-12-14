import express from "express";
import cors from "cors";
import { config } from "dotenv";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
      };
    }
  }
}

config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

app.get("/api/auth", async (_req, res) => {
  const name = uniqueNamesGenerator({
    dictionaries: [colors, ["-dash-"], animals],
    separator: "",
    style: "lowerCase",
  });

  const result = await pool.query(
    `
    INSERT INTO users (name)
    VALUES ($1)
    RETURNING id
  `,
    [name],
  );
  const user_id = result.rows[0].id;

  const token = jwt.sign({ user_id }, process.env.JWT_SECRET as string);
  res.json({ jwt: token });
});

app.get("/api/placeholder/:width/:height", async (req, res) => {
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

    const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("Error generating placeholder:", err);
    res.status(500).json({ error: "Error generating placeholder image" });
  }
});

app.get("/api/top", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.name,
        COUNT(CASE WHEN v.value = 1 THEN 1 END) as hot_votes,
        COUNT(CASE WHEN v.value = -1 THEN 1 END) as not_votes,
        COUNT(v.*) as total_votes
      FROM images i
      LEFT JOIN votes v ON i.id = v.image_id
      GROUP BY i.id, i.name
      HAVING COUNT(v.*) > 0
      ORDER BY 
        CAST(COUNT(CASE WHEN v.value = 1 THEN 1 END) AS FLOAT) / NULLIF(COUNT(v.*), 0) DESC,
        COUNT(v.*) DESC
      LIMIT 10
    `);
    res.json(
      result.rows.map((row: any) => ({
        name: row.name,
        hot_votes: row.hot_votes,
        total_votes: row.total_votes,
      })),
    );
  } catch (err) {
    console.error("Error fetching top users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(async (req: any, _res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        user_id: number;
      };
      const user_id = { id: decoded.user_id };
      const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
        user_id.id,
      ]);
      if (userResult.rows.length === 0) {
        return next(new Error("User not found"));
      }
      req.user = userResult.rows[0];
    } catch (err) {
      console.error("Error verifying JWT:", err);
    }
  }
  next();
});

app.get("/api/images", async (req, res) => {
  try {
    const kind = req.query.kind;
    const result = await pool.query(
      `
        SELECT i.id, i.href, i.name
        FROM images i
        JOIN kinds k ON i.kind_id = k.id
        LEFT JOIN votes v ON i.id = v.image_id AND v.user_id = $2
        WHERE k.name = $1
        AND v.id IS NULL
      `,
      [kind, req.user?.id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/vote", async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { image_id, vote } = req.body;

    // Validate required fields
    if (!user_id || !image_id || vote === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure vote value is either -1 or 1
    if (vote !== "HOT" && vote !== "NOT") {
      return res
        .status(400)
        .json({ error: "Vote value must be either -1 or 1" });
    }

    const result = await pool.query(
      `INSERT INTO votes (user_id, image_id, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, image_id)
       DO UPDATE SET value = $3
       RETURNING *`,
      [user_id, image_id, vote === "HOT" ? 1 : -1],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error submitting vote:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
