const express = require('express');
const cors = require('cors');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'novastore_jwt_secret_key_2026_super_secure';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ==========================================
// AUTHENTICATION & RBAC MIDDLEWARE
// ==========================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token. Please sign in again.' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
    }
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    else req.user = null;
    next();
  });
}

// Generate JWT Helper
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (?, ?, ?, 'customer')
    `).run(fullName.trim(), normalizedEmail, passwordHash);

    const newUser = {
      id: Number(result.lastInsertRowid),
      full_name: fullName.trim(),
      email: normalizedEmail,
      role: 'customer'
    };

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Registration successful! Welcome to NovaStore.',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error while creating account.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    }
  });
});

// ==========================================
// PRODUCTS ROUTES (Public + Admin CRUD)
// ==========================================

// Get All Products (with optional category and search filters)
app.get('/api/products', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY id DESC';
    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// Get Single Product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// Admin: Add New Product
app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const { name, category, price, stock, image, description } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'Product name, category, and price are required.' });
    }

    const defaultImg = image && image.trim() !== '' 
      ? image.trim() 
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

    const result = db.prepare(`
      INSERT INTO products (name, category, price, stock, rating, reviews, image, description)
      VALUES (?, ?, ?, ?, 5.0, 1, ?, ?)
    `).run(
      name.trim(),
      category.trim(),
      parseFloat(price),
      parseInt(stock) || 20,
      defaultImg,
      description ? description.trim() : ''
    );

    const createdProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Product added successfully!', product: createdProduct });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Admin: Update Product
app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const productId = req.params.id;
    const { name, category, price, stock, image, description } = req.body;

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.prepare(`
      UPDATE products
      SET name = ?, category = ?, price = ?, stock = ?, image = ?, description = ?
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : existing.name,
      category !== undefined ? category.trim() : existing.category,
      price !== undefined ? parseFloat(price) : existing.price,
      stock !== undefined ? parseInt(stock) : existing.stock,
      image !== undefined ? image.trim() : existing.image,
      description !== undefined ? description.trim() : existing.description,
      productId
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    res.json({ message: 'Product updated successfully!', product: updated });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Admin: Delete Product
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const productId = req.params.id;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(productId);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// ==========================================
// ORDERS & CHECKOUT ROUTES
// ==========================================

// Place Order (Guest or Logged In)
app.post('/api/orders', optionalAuth, (req, res) => {
  try {
    const { customerName, customerEmail, shippingAddress, paymentMethod, items } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !paymentMethod || !items || !items.length) {
      return res.status(400).json({ error: 'Please provide all shipping details and at least one item.' });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    // Verify stock and calculate real total from database prices
    for (const item of items) {
      const p = db.prepare('SELECT * FROM products WHERE id = ?').get(item.id);
      if (!p) {
        return res.status(400).json({ error: `Product ID #${item.id} is no longer available.` });
      }
      if (p.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for "${p.name}". Only ${p.stock} remaining.` });
      }

      const itemTotal = p.price * item.quantity;
      calculatedTotal += itemTotal;
      validatedItems.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: item.quantity
      });
    }

    const userId = req.user ? req.user.id : null;

    // Execute Order insertion inside transaction
    db.exec('BEGIN TRANSACTION');
    try {
      const orderInsert = db.prepare(`
        INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, payment_method, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, 'processing')
      `).run(userId, customerName.trim(), customerEmail.trim(), shippingAddress.trim(), paymentMethod, calculatedTotal);

      const orderId = Number(orderInsert.lastInsertRowid);

      const itemInsert = db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, price_at_purchase, quantity)
        VALUES (?, ?, ?, ?, ?)
      `);

      const stockUpdate = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      for (const vItem of validatedItems) {
        itemInsert.run(orderId, vItem.productId, vItem.name, vItem.price, vItem.quantity);
        stockUpdate.run(vItem.quantity, vItem.productId);
      }

      db.exec('COMMIT');

      res.status(201).json({
        message: 'Order placed successfully! Thank you for shopping with NovaStore.',
        orderId,
        totalAmount: calculatedTotal,
        status: 'processing'
      });
    } catch (txErr) {
      db.exec('ROLLBACK');
      throw txErr;
    }
  } catch (err) {
    console.error('Order checkout error:', err);
    res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// Customer: Get My Orders
app.get('/api/orders/my', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC
    `).all(req.user.id);

    const getItems = db.prepare(`
      SELECT oi.*, p.image 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `);

    const result = orders.map(order => {
      const items = getItems.all(order.id);
      return {
        ...order,
        items
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to load order history.' });
  }
});

// Admin: Get All Orders
app.get('/api/orders', requireAdmin, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
    const getItems = db.prepare(`
      SELECT oi.*, p.image 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `);

    const result = orders.map(order => {
      const items = getItems.all(order.id);
      return {
        ...order,
        items
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to load store orders.' });
  }
});

// Admin: Update Order Status
app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

    res.json({ message: 'Order status updated successfully.', order: updated });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// ==========================================
// ADMIN ANALYTICS ROUTES
// ==========================================
app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  try {
    // 1. Total Revenue
    const revenueRow = db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as totalRevenue 
      FROM orders 
      WHERE status != 'cancelled'
    `).get();

    // 2. Total Orders
    const ordersRow = db.prepare('SELECT COUNT(*) as totalOrders FROM orders').get();

    // 3. Total Customers
    const customersRow = db.prepare("SELECT COUNT(*) as totalCustomers FROM users WHERE role = 'customer'").get();

    // 4. Low stock products count & list (< 10)
    const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock <= 10').get().count;
    const lowStockItems = db.prepare('SELECT id, name, category, price, stock, image FROM products WHERE stock <= 10 ORDER BY stock ASC').all();

    // 5. Category breakdown
    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count, ROUND(SUM(price), 2) as totalValue
      FROM products
      GROUP BY category
    `).all();

    // 6. Recent 5 Orders
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 5').all();

    // 7. Orders status distribution
    const statusStats = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `).all();

    res.json({
      totalRevenue: revenueRow.totalRevenue,
      totalOrders: ordersRow.totalOrders,
      totalCustomers: customersRow.totalCustomers,
      lowStockCount,
      lowStockItems,
      categoryStats,
      recentOrders,
      statusStats
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to compute store analytics.' });
  }
});

// ==========================================
// CONTACT / INQUIRY MESSAGES
// ==========================================
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), email.trim(), subject.trim(), message.trim());

    res.json({ message: 'Thank you! Your message has been received by our support team.' });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Admin: View Contact Messages
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC').all();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 NovaStore Backend & API Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Admin Account: admin@novastore.com | Pass: Admin@12345`);
  console.log(`👤 Customer Account: customer@novastore.com | Pass: Customer@12345`);
  console.log(`=======================================================`);
});
