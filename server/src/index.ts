import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import bidsRoutes from './routes/bids.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/bids', bidsRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send_message', (data) => {
    // Save to DB and emit to receiver
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Marketplace API is running');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
