import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'cv-studio-backend', timestamp: new Date().toISOString() });
});

// API Routes placeholder (CV CRUD, Auth sync)
app.get('/api/cv/:id', (req: Request, res: Response) => {
  res.json({ message: `Lấy thông tin CV id: ${req.params.id}` });
});

app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại port ${PORT}`);
});
