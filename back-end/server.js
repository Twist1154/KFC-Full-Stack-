import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Setup PostgreSQL connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:password@localhost:5433/kfc',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cart storage with user session support
const carts = new Map();

// Helper function to get or create cart
const getCart = (sessionId) => {
  if (!carts.has(sessionId)) {
    carts.set(sessionId, { items: [], total: 0 });
  }
  return carts.get(sessionId);
};

// Fetch menu items
app.get('/api/menu', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.menu ORDER BY item_id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Voice command processing and cart management
app.post('/api/orders', async (req, res) => {
  const { transcript, sessionId } = req.body;
  const command = transcript.toLowerCase();
  const cart = getCart(sessionId);

  try {
    // Fetch menu items for matching
    const menuItems = await pool.query('SELECT * FROM public.menu');
    const foundItems = [];

    // Process checkout command
    if (command.includes('checkout') || command.includes('place order')) {
      if (cart.items.length === 0) {
        return res.json({ success: false, message: 'Your cart is empty' });
      }

      const orderResult = await pool.query(
        'INSERT INTO orders (total, status) VALUES ($1, $2) RETURNING order_id',
        [cart.total, 'pending']
      );
      
      const orderId = orderResult.rows[0].order_id;

      // Add items to order_items table
      for (const item of cart.items) {
        await pool.query(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.id, item.quantity, item.price]
        );
      }

      // Clear cart after successful order
      cart.items = [];
      cart.total = 0;

      return res.json({
        success: true,
        message: 'Order placed successfully',
        orderId
      });
    }

    // Process add to cart commands
    menuItems.rows.forEach((menuItem) => {
      if (command.includes(menuItem.item_name.toLowerCase())) {
        foundItems.push({
          id: menuItem.item_id,
          name: menuItem.item_name,
          price: menuItem.estimated_price,
          quantity: 1
        });
      }
    });

    if (foundItems.length > 0) {
      cart.items.push(...foundItems);
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      res.json({
        success: true,
        cart,
        addedItems: foundItems,
        message: `Added ${foundItems.length} item(s) to cart`
      });
    } else {
      res.json({
        success: false,
        cart,
        message: 'No menu items found in your request'
      });
    }
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Get cart contents
app.get('/api/cart/:sessionId', (req, res) => {
  const cart = getCart(req.params.sessionId);
  res.json({ cart });
});

// Remove item from cart
app.delete('/api/cart/:sessionId/items/:itemId', (req, res) => {
  const cart = getCart(req.params.sessionId);
  const itemId = parseInt(req.params.itemId);
  
  cart.items = cart.items.filter(item => item.id !== itemId);
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({ 
    success: true, 
    cart,
    message: 'Item removed from cart'
  });
});

// Clear cart
app.delete('/api/cart/:sessionId', (req, res) => {
  const cart = getCart(req.params.sessionId);
  cart.items = [];
  cart.total = 0;
  
  res.json({ 
    success: true,
    message: 'Cart cleared successfully'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});