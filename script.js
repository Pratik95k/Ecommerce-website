/**
 * NovaStore E-Commerce Application Frontend
 * Complete Dual-Mode Architecture:
 * - Server Mode: Communicates with Express + SQLite backend when running locally.
 * - Static Fallback Mode: Seamless in-browser database (localStorage) when hosted on GitHub Pages.
 */

// ==========================================
// 1. STATIC DATABASE ENGINE (FOR GITHUB PAGES)
// ==========================================
const DEFAULT_PRODUCTS = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: "Luxury Chronograph Wristwatch",
    category: "Watches",
    price: 249.99,
    stock: 8,
    rating: 4.9,
    reviews: 74,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description: "Water-resistant stainless steel analog watch with genuine leather strap."
  },
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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

const DEFAULT_USERS = [
  {
    id: 1,
    fullName: "Store Administrator",
    email: "admin@novastore.com",
    password: "Admin@12345",
    role: "admin"
  },
  {
    id: 2,
    fullName: "Alex Johnson",
    email: "customer@novastore.com",
    password: "Customer@12345",
    role: "customer"
  }
];

const DEFAULT_ORDERS = [
  {
    id: 101,
    userId: 2,
    customer_name: "Alex Johnson",
    customer_email: "customer@novastore.com",
    shipping_address: "742 Evergreen Terrace, Springfield, OR",
    payment_method: "card",
    total_amount: 319.99,
    status: "shipped",
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    items: [
      { product_id: 1, product_name: "Wireless Noise-Canceling Headphones", price_at_purchase: 199.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
      { product_id: 3, product_name: "Ergonomic Performance Running Shoes", price_at_purchase: 120.00, quantity: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 102,
    userId: 2,
    customer_name: "Alex Johnson",
    customer_email: "customer@novastore.com",
    shipping_address: "742 Evergreen Terrace, Springfield, OR",
    payment_method: "paypal",
    total_amount: 89.50,
    status: "delivered",
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    items: [
      { product_id: 2, product_name: "Designer Denim Jacket", price_at_purchase: 89.50, quantity: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 103,
    userId: null,
    customer_name: "Sarah Connor",
    customer_email: "sarah.c@example.com",
    shipping_address: "104 Tech Boulevard, San Francisco, CA",
    payment_method: "card",
    total_amount: 249.99,
    status: "processing",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    items: [
      { product_id: 4, product_name: "Luxury Chronograph Wristwatch", price_at_purchase: 249.99, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" }
    ]
  }
];

class ClientDB {
  static init() {
    if (!localStorage.getItem('novastore_db_products')) {
      localStorage.setItem('novastore_db_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem('novastore_db_users')) {
      localStorage.setItem('novastore_db_users', JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem('novastore_db_orders')) {
      localStorage.setItem('novastore_db_orders', JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem('novastore_db_messages')) {
      localStorage.setItem('novastore_db_messages', JSON.stringify([
        { id: 1, name: "Morgan Riley", email: "morgan@example.com", subject: "Wholesale inquiry", message: "Hi NovaStore team, do you offer corporate bulk orders on headphones?", created_at: new Date().toISOString() }
      ]));
    }
  }

  static getProducts() {
    this.init();
    return JSON.parse(localStorage.getItem('novastore_db_products') || '[]');
  }

  static saveProducts(prods) {
    localStorage.setItem('novastore_db_products', JSON.stringify(prods));
  }

  static getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem('novastore_db_users') || '[]');
  }

  static saveUsers(users) {
    localStorage.setItem('novastore_db_users', JSON.stringify(users));
  }

  static getOrders() {
    this.init();
    return JSON.parse(localStorage.getItem('novastore_db_orders') || '[]');
  }

  static saveOrders(orders) {
    localStorage.setItem('novastore_db_orders', JSON.stringify(orders));
  }

  static getMessages() {
    this.init();
    return JSON.parse(localStorage.getItem('novastore_db_messages') || '[]');
  }

  static saveMessages(msgs) {
    localStorage.setItem('novastore_db_messages', JSON.stringify(msgs));
  }
}

// Initialize Client DB on load
ClientDB.init();

// ==========================================
// 2. UNIFIED API SERVICE (DUAL MODE)
// ==========================================
let isServerOnline = false;

const api = {
  async init() {
    if (window.location.protocol === 'file:' || window.location.hostname.includes('github.io')) {
      isServerOnline = false;
      this.updateStatusBadge();
      return;
    }
    try {
      const res = await fetch('/api/products', { signal: AbortSignal.timeout(2000) });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        isServerOnline = true;
      } else {
        isServerOnline = false;
      }
    } catch {
      isServerOnline = false;
    }
    this.updateStatusBadge();
  },

  updateStatusBadge() {
    const badge = document.getElementById("dbStatusBadge");
    if (badge) {
      if (isServerOnline) {
        badge.className = "badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small";
        badge.innerHTML = `<i class="bi bi-database-check me-1"></i> SQLite Server Connected`;
      } else {
        badge.className = "badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill small";
        badge.innerHTML = `<i class="bi bi-cloud-check me-1"></i> GitHub Pages Storage Active`;
      }
    }
  },

  async login(email, password) {
    if (isServerOnline) {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      return data;
    } else {
      const users = ClientDB.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
      if (!user) throw new Error('Invalid email or password');
      const token = 'static_token_' + btoa(user.email);
      return {
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
      };
    }
  },

  async register(fullName, email, password) {
    if (isServerOnline) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } else {
      const users = ClientDB.getUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: 'customer'
      };
      users.push(newUser);
      ClientDB.saveUsers(users);
      const token = 'static_token_' + btoa(newUser.email);
      return {
        token,
        user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role }
      };
    }
  },

  async getMe(token) {
    if (isServerOnline) {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Session invalid');
      return await res.json();
    } else {
      if (!token.startsWith('static_token_')) throw new Error('Session invalid');
      const email = atob(token.replace('static_token_', ''));
      const users = ClientDB.getUsers();
      const user = users.find(u => u.email === email);
      if (!user) throw new Error('User not found');
      return { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } };
    }
  },

  async getProducts() {
    if (isServerOnline) {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load products');
      return await res.json();
    } else {
      return ClientDB.getProducts();
    }
  },

  async addProduct(productData, token) {
    if (isServerOnline) {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');
      return data;
    } else {
      const prods = ClientDB.getProducts();
      const newProd = {
        id: Date.now(),
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 20,
        rating: 5.0,
        reviews: 1,
        image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        description: productData.description || ''
      };
      prods.unshift(newProd);
      ClientDB.saveProducts(prods);
      return { product: newProd };
    }
  },

  async updateProduct(id, productData, token) {
    if (isServerOnline) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');
      return data;
    } else {
      const prods = ClientDB.getProducts();
      const idx = prods.findIndex(p => p.id == id);
      if (idx === -1) throw new Error('Product not found');
      prods[idx] = {
        ...prods[idx],
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        image: productData.image,
        description: productData.description
      };
      ClientDB.saveProducts(prods);
      return { product: prods[idx] };
    }
  },

  async deleteProduct(id, token) {
    if (isServerOnline) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return await res.json();
    } else {
      let prods = ClientDB.getProducts();
      prods = prods.filter(p => p.id != id);
      ClientDB.saveProducts(prods);
      return { success: true };
    }
  },

  async createOrder(orderPayload, token) {
    if (isServerOnline) {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      return data;
    } else {
      const prods = ClientDB.getProducts();
      let totalAmount = 0;
      const orderItems = [];

      for (const item of orderPayload.items) {
        const p = prods.find(pr => pr.id == item.id);
        if (!p) throw new Error(`Product not found`);
        if (p.stock < item.quantity) throw new Error(`Insufficient stock for "${p.name}". Only ${p.stock} left.`);
        p.stock -= item.quantity;
        totalAmount += p.price * item.quantity;
        orderItems.push({
          product_id: p.id,
          product_name: p.name,
          price_at_purchase: p.price,
          quantity: item.quantity,
          image: p.image
        });
      }
      ClientDB.saveProducts(prods);

      const orders = ClientDB.getOrders();
      const newOrder = {
        id: Math.floor(100 + Math.random() * 900),
        userId: currentUser ? currentUser.id : null,
        customer_name: orderPayload.customerName,
        customer_email: orderPayload.customerEmail,
        shipping_address: orderPayload.shippingAddress,
        payment_method: orderPayload.paymentMethod,
        total_amount: totalAmount,
        status: 'processing',
        created_at: new Date().toISOString(),
        items: orderItems
      };
      orders.unshift(newOrder);
      ClientDB.saveOrders(orders);

      return {
        orderId: newOrder.id,
        totalAmount,
        status: newOrder.status
      };
    }
  },

  async getMyOrders(token) {
    if (isServerOnline) {
      const res = await fetch('/api/orders/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load orders');
      return await res.json();
    } else {
      const orders = ClientDB.getOrders();
      if (!currentUser) return [];
      return orders.filter(o => o.userId == currentUser.id || o.customer_email.toLowerCase() === currentUser.email.toLowerCase());
    }
  },

  async getAllOrders(token) {
    if (isServerOnline) {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load orders');
      return await res.json();
    } else {
      return ClientDB.getOrders();
    }
  },

  async updateOrderStatus(id, status, token) {
    if (isServerOnline) {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return await res.json();
    } else {
      const orders = ClientDB.getOrders();
      const ord = orders.find(o => o.id == id);
      if (ord) ord.status = status;
      ClientDB.saveOrders(orders);
      return { order: ord };
    }
  },

  async getAnalytics(token) {
    if (isServerOnline) {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load analytics');
      return await res.json();
    } else {
      const orders = ClientDB.getOrders();
      const prods = ClientDB.getProducts();
      const users = ClientDB.getUsers();

      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);
      const totalOrders = orders.length;
      const totalCustomers = users.filter(u => u.role === 'customer').length;
      const lowStockItems = prods.filter(p => p.stock <= 10);
      const lowStockCount = lowStockItems.length;

      // Category breakdown
      const catMap = {};
      prods.forEach(p => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      const categoryStats = Object.keys(catMap).map(k => ({ category: k, count: catMap[k] }));

      // Status breakdown
      const statusMap = {};
      orders.forEach(o => {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1;
      });
      const statusStats = Object.keys(statusMap).map(s => ({ status: s, count: statusMap[s] }));

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockCount,
        lowStockItems,
        categoryStats,
        statusStats
      };
    }
  },

  async sendContact(data) {
    if (isServerOnline) {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } else {
      const msgs = ClientDB.getMessages();
      msgs.unshift({ id: Date.now(), ...data, created_at: new Date().toISOString() });
      ClientDB.saveMessages(msgs);
      return { message: 'Thank you! Your message has been received.' };
    }
  },

  async getMessages(token) {
    if (isServerOnline) {
      const res = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } else {
      return ClientDB.getMessages();
    }
  }
};

