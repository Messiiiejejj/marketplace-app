import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Get All Products
router.get('/', async (req, res) => {
  try {
    const productsResult = await pool.query('SELECT * FROM products');
    res.json(productsResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Upload Product
router.post('/upload', async (req, res) => {
  const { businessId, title, description, price, type, fullAddress, publicLocation, auctionData, phoneNumber, phonePrivate } = req.body;


  try {
    const productResult = await pool.query(
      'INSERT INTO products (business_id, title, description, price, type, address, public_location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING product_id',
      [businessId, title, description, price, type, fullAddress, publicLocation]
    );

    const productId = productResult.rows[0].product_id;

    if (type === 'auction') {
      await pool.query(
        'INSERT INTO auctions (product_id, start_price, buy_now_price, end_time) VALUES ($1, $2, $3, $4)',
        [productId, auctionData.startPrice, auctionData.buyNowPrice, auctionData.endTime]
      );
    }

    res.status(201).json({ message: 'Product uploaded successfully', productId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading product' });
  }
});

// Get Product Details
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];
  let userId: number | null = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      userId = decoded.userId;
    } catch (e) {
      // Ignore token errors for anonymous users
    }
  }

  try {
    const productResult = await pool.query('SELECT p.*, b.user_id as owner_id FROM products p JOIN businesses b ON p.business_id = b.business_id WHERE p.product_id = $1', [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];
    
    // Mask address if not owner
    if (userId !== product.owner_id) {
      product.address = null; // or mask it
    }

    let auction = null;
    if (product.type === 'auction') {
      const auctionResult = await pool.query('SELECT * FROM auctions WHERE product_id = $1', [id]);
      auction = auctionResult.rows[0];
    }

    res.json({ ...product, auction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

export default router;
