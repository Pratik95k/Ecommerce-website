const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'novastore.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize Tables
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 50,
      rating REAL DEFAULT 5.0,
      reviews INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      price_at_purchase REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if users already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial users...');
    const insertUser = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);

    const adminHash = bcrypt.hashSync('Admin@12345', 10);
    const customerHash = bcrypt.hashSync('Customer@12345', 10);

    insertUser.run('Store Administrator', 'admin@novastore.com', adminHash, 'admin');
    insertUser.run('Alex Johnson', 'customer@novastore.com', customerHash, 'customer');
    console.log('Users seeded successfully: admin@novastore.com and customer@novastore.com');
  }

  // Check if products already seeded
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    console.log('Seeding initial products...');
    const insertProduct = db.prepare(`
      INSERT INTO products (name, category, price, stock, rating, reviews, image, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialProducts = [
      {
        name: "Wireless Noise-Canceling Headphones",
        category: "Electronics",
        price: 199.99,
        stock: 35,
        rating: 4.8,
        reviews: 142,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        description: "Premium over-ear headphones with active noise cancellation and 30h battery life."
      },
      {
        name: "Designer Denim Jacket",
        category: "Fashion",
        price: 89.50,
        stock: 18,
        rating: 4.5,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
        description: "Classic vintage denim jacket made from 100% organic durable cotton."
      },
      {
        name: "Ergonomic Performance Running Shoes",
        category: "Shoes",
        price: 120.00,
        stock: 24,
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        description: "Lightweight breathable mesh sneakers designed for maximum comfort and speed."
      },
      {
        name: "Luxury Chronograph Wristwatch",
        category: "Watches",
        price: 249.99,
        stock: 8, // Low stock demo!
        rating: 4.9,
        reviews: 74,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        description: "Water-resistant stainless steel analog watch with genuine leather strap."
      },
      {
        name: "Minimalist Ceramic Table Lamp",
        category: "Home",
        price: 59.99,
        stock: 42,
        rating: 4.6,
        reviews: 63,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
        description: "Warm ambient LED lamp with sleek ceramic base for modern living rooms."
      },
      {
        name: "Polarized UV400 Classic Sunglasses",
        category: "Accessories",
        price: 45.00,
        stock: 55,
        rating: 4.4,
        reviews: 95,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
        description: "Glare-reducing polarized lenses with anti-scratch protective coating."
      },
      {
        name: "Smart Fitness & Health Tracker Watch",
        category: "Watches",
        price: 129.99,
        stock: 15,
        rating: 4.7,
        reviews: 184,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
        description: "Heart rate monitor, step counter, sleep tracker, and AMOLED HD touchscreen."
      },
      {
        name: "Genuine Leather Crossbody Shoulder Bag",
        category: "Accessories",
        price: 110.00,
        stock: 12,
        rating: 4.8,
        reviews: 118,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
        description: "Handcrafted Italian leather shoulder bag with spacious organized compartments."
      }
    ];

    for (const p of initialProducts) {
      insertProduct.run(p.name, p.category, p.price, p.stock, p.rating, p.reviews, p.image, p.description);
    }
    console.log('Products seeded successfully.');
  }

  // Check if orders already seeded
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (orderCount === 0) {
    console.log('Seeding initial demo orders...');
    const customer = db.prepare('SELECT id FROM users WHERE email = ?').get('customer@novastore.com');
    const customerId = customer ? customer.id : null;

    // Order 1: Shipped
    const order1 = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, payment_method, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'shipped', datetime('now', '-2 days'))
    `).run(customerId, 'Alex Johnson', 'customer@novastore.com', '742 Evergreen Terrace, Springfield, OR', 'card', 319.99);

    db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price_at_purchase, quantity)
      VALUES (?, ?, ?, ?, ?)
    `).run(order1.lastInsertRowid, 1, 'Wireless Noise-Canceling Headphones', 199.99, 1);

    db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price_at_purchase, quantity)
      VALUES (?, ?, ?, ?, ?)
    `).run(order1.lastInsertRowid, 3, 'Ergonomic Performance Running Shoes', 120.00, 1);

    // Order 2: Delivered
    const order2 = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, payment_method, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'delivered', datetime('now', '-5 days'))
    `).run(customerId, 'Alex Johnson', 'customer@novastore.com', '742 Evergreen Terrace, Springfield, OR', 'paypal', 89.50);

    db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price_at_purchase, quantity)
      VALUES (?, ?, ?, ?, ?)
    `).run(order2.lastInsertRowid, 2, 'Designer Denim Jacket', 89.50, 1);

    // Order 3: Processing (Guest customer)
    const order3 = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, payment_method, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'processing', datetime('now', '-3 hours'))
    `).run(null, 'Sarah Connor', 'sarah.c@example.com', '104 Tech Boulevard, San Francisco, CA', 'card', 249.99);

    db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price_at_purchase, quantity)
      VALUES (?, ?, ?, ?, ?)
    `).run(order3.lastInsertRowid, 4, 'Luxury Chronograph Wristwatch', 249.99, 1);

    console.log('Demo orders seeded successfully.');
  }

  // Seed sample contact message
  const msgCount = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
  if (msgCount === 0) {
    db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?)
    `).run('Morgan Riley', 'morgan@example.com', 'Wholesale inquiry', 'Hi NovaStore team, do you offer corporate bulk orders on headphones?', 'unread');
  }
}

// Initialize on load
initDatabase();

module.exports = db;