// ==========================================
// 3. APPLICATION STATE & DOM REFERENCES
// ==========================================
let currentUser = null;
let authToken = localStorage.getItem('novastore_token') || null;
let products = [];
let cart = JSON.parse(localStorage.getItem('novastore_cart') || '[]');
let activeCategory = "All";
let searchQuery = "";
let currentView = "storefront";

// Chart instances
let statusChartInstance = null;
let categoryChartInstance = null;

// DOM Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchResultAlert = document.getElementById("searchResultAlert");
const searchTermText = document.getElementById("searchTermText");
const clearSearchBtn = document.getElementById("clearSearchBtn");

// Cart Elements
const cartBadge = document.getElementById("cartBadge");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalItems = document.getElementById("cartTotalItems");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutSummaryItems = document.getElementById("checkoutSummaryItems");
const checkoutGrandTotal = document.getElementById("checkoutGrandTotal");
const checkoutForm = document.getElementById("checkoutForm");
const contactForm = document.getElementById("contactForm");

// Navbar Auth Elements
const navAuthBtn = document.getElementById("navAuthBtn");
const navUserDropdown = document.getElementById("navUserDropdown");
const navUserAvatar = document.getElementById("navUserAvatar");
const navUserName = document.getElementById("navUserName");
const navUserRole = document.getElementById("navUserRole");
const navUserEmail = document.getElementById("navUserEmail");
const navCustomerDashboardLink = document.getElementById("navCustomerDashboardLink");
const navAdminDashboardLink = document.getElementById("navAdminDashboardLink");
const menuAdminLink = document.getElementById("menuAdminLink");

