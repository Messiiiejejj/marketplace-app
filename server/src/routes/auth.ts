import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.ts';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, phone, password, role, name, location } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // In a real app, I would need the verification_code column here.
    // Assuming it exists, or handling it differently.
    const userResult = await pool.query(
      'INSERT INTO users (email, phone, password_hash, role, verification_code) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
      [email, phone, hashedPassword, role, verificationCode]
    );

    const userId = userResult.rows[0].user_id;

    if (role === 'business') {
      await pool.query(
        'INSERT INTO businesses (user_id, name, location) VALUES ($1, $2, $3)',
        [userId, name, location]
      );
    }

    res.status(201).json({ message: 'User signed up successfully. Please verify your email.', verificationCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during sign-up' });
  }
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND verification_code = $2',
      [email, code]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }

    await pool.query(
      'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = $1',
      [email]
    );

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during verification' });
  }
});

router.post('/signin', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or phone

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $1',
      [identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during sign-in' });
  }
});

export default router;
