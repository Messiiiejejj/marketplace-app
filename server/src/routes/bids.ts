import express from 'express';
import pool from '../db.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = express.Router();

// Place Bid
router.post('/:id/bid', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const userId = (req as any).user.userId;

  try {
    // Basic validation & insertion
    await pool.query('INSERT INTO bids (product_id, user_id, amount) VALUES ($1, $2, $3)', [id, userId, amount]);
    res.status(201).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing bid' });
  }
});

// Buy Now
router.post('/:id/buy', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Update product status to sold
    await pool.query('UPDATE products SET status = $1 WHERE product_id = $2', ['sold', id]);
    res.json({ message: 'Product purchased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error purchasing product' });
  }
});

export default router;