// View Containers
const storefrontView = document.getElementById("storefrontView");
const customerDashboardView = document.getElementById("customerDashboardView");
const adminDashboardView = document.getElementById("adminDashboardView");

// ==========================================
// 4. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  setupCategoryFilters();
  setupSearch();
  setupCartActions();
  setupForms();
  setupNavScroll();
  updateCartUI();

  // Initialize and detect environment (Local Server vs GitHub Pages Static)
  await api.init();

  // Validate existing auth session token if present
  if (authToken) {
    await checkAuthSession();
  } else {
    updateNavAuthUI();
  }

  // Load products catalog
  await loadProducts();

  // Deep linking via URL hash
  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);
});

function handleHashNavigation() {
  const hash = window.location.hash;
  if (hash === '#my-account') {
    if (currentUser) showView('customerDashboard');
    else showAuthModal();
  } else if (hash === '#admin') {
    if (currentUser && currentUser.role === 'admin') showView('adminDashboard');
    else showAuthModal();
  }
}

// ==========================================
// 5. VIEW SWITCHER
// ==========================================
function showView(viewName) {
  currentView = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reset display
  storefrontView.classList.add('d-none');
  customerDashboardView.classList.add('d-none');
  adminDashboardView.classList.add('d-none');

  // Update active link highlights
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => link.classList.remove('active'));

  if (viewName === 'storefront') {
    storefrontView.classList.remove('d-none');
    window.location.hash = 'store';
    const homeLink = document.getElementById('navLinkHome');
    if (homeLink) homeLink.classList.add('active');
  } else if (viewName === 'customerDashboard') {
    if (!currentUser) {
      showToast('Please sign in to view your account dashboard.', 'bi-shield-exclamation');
      showAuthModal();
      storefrontView.classList.remove('d-none');
      return;
    }
    customerDashboardView.classList.remove('d-none');
    window.location.hash = 'my-account';
    const custLink = document.querySelector('#navCustomerDashboardLink .nav-link');
    if (custLink) custLink.classList.add('active');
    loadCustomerOrders();
  } else if (viewName === 'adminDashboard') {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access denied: Administrator privileges required.', 'bi-shield-slash-fill');
      showAuthModal();
      storefrontView.classList.remove('d-none');
      return;
    }
    adminDashboardView.classList.remove('d-none');
    window.location.hash = 'admin';
    const adminLink = document.querySelector('#navAdminDashboardLink .nav-link');
    if (adminLink) adminLink.classList.add('active');
    loadAdminAnalytics();
  }
}

// ==========================================
// 6. AUTHENTICATION SYSTEM
// ==========================================
async function checkAuthSession() {
  try {
    const data = await api.getMe(authToken);
    currentUser = data.user;
  } catch (err) {
    logout(false);
  } finally {
    updateNavAuthUI();
  }
}

