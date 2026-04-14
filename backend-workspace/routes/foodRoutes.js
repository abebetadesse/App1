import express from 'express';
const router = express.Router();

// Mock food/menu database
let menuItems = [
  { id: 1, name: 'Spaghetti Carbonara', category: 'pasta', price: 12.99, available: true },
  { id: 2, name: 'Margherita Pizza', category: 'pizza', price: 10.99, available: true },
  { id: 3, name: 'Caesar Salad', category: 'salad', price: 8.99, available: true },
  { id: 4, name: 'Grilled Salmon', category: 'seafood', price: 18.99, available: false },
  { id: 5, name: 'Chocolate Cake', category: 'dessert', price: 6.99, available: true },
];

let orders = [];
let categories = ['pasta', 'pizza', 'salad', 'seafood', 'dessert', 'drinks'];

// GET /api/food/menu
router.get('/menu', (req, res) => {
  const { category, available, search } = req.query;
  
  let filteredMenu = [...menuItems];
  
  if (category) {
    filteredMenu = filteredMenu.filter(item => item.category === category);
  }
  
  if (available === 'true') {
    filteredMenu = filteredMenu.filter(item => item.available);
  }
  
  if (search) {
    filteredMenu = filteredMenu.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    message: 'Menu items retrieved',
    data: {
      menu: filteredMenu,
      categories,
      stats: {
        totalItems: filteredMenu.length,
        availableItems: filteredMenu.filter(item => item.available).length,
        priceRange: {
          min: filteredMenu.length > 0 ? Math.min(...filteredMenu.map(item => item.price)) : 0,
          max: filteredMenu.length > 0 ? Math.max(...filteredMenu.map(item => item.price)) : 0,
        },
      },
    },
  });
});

// GET /api/food/menu/:id
router.get('/menu/:id', (req, res) => {
  const menuItem = menuItems.find(item => item.id === parseInt(req.params.id));
  
  if (menuItem) {
    res.json({
      success: true,
      message: 'Menu item details',
      data: {
        ...menuItem,
        details: {
          description: 'Delicious dish prepared with fresh ingredients',
          preparationTime: '20-30 minutes',
          calories: 450,
          ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
          allergens: ['gluten', 'dairy'],
        },
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Menu item not found',
    });
  }
});

// POST /api/food/order
router.post('/order', (req, res) => {
  const { userId, items, specialInstructions } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item',
    });
  }
  
  // Validate items and check availability
  let total = 0;
  const orderItems = [];
  
  for (const orderItem of items) {
    const menuItem = menuItems.find(item => item.id === orderItem.itemId);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: `Menu item ${orderItem.itemId} not found`,
      });
    }
    
    if (!menuItem.available) {
      return res.status(400).json({
        success: false,
        message: `Menu item ${menuItem.name} is not available`,
      });
    }
    
    total += menuItem.price * (orderItem.quantity || 1);
    orderItems.push({
      itemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: orderItem.quantity || 1,
    });
  }
  
  const orderId = `food_${Date.now()}`;
  const newOrder = {
    orderId,
    userId,
    items: orderItems,
    total,
    tax: total * 0.08,
    grandTotal: total * 1.08,
    specialInstructions,
    status: 'received',
    createdAt: new Date().toISOString(),
    estimatedReady: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes
  };
  
  orders.push(newOrder);
  
  res.json({
    success: true,
    message: 'Food order placed successfully',
    data: newOrder,
  });
});

// GET /api/food/orders/:orderId
router.get('/orders/:orderId', (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  
  if (order) {
    res.json({
      success: true,
      message: 'Order details',
      data: order,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }
});

// PUT /api/food/orders/:orderId/status
router.put('/orders/:orderId/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['received', 'preparing', 'ready', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }
  
  const orderIndex = orders.findIndex(o => o.orderId === req.params.orderId);
  
  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }
  
  orders[orderIndex].status = status;
  orders[orderIndex].statusUpdatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: orders[orderIndex],
  });
});

// GET /api/food/categories
router.get('/categories', (req, res) => {
  const categoryStats = categories.map(category => {
    const items = menuItems.filter(item => item.category === category);
    return {
      category,
      count: items.length,
      available: items.filter(item => item.available).length,
      priceRange: {
        min: items.length > 0 ? Math.min(...items.map(item => item.price)) : 0,
        max: items.length > 0 ? Math.max(...items.map(item => item.price)) : 0,
      },
    };
  });
  
  res.json({
    success: true,
    message: 'Food categories',
    data: {
      categories: categoryStats,
      totalCategories: categories.length,
    },
  });
});

// POST /api/food/menu
router.post('/menu', (req, res) => {
  const { name, category, price, available = true } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, and price are required',
    });
  }
  
  // Add new category if it doesn't exist
  if (!categories.includes(category)) {
    categories.push(category);
  }
  
  const newMenuItem = {
    id: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1,
    name,
    category,
    price: parseFloat(price),
    available: Boolean(available),
    createdAt: new Date().toISOString(),
  };
  
  menuItems.push(newMenuItem);
  
  res.status(201).json({
    success: true,
    message: 'Menu item added',
    data: newMenuItem,
  });
});

export default router;