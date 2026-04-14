import express from 'express';
const router = express.Router();

// Mock products database
let products = [
  { id: 1, name: 'Premium Course', price: 99.99, category: 'education', stock: 50 },
  { id: 2, name: 'Professional Consultation', price: 199.99, category: 'service', stock: 100 },
  { id: 3, name: 'Custom Software', price: 999.99, category: 'software', stock: 10 },
];

let cartItems = [];
let orders = [];

// GET /api/ecommerce/products
router.get('/products', (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    message: 'Products retrieved',
    data: {
      products: filteredProducts,
      total: filteredProducts.length,
      filters: {
        categories: [...new Set(products.map(p => p.category))],
        priceRange: {
          min: Math.min(...products.map(p => p.price)),
          max: Math.max(...products.map(p => p.price)),
        },
      },
    },
  });
});

// GET /api/ecommerce/products/:id
router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (product) {
    res.json({
      success: true,
      message: 'Product details',
      data: product,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }
});

// GET /api/ecommerce/cart
router.get('/cart', (req, res) => {
  const { userId } = req.query;
  
  const userCart = cartItems.filter(item => item.userId === userId);
  const total = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({
    success: true,
    message: 'Cart items retrieved',
    data: {
      items: userCart,
      summary: {
        itemCount: userCart.length,
        totalItems: userCart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: total,
        tax: total * 0.08,
        total: total * 1.08,
      },
    },
  });
});

// POST /api/ecommerce/cart
router.post('/cart', (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }
  
  // Check if item already in cart
  const existingItem = cartItems.find(item => 
    item.userId === userId && item.productId === productId
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      cartId: `cart_${Date.now()}`,
      userId,
      productId,
      name: product.name,
      price: product.price,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }
  
  res.json({
    success: true,
    message: 'Item added to cart',
    data: { productId, quantity },
  });
});

// POST /api/ecommerce/checkout
router.post('/checkout', (req, res) => {
  const { userId, paymentMethod = 'card', shippingAddress } = req.body;
  
  const userCart = cartItems.filter(item => item.userId === userId);
  if (userCart.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty',
    });
  }
  
  const orderId = `order_${Date.now()}`;
  const total = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder = {
    orderId,
    userId,
    items: [...userCart],
    total,
    tax: total * 0.08,
    grandTotal: total * 1.08,
    paymentMethod,
    shippingAddress,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  
  // Clear user's cart
  cartItems = cartItems.filter(item => item.userId !== userId);
  
  // Update product stock
  userCart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.stock -= item.quantity;
    }
  });
  
  res.json({
    success: true,
    message: 'Order placed successfully',
    data: newOrder,
  });
});

// GET /api/ecommerce/orders
router.get('/orders', (req, res) => {
  const { userId } = req.query;
  
  const userOrders = orders.filter(order => order.userId === userId);
  
  res.json({
    success: true,
    message: 'Orders retrieved',
    data: {
      orders: userOrders,
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.grandTotal, 0),
    },
  });
});

export default router;