function updateNavAuthUI() {
  const mobileUserContainer = document.getElementById("mobileUserContainer");
  const mobileDrawerAccountSection = document.getElementById("mobileDrawerAccountSection");

  if (currentUser) {
    if (navAuthBtn) navAuthBtn.classList.add('d-none');
    if (navUserDropdown) navUserDropdown.classList.remove('d-none');

    const firstChar = currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U';
    if (navUserAvatar) navUserAvatar.textContent = firstChar;
    if (navUserName) navUserName.textContent = currentUser.fullName;
    if (navUserRole) navUserRole.textContent = currentUser.role === 'admin' ? 'Administrator' : 'Customer';
    if (navUserEmail) navUserEmail.textContent = currentUser.email;

    if (navCustomerDashboardLink) navCustomerDashboardLink.style.display = 'block';

    if (currentUser.role === 'admin') {
      if (navAdminDashboardLink) navAdminDashboardLink.style.display = 'block';
      if (menuAdminLink) menuAdminLink.style.display = 'block';
    } else {
      if (navAdminDashboardLink) navAdminDashboardLink.style.display = 'none';
      if (menuAdminLink) menuAdminLink.style.display = 'none';
    }

    // Update Mobile Top Bar Icon
    if (mobileUserContainer) {
      mobileUserContainer.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-light border rounded-circle p-0 avatar-circle" style="width: 34px; height: 34px; font-size: 0.85rem;" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Account Menu">
            ${firstChar}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2 p-2" style="min-width: 210px;">
            <li class="dropdown-header small fw-semibold text-muted text-truncate">${currentUser.email}</li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item rounded-3 py-2 d-flex align-items-center" href="javascript:void(0)" onclick="showView('customerDashboard')"><i class="bi bi-bag-check me-2 text-primary"></i>My Orders</a></li>
            ${currentUser.role === 'admin' ? `<li><a class="dropdown-item rounded-3 py-2 d-flex align-items-center" href="javascript:void(0)" onclick="showView('adminDashboard')"><i class="bi bi-speedometer2 me-2 text-primary"></i>Admin Hub</a></li>` : ''}
            <li><a class="dropdown-item rounded-3 py-2 d-flex align-items-center" href="javascript:void(0)" onclick="showView('storefront')"><i class="bi bi-shop me-2 text-muted"></i>Storefront</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item rounded-3 py-2 text-danger d-flex align-items-center" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</button></li>
          </ul>
        </div>
      `;
    }

    // Update Mobile Drawer Account Section
    if (mobileDrawerAccountSection) {
      mobileDrawerAccountSection.innerHTML = `
        <div class="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border mb-2">
          <div class="d-flex align-items-center">
            <div class="avatar-circle me-2" style="width: 32px; height: 32px; font-size: 0.8rem;">${firstChar}</div>
            <div class="text-truncate" style="max-width: 140px;">
              <div class="fw-bold small lh-1 text-truncate">${currentUser.fullName}</div>
              <small class="text-muted" style="font-size: 0.7rem;">${currentUser.role === 'admin' ? 'Administrator' : 'Customer'}</small>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-danger rounded-pill px-2 py-1" onclick="logout()">Sign Out</button>
        </div>
      `;
    }

    // Update Customer Dashboard Header if rendered
    const custHeaderAvatar = document.getElementById("custHeaderAvatar");
    const custHeaderName = document.getElementById("custHeaderName");
    const custHeaderEmail = document.getElementById("custHeaderEmail");
    if (custHeaderAvatar) custHeaderAvatar.textContent = firstChar;
    if (custHeaderName) custHeaderName.textContent = `Welcome back, ${currentUser.fullName}!`;
    if (custHeaderEmail) custHeaderEmail.textContent = currentUser.email;

    // Prefill checkout form if available
    const checkoutName = document.getElementById("checkoutName");
    const checkoutEmail = document.getElementById("checkoutEmail");
    if (checkoutName && !checkoutName.value) checkoutName.value = currentUser.fullName;
    if (checkoutEmail && !checkoutEmail.value) checkoutEmail.value = currentUser.email;
  } else {
    if (navAuthBtn) navAuthBtn.classList.remove('d-none');
    if (navUserDropdown) navUserDropdown.classList.add('d-none');
    if (navCustomerDashboardLink) navCustomerDashboardLink.style.display = 'none';
    if (navAdminDashboardLink) navAdminDashboardLink.style.display = 'none';
    if (menuAdminLink) menuAdminLink.style.display = 'none';

    // Mobile Top Bar Icon when logged out
    if (mobileUserContainer) {
      mobileUserContainer.innerHTML = `
        <button class="btn btn-outline-primary btn-sm rounded-pill px-2 py-1" type="button" data-bs-toggle="modal" data-bs-target="#authModal" aria-label="Sign In">
          <i class="bi bi-person fs-5"></i>
        </button>
      `;
    }

    // Mobile Drawer Account Section when logged out
    if (mobileDrawerAccountSection) {
      mobileDrawerAccountSection.innerHTML = `
        <button class="btn btn-primary w-100 rounded-pill py-2 fw-semibold" type="button" data-bs-toggle="modal" data-bs-target="#authModal">
          <i class="bi bi-person me-1"></i> Sign In / Register
        </button>
      `;
    }
  }
}

function showAuthModal() {
  const modalEl = document.getElementById('authModal');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function quickFillLogin(email, password) {
  const loginTabBtn = document.getElementById('login-tab-btn');
  if (loginTabBtn) {
    const tab = bootstrap.Tab.getOrCreateInstance(loginTabBtn);
    tab.show();
  }
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = password;
  showAuthAlert('Demo credentials filled! Click "Sign In" to proceed.', 'alert-info');
}

function showAuthAlert(message, alertClass = 'alert-danger') {
  const alertEl = document.getElementById('authAlert');
  alertEl.className = `alert ${alertClass} small py-2`;
  alertEl.textContent = message;
  alertEl.classList.remove('d-none');
}

function clearAuthAlert() {
  const alertEl = document.getElementById('authAlert');
  alertEl.classList.add('d-none');
  alertEl.textContent = '';
}

async function handleLogin(email, password) {
  clearAuthAlert();
  const submitBtn = document.getElementById('loginSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Signing in...`;

  try {
    const data = await api.login(email, password);

    authToken = data.token;
    localStorage.setItem('novastore_token', authToken);
    currentUser = data.user;
    updateNavAuthUI();

    const modalEl = document.getElementById('authModal');
    bootstrap.Modal.getInstance(modalEl).hide();

    showToast(`Welcome back, ${currentUser.fullName}!`, 'bi-check-circle-fill');

    if (currentUser.role === 'admin') {
      showView('adminDashboard');
    }
  } catch (err) {
    showAuthAlert(err.message || 'Authentication failed. Please check credentials.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Sign In';
  }
}

async function handleRegister(fullName, email, password) {
  clearAuthAlert();
  const submitBtn = document.getElementById('registerSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Creating account...`;

  try {
    const data = await api.register(fullName, email, password);

    authToken = data.token;
    localStorage.setItem('novastore_token', authToken);
    currentUser = data.user;
    updateNavAuthUI();

    const modalEl = document.getElementById('authModal');
    bootstrap.Modal.getInstance(modalEl).hide();

    showToast(`Account created! Welcome, ${currentUser.fullName}!`, 'bi-stars');
  } catch (err) {
    showAuthAlert(err.message || 'Registration failed.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Create Account';
  }
}

function logout(showFeedback = true) {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('novastore_token');
  updateNavAuthUI();

  if (currentView !== 'storefront') {
    showView('storefront');
  }

  if (showFeedback) {
    showToast('Signed out successfully.', 'bi-box-arrow-right');
  }
}

// ==========================================
// 7. PRODUCT CATALOG & FILTERS
// ==========================================
async function loadProducts() {
  try {
    products = await api.getProducts();
    renderProducts();
  } catch (err) {
    console.error('Error loading products:', err);
    showToast('Failed to load products.', 'bi-exclamation-octagon');
  }
}

function renderProducts() {
  let filtered = products;

  if (activeCategory !== "All") {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query)) ||
      p.category.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search-heart text-muted fs-1 mb-3 d-block"></i>
        <h4 class="fw-semibold">No products found</h4>
        <p class="text-muted">Try adjusting your search query or selecting another category.</p>
        <button class="btn btn-outline-primary btn-sm rounded-pill mt-2" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(product => {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 10;

    let stockBadgeHtml = `<small class="text-success fw-semibold"><i class="bi bi-check-circle-fill me-1"></i>In Stock (${product.stock})</small>`;
    if (isOutOfStock) {
      stockBadgeHtml = `<small class="text-danger fw-semibold"><i class="bi bi-x-circle-fill me-1"></i>Out of Stock</small>`;
    } else if (isLowStock) {
      stockBadgeHtml = `<small class="text-warning-emphasis fw-bold"><i class="bi bi-exclamation-triangle-fill me-1"></i>Only ${product.stock} left!</small>`;
    }

    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card product-card">
          <div class="product-img-wrapper">
            <span class="badge-category">${product.category}</span>
            <img src="${product.image}" class="product-img" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'">
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-3">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="rating-stars">
                  ${renderStars(product.rating || 5.0)}
                  <span class="text-muted small ms-1">(${product.reviews || 0})</span>
                </div>
              </div>
              <h6 class="card-title fw-bold text-truncate mb-2" title="${product.name}">${product.name}</h6>
              <p class="card-text text-muted small mb-3 line-clamp-2">${product.description || ''}</p>
            </div>
            <div>
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="fs-5 fw-extrabold text-primary">$${Number(product.price).toFixed(2)}</span>
                ${stockBadgeHtml}
              </div>
              <button 
                class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-outline-primary'} w-100 rounded-pill fw-semibold add-to-cart-btn" 
                onclick="addToCart(${product.id})"
                ${isOutOfStock ? 'disabled' : ''}
              >
                <i class="bi bi-cart-plus me-1"></i> ${isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderStars(rating) {
  let starsHtml = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += `<i class="bi bi-star-fill"></i>`;
    } else if (i === fullStars + 1 && hasHalfStar) {
      starsHtml += `<i class="bi bi-star-half"></i>`;
    } else {
      starsHtml += `<i class="bi bi-star"></i>`;
    }
  }
  return starsHtml;
}

function setupCategoryFilters() {
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      const catName = card.getAttribute("data-category");
      filterProductsByCategory(catName);
    });
  });

  const filterBtns = document.querySelectorAll("#categoryFilterButtons .filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const catName = btn.getAttribute("data-filter");
      filterProductsByCategory(catName);
    });
  });
}

