# 🛍️ NovaStore — Full-Stack E-Commerce Platform

NovaStore is a modern, responsive, full-stack e-commerce web application with embedded SQLite persistence, secure JWT authentication with Role-Based Access Control (RBAC), customer order tracking, and an executive administration dashboard.

---

## ✨ Features

### 🛒 Customer Storefront
- **Dynamic Product Catalog**: Live stock updates loaded directly from the database with category filters and real-time keyword search.
- **Persistent Shopping Cart**: In-memory and `localStorage` cart state with stock validation and smooth offcanvas drawer.
- **Transactional Checkout**: Server-validated order placement that decrements inventory and persists order items.
- **Mobile-Responsive Design**: Touch-friendly navigation, horizontal swipeable category chips, and mobile header controls.

### 👤 Customer Portal ("My Orders")
- **Order History**: Itemized past purchases, pricing breakdowns, and shipping details.
- **Visual 4-Step Order Tracker**: Real-time progress tracker (`Order Placed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- **Profile Summary**: Quick user statistics including total orders and total spend.

### 🛡️ Administrator Hub ("NovaStore Admin")
- **Real-Time KPIs**: Total Gross Revenue, Processed Orders count, Registered Customers, and Low Stock Alerts.
- **Interactive Analytics Charts**: Order status volume distribution and inventory category breakdown powered by **Chart.js**.
- **Catalog Management (Full CRUD)**: Add new products with image preview, live in-place editing, restock adjustments, and item deletion.
- **Order Fulfillment Manager**: Instant order status transitions (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Customer Inquiries Inbox**: Review messages submitted through the contact form.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla JavaScript (ES6+), Bootstrap 5.3, Bootstrap Icons, Chart.js, Custom CSS |
| **Backend** | Node.js, Express.js, CORS, JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Database** | Embedded SQLite (Node.js built-in `node:sqlite`), WAL mode, foreign keys, auto-migration |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Pratik95k/Ecommerce-website.git
cd Ecommerce-website
npm install
```

### 2. Run the Application
```bash
# Start server in production mode
npm start

# Or run with auto-reload for development
npm run dev
```

Visit the store in your browser at:
👉 **`http://localhost:3000`**

---

## 🔑 Demo Accounts

Use the **1-Click Demo Login** chips in the Sign-In modal or log in manually:

| Account | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@novastore.com` | `Admin@12345` | Full Admin Hub, Catalog CRUD, Order Management & Charts |
| **Customer** | `customer@novastore.com` | `Customer@12345` | Storefront Shopping, Cart, Order History & Delivery Tracker |

---

## 📁 Project Structure

```
├── data/
│   └── novastore.db          # Embedded SQLite database (auto-generated)
├── db.js                     # SQLite schema definition, relations & auto-seeding
├── server.js                 # Express server with REST APIs & JWT authentication
├── index.html                # Responsive storefront & dashboard layouts
├── script.js                 # Client-side SPA logic, cart & API bindings
├── style.css                 # Custom CSS design system, responsive adjustments
├── package.json              # Project scripts & dependencies
└── README.md                 # Project documentation
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