function filterProductsByCategory(categoryName) {
  activeCategory = categoryName;

  const filterBtns = document.querySelectorAll("#categoryFilterButtons .filter-btn");
  filterBtns.forEach(btn => {
    if (btn.getAttribute("data-filter") === categoryName) {
      btn.classList.add("btn-primary", "active");
      btn.classList.remove("btn-outline-secondary");
    } else {
      btn.classList.remove("btn-primary", "active");
      btn.classList.add("btn-outline-secondary");
    }
  });

  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach(card => {
    if (card.getAttribute("data-category") === categoryName) {
      card.classList.add("active-category");
    } else {
      card.classList.remove("active-category");
    }
  });

  renderProducts();
}

function resetFilters() {
  searchQuery = "";
  activeCategory = "All";
  searchInput.value = "";
  searchResultAlert.classList.add("d-none");
  filterProductsByCategory("All");
}

function setupSearch() {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim() !== "") {
      searchResultAlert.classList.remove("d-none");
      searchTermText.textContent = searchQuery;
    } else {
      searchResultAlert.classList.add("d-none");
    }
    renderProducts();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchResultAlert.classList.add("d-none");
    renderProducts();
  });
}

// ==========================================
// 8. CART & ORDER MANAGEMENT
// ==========================================
function addToCart(productId) {
  const targetProduct = products.find(p => p.id === productId);
  if (!targetProduct) return;

  if (targetProduct.stock <= 0) {
    showToast(`Sorry, "${targetProduct.name}" is currently out of stock.`, 'bi-exclamation-triangle');
    return;
  }

  const existingItem = cart.find(item => item.product.id === productId);
  if (existingItem) {
    if (existingItem.quantity >= targetProduct.stock) {
      showToast(`Cannot add more. Only ${targetProduct.stock} units available in stock.`, 'bi-info-circle');
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({ product: targetProduct, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${targetProduct.name}" to cart!`, "bi-bag-plus-fill");
}

function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  if (itemIndex > -1) {
    const targetProduct = products.find(p => p.id === productId);
    const newQty = cart[itemIndex].quantity + delta;

    if (delta > 0 && targetProduct && newQty > targetProduct.stock) {
      showToast(`Maximum stock limit reached (${targetProduct.stock} available).`, 'bi-info-circle');
      return;
    }

    if (newQty <= 0) {
      const removedName = cart[itemIndex].product.name;
      cart.splice(itemIndex, 1);
      showToast(`Removed "${removedName}" from cart.`, "bi-trash-fill");
    } else {
      cart[itemIndex].quantity = newQty;
    }
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  if (itemIndex > -1) {
    const removedName = cart[itemIndex].product.name;
    cart.splice(itemIndex, 1);
    saveCart();
    updateCartUI();
    showToast(`Removed "${removedName}" from cart.`, "bi-trash-fill");
  }
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCart();
  updateCartUI();
  showToast("Shopping cart cleared.", "bi-cart-x-fill");
}

function saveCart() {
  localStorage.setItem('novastore_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (cartBadge) cartBadge.textContent = totalCount;
  const mobileCartBadge = document.getElementById("mobileCartBadge");
  if (mobileCartBadge) mobileCartBadge.textContent = totalCount;

  if (cartTotalItems) cartTotalItems.textContent = totalCount;
  if (cartTotalPrice) cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  if (checkoutGrandTotal) checkoutGrandTotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  if (clearCartBtn) clearCartBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-5 my-auto">
        <i class="bi bi-cart-x text-muted display-4 mb-3 d-block"></i>
        <h6 class="fw-semibold">Your cart is empty</h6>
        <p class="text-muted small">Looks like you haven't added any products yet.</p>
        <button class="btn btn-outline-primary btn-sm rounded-pill mt-2" data-bs-dismiss="offcanvas" onclick="location.href='#products'">Start Shopping</button>
      </div>
    `;
    checkoutSummaryItems.innerHTML = `<p class="text-muted small">No items in cart.</p>`;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="d-flex align-items-center justify-content-between p-2 mb-2 border rounded-3 bg-white">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img me-3">
        <div class="flex-grow-1 me-2 overflow-hidden">
          <h6 class="fw-semibold text-truncate mb-1" style="font-size: 0.9rem;" title="${item.product.name}">${item.product.name}</h6>
          <div class="text-primary fw-bold small">$${Number(item.product.price).toFixed(2)}</div>
        </div>
        <div class="d-flex align-items-center gap-1 me-2">
          <button class="btn btn-sm btn-light border quantity-btn" onclick="updateQuantity(${item.product.id}, -1)" aria-label="Decrease quantity">-</button>
          <span class="px-2 fw-semibold small">${item.quantity}</span>
          <button class="btn btn-sm btn-light border quantity-btn" onclick="updateQuantity(${item.product.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn-link text-danger p-0 ms-1" onclick="removeFromCart(${item.product.id})" aria-label="Remove product">
          <i class="bi bi-trash fs-5"></i>
        </button>
      </div>
    `).join('');

    checkoutSummaryItems.innerHTML = cart.map(item => `
      <div class="d-flex justify-content-between align-items-center mb-2 small">
        <span class="text-truncate me-2" style="max-width: 180px;">${item.product.name} (x${item.quantity})</span>
        <span class="fw-semibold">$${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }
}

function setupCartActions() {
  clearCartBtn.addEventListener("click", clearCart);
}

// ==========================================
// 9. CUSTOMER DASHBOARD: ORDERS & TRACKING
// ==========================================
async function loadCustomerOrders() {
  if (!authToken) return;

  const container = document.getElementById("customerOrdersContainer");
  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted small mt-2">Loading orders...</p>
    </div>
  `;

  try {
    const orders = await api.getMyOrders(authToken);

    const totalOrdersCount = orders.length;
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    document.getElementById("custStatsTotalOrders").textContent = totalOrdersCount;
    document.getElementById("custStatsTotalSpent").textContent = `$${totalSpent.toFixed(2)}`;

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="admin-card p-5 text-center">
          <i class="bi bi-bag-x text-muted display-4 mb-3 d-block"></i>
          <h5 class="fw-bold">No orders placed yet</h5>
          <p class="text-muted small">You haven't placed any orders yet. Discover our latest items!</p>
          <button class="btn btn-primary rounded-pill px-4 mt-2" onclick="showView('storefront')">
            Start Shopping Now
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const status = (order.status || 'processing').toLowerCase();
      let s1 = "completed", s2 = "", s3 = "", s4 = "";

      if (status === "processing") {
        s2 = "active";
      } else if (status === "shipped") {
        s2 = "completed";
        s3 = "active";
      } else if (status === "delivered") {
        s2 = "completed";
        s3 = "completed";
        s4 = "completed";
      } else if (status === "cancelled") {
        s1 = "active";
      }

      return `
        <div class="admin-card p-4 mb-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 pb-3 border-bottom">
            <div>
              <span class="fw-bold fs-5 text-dark me-2">Order #${order.id}</span>
              <span class="text-muted small me-3"><i class="bi bi-calendar3 me-1"></i>${orderDate}</span>
              <span class="status-badge ${order.status}">${order.status}</span>
            </div>
            <div class="text-md-end">
              <span class="text-muted small">Total Paid: </span>
              <span class="fw-extrabold text-primary fs-5">$${Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <!-- Stepper Delivery Progress Tracker -->
          <div class="order-stepper">
            <div class="step-item ${s1}">
              <div class="step-icon"><i class="bi bi-check-lg"></i></div>
              <div class="step-label">Order Placed</div>
            </div>
            <div class="step-item ${s2}">
              <div class="step-icon"><i class="bi bi-gear-fill"></i></div>
              <div class="step-label">Processing</div>
            </div>
            <div class="step-item ${s3}">
              <div class="step-icon"><i class="bi bi-truck"></i></div>
              <div class="step-label">Shipped</div>
            </div>
            <div class="step-item ${s4}">
              <div class="step-icon"><i class="bi bi-house-door-fill"></i></div>
              <div class="step-label">Delivered</div>
            </div>
          </div>

          <!-- Order Items Breakdown -->
          <div class="bg-light p-3 rounded-3 mt-3">
            <h6 class="fw-bold small text-muted text-uppercase mb-2">Purchased Items (${order.items.length})</h6>
            <div class="d-flex flex-column gap-2">
              ${order.items.map(item => `
                <div class="d-flex align-items-center justify-content-between bg-white p-2 rounded-2 border">
                  <div class="d-flex align-items-center">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}" class="admin-prod-thumb me-2" alt="${item.product_name}">
                    <div>
                      <div class="fw-semibold small text-truncate" style="max-width: 260px;">${item.product_name}</div>
                      <small class="text-muted">Quantity: ${item.quantity}</small>
                    </div>
                  </div>
                  <div class="text-end">
                    <span class="fw-bold text-dark small">$${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-3 d-flex flex-wrap justify-content-between align-items-center text-muted small pt-2">
            <div><i class="bi bi-geo-alt me-1 text-primary"></i><strong>Shipping to:</strong> ${order.shipping_address}</div>
            <div><i class="bi bi-credit-card me-1 text-primary"></i><strong>Payment:</strong> ${order.payment_method.toUpperCase()}</div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-danger">
        Failed to load orders. Please try again.
      </div>
    `;
  }
}

// ==========================================
// 10. ADMIN DASHBOARD & ANALYTICS
// ==========================================
async function loadAdminAnalytics() {
  if (!authToken || !currentUser || currentUser.role !== 'admin') return;

  try {
    const data = await api.getAnalytics(authToken);

    // 1. KPI Cards
    document.getElementById("kpiRevenue").textContent = `$${Number(data.totalRevenue).toFixed(2)}`;
    document.getElementById("kpiOrders").textContent = data.totalOrders;
    document.getElementById("kpiCustomers").textContent = data.totalCustomers;
    document.getElementById("kpiLowStock").textContent = data.lowStockCount;

    // 2. Render Charts using Chart.js
    renderAdminCharts(data);

    // 3. Render Low Stock Items Table
    const lowStockBody = document.getElementById("lowStockTableBody");
    if (data.lowStockItems.length === 0) {
      lowStockBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-success fw-semibold">
            <i class="bi bi-check-circle-fill me-1"></i> All inventory stock levels are healthy!
          </td>
        </tr>
      `;
    } else {
      lowStockBody.innerHTML = data.lowStockItems.map(item => `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${item.image}" class="admin-prod-thumb me-2" alt="${item.name}">
              <span class="fw-semibold">${item.name}</span>
            </div>
          </td>
          <td><span class="badge bg-light text-dark border">${item.category}</span></td>
          <td class="fw-bold">$${Number(item.price).toFixed(2)}</td>
          <td><span class="stock-pill stock-low">${item.stock} left</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="openEditProductModal(${item.id})">
              Restock
            </button>
          </td>
        </tr>
      `).join('');
    }

  } catch (err) {
    console.error('Error loading analytics:', err);
  }
}

function renderAdminCharts(data) {
  const ctxStatus = document.getElementById('orderStatusChart');
  if (ctxStatus) {
    if (statusChartInstance) statusChartInstance.destroy();

    const statusLabels = data.statusStats.map(s => s.status.toUpperCase());
    const statusCounts = data.statusStats.map(s => s.count);

    statusChartInstance = new Chart(ctxStatus, {
      type: 'bar',
      data: {
        labels: statusLabels.length ? statusLabels : ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        datasets: [{
          label: 'Order Volume',
          data: statusCounts.length ? statusCounts : [0, 1, 1, 1],
          backgroundColor: ['#f59e0b', '#4f46e5', '#0ea5e9', '#10b981'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  const ctxCat = document.getElementById('categoryChart');
  if (ctxCat) {
    if (categoryChartInstance) categoryChartInstance.destroy();

    const catLabels = data.categoryStats.map(c => c.category);
    const catCounts = data.categoryStats.map(c => c.count);

    categoryChartInstance = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: catLabels,
        datasets: [{
          data: catCounts,
          backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }
}

// ------------------------------------------
// Admin: Product Inventory CRUD
// ------------------------------------------
async function loadAdminProducts() {
  if (!authToken || !currentUser || currentUser.role !== 'admin') return;

  const tbody = document.getElementById("adminProductsTableBody");
  tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary"></div> Loading inventory...</td></tr>`;

  try {
    const prods = await api.getProducts();

    const searchField = document.getElementById("adminProductSearch");
    searchField.oninput = () => {
      const q = searchField.value.toLowerCase();
      renderAdminProductsTable(prods.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
    };

    renderAdminProductsTable(prods);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Failed to load products.</td></tr>`;
  }
}

function renderAdminProductsTable(prods) {
  const tbody = document.getElementById("adminProductsTableBody");
  if (prods.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No products found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = prods.map(p => {
    const isLow = p.stock <= 10;
    return `
      <tr>
        <td><img src="${p.image}" class="admin-prod-thumb" alt="${p.name}"></td>
        <td>
          <div class="fw-bold text-dark">${p.name}</div>
          <small class="text-muted line-clamp-1" style="max-width: 220px;">${p.description || ''}</small>
        </td>
        <td><span class="badge bg-light text-dark border">${p.category}</span></td>
        <td class="fw-bold text-primary">$${Number(p.price).toFixed(2)}</td>
        <td>
          <span class="stock-pill ${isLow ? 'stock-low' : 'stock-ok'}">
            ${p.stock} units
          </span>
        </td>
        <td>
          <span class="small fw-semibold text-warning"><i class="bi bi-star-fill me-1"></i>${p.rating || 5.0}</span>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-light border me-1 rounded-pill" onclick="openEditProductModal(${p.id})" title="Edit product">
            <i class="bi bi-pencil-fill text-primary"></i>
          </button>
          <button class="btn btn-sm btn-light border text-danger rounded-pill" onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')" title="Delete product">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleAddProduct(e) {
  e.preventDefault();
  const name = document.getElementById("addProdName").value;
  const category = document.getElementById("addProdCategory").value;
  const price = document.getElementById("addProdPrice").value;
  const stock = document.getElementById("addProdStock").value;
  const image = document.getElementById("addProdImage").value;
  const description = document.getElementById("addProdDesc").value;

  try {
    await api.addProduct({ name, category, price, stock, image, description }, authToken);

    const modalEl = document.getElementById("addProductModal");
    bootstrap.Modal.getInstance(modalEl).hide();
    document.getElementById("addProductForm").reset();

    showToast(`Added product "${name}" successfully!`, 'bi-check-circle-fill');
    await loadProducts();
    await loadAdminProducts();
    await loadAdminAnalytics();
  } catch (err) {
    alert(err.message);
  }
}

async function openEditProductModal(id) {
  try {
    const prods = await api.getProducts();
    const product = prods.find(p => p.id == id);
    if (!product) throw new Error('Product not found');

    document.getElementById("editProdId").value = product.id;
    document.getElementById("editProdName").value = product.name;
    document.getElementById("editProdCategory").value = product.category;
    document.getElementById("editProdPrice").value = product.price;
    document.getElementById("editProdStock").value = product.stock;
    document.getElementById("editProdImage").value = product.image;
    document.getElementById("editProdDesc").value = product.description || '';

    const modalEl = document.getElementById("editProductModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  } catch (err) {
    alert(err.message || 'Failed to load product details.');
  }
}

async function handleEditProduct(e) {
  e.preventDefault();
  const id = document.getElementById("editProdId").value;
  const name = document.getElementById("editProdName").value;
  const category = document.getElementById("editProdCategory").value;
  const price = document.getElementById("editProdPrice").value;
  const stock = document.getElementById("editProdStock").value;
  const image = document.getElementById("editProdImage").value;
  const description = document.getElementById("editProdDesc").value;

  try {
    await api.updateProduct(id, { name, category, price, stock, image, description }, authToken);

    const modalEl = document.getElementById("editProductModal");
    bootstrap.Modal.getInstance(modalEl).hide();

    showToast(`Updated product "${name}"!`, 'bi-check-circle-fill');
    await loadProducts();
    await loadAdminProducts();
    await loadAdminAnalytics();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteProduct(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

  try {
    await api.deleteProduct(id, authToken);

    showToast(`Product "${name}" deleted.`, 'bi-trash-fill');
    await loadProducts();
    await loadAdminProducts();
    await loadAdminAnalytics();
  } catch (err) {
    alert(err.message);
  }
}

// ------------------------------------------
// Admin: Order Fulfillment
// ------------------------------------------
async function loadAdminOrders() {
  if (!authToken || !currentUser || currentUser.role !== 'admin') return;

  const tbody = document.getElementById("adminOrdersTableBody");
  tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary"></div> Loading store orders...</td></tr>`;

  try {
    const orders = await api.getAllOrders(authToken);

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No orders found.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const orderDate = new Date(o.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      return `
        <tr>
          <td><span class="fw-bold">#${o.id}</span></td>
          <td>
            <div class="fw-semibold">${o.customer_name}</div>
            <small class="text-muted">${o.customer_email}</small>
          </td>
          <td><small class="text-muted">${orderDate}</small></td>
          <td><span class="fw-bold text-primary">$${Number(o.total_amount).toFixed(2)}</span></td>
          <td><span class="badge bg-light text-dark border text-uppercase">${o.payment_method}</span></td>
          <td>
            <small class="text-muted fw-semibold">
              ${o.items.map(it => `${it.product_name} (x${it.quantity})`).join(', ')}
            </small>
          </td>
          <td>
            <select class="form-select form-select-sm rounded-pill fw-semibold" onchange="updateOrderStatus(${o.id}, this.value)">
              <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Failed to load orders.</td></tr>`;
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    await api.updateOrderStatus(orderId, newStatus, authToken);
    showToast(`Order #${orderId} marked as ${newStatus}.`, 'bi-check-circle-fill');
    loadAdminAnalytics();
  } catch (err) {
    alert(err.message);
  }
}

// ------------------------------------------
// Admin: Customer Inquiries
// ------------------------------------------
async function loadAdminMessages() {
  if (!authToken || !currentUser || currentUser.role !== 'admin') return;

  const tbody = document.getElementById("adminMessagesTableBody");
  tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary"></div> Loading inquiries...</td></tr>`;

  try {
    const msgs = await api.getMessages(authToken);

    if (msgs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No contact messages received.</td></tr>`;
      return;
    }

    tbody.innerHTML = msgs.map(m => {
      const msgDate = new Date(m.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return `
        <tr>
          <td><span class="text-muted">#${m.id}</span></td>
          <td class="fw-semibold">${m.name}</td>
          <td><a href="mailto:${m.email}">${m.email}</a></td>
          <td class="fw-bold">${m.subject}</td>
          <td><small class="text-secondary">${m.message}</small></td>
          <td><small class="text-muted">${msgDate}</small></td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Failed to load inquiries.</td></tr>`;
  }
}

// ==========================================
// 11. FORMS & CHECKOUT SUBMISSION
// ==========================================
function setupForms() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;
      handleLogin(email, pass);
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const pass = document.getElementById("registerPassword").value;
      handleRegister(name, email, pass);
    });
  }

  const addProdForm = document.getElementById("addProductForm");
  if (addProdForm) {
    addProdForm.addEventListener("submit", handleAddProduct);
  }

  const editProdForm = document.getElementById("editProductForm");
  if (editProdForm) {
    editProdForm.addEventListener("submit", handleEditProduct);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (checkoutForm.checkValidity()) {
        const customerName = document.getElementById("checkoutName").value;
        const customerEmail = document.getElementById("checkoutEmail").value;
        const shippingAddress = document.getElementById("checkoutAddress").value;
        const paymentMethod = document.getElementById("checkoutPayment").value;

        const submitBtn = checkoutForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Placing Order...`;

        try {
          const payload = {
            customerName,
            customerEmail,
            shippingAddress,
            paymentMethod,
            items: cart.map(item => ({
              id: item.product.id,
              quantity: item.quantity
            }))
          };

          const data = await api.createOrder(payload, authToken);

          const modalEl = document.getElementById("checkoutModal");
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();

          cart = [];
          saveCart();
          updateCartUI();
          checkoutForm.reset();
          checkoutForm.classList.remove("was-validated");

          await loadProducts();

          alert(`🎉 Order Placed Successfully!\n\nOrder ID: #${data.orderId}\nTotal: $${Number(data.totalAmount).toFixed(2)}\n\nA confirmation receipt has been sent to ${customerEmail}.`);
          showToast(`Order #${data.orderId} placed successfully!`, "bi-check-circle-fill");

          if (currentUser) {
            showView('customerDashboard');
          }
        } catch (err) {
          alert(`Order Error: ${err.message}`);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Confirm & Place Order';
        }
      } else {
        checkoutForm.classList.add("was-validated");
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (contactForm.checkValidity()) {
        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value;

        try {
          const data = await api.sendContact({ name, email, subject, message });
          showToast(data.message || 'Thank you! Your message has been sent.', "bi-send-check-fill");
          contactForm.reset();
          contactForm.classList.remove("was-validated");
        } catch (err) {
          showToast('Failed to send message. Please try again.', 'bi-exclamation-circle');
        }
      } else {
        contactForm.classList.add("was-validated");
      }
    });
  }
}

// ==========================================
// 12. TOAST HELPER & NAVBAR SCROLL
// ==========================================
function showToast(message, iconClass = "bi-info-circle-fill") {
  const toastEl = document.getElementById("liveToast");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  toastMessage.textContent = message;
  toastIcon.className = `bi ${iconClass} me-2 fs-5`;

  const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
  toast.show();
}

function setupNavScroll() {
  const clickableItems = document.querySelectorAll("#navbarContent .nav-link, #navbarContent .dropdown-item");
  const navbarCollapse = document.getElementById("navbarContent");

  clickableItems.forEach(item => {
    item.addEventListener("click", () => {
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });
}
