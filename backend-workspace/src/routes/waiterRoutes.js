import express from 'express';
const router = express.Router();

// Mock restaurant/tables data
let tables = [
  { id: 1, number: 1, capacity: 4, status: 'available', waiterId: null },
  { id: 2, number: 2, capacity: 2, status: 'occupied', waiterId: 101 },
  { id: 3, number: 3, capacity: 6, status: 'reserved', waiterId: null },
  { id: 4, number: 4, capacity: 4, status: 'available', waiterId: null },
  { id: 5, number: 5, capacity: 8, status: 'occupied', waiterId: 102 },
];

let orders = [];
let waiters = [
  { id: 101, name: 'John Waiter', status: 'active' },
  { id: 102, name: 'Jane Server', status: 'active' },
];

// Middleware to check if user is a waiter
const isWaiter = (req, res, next) => {
  const waiterId = parseInt(req.headers['x-user-id'] || req.session.userId || '0');
  const isUserWaiter = waiters.some(waiter => waiter.id === waiterId);
  
  if (isUserWaiter) {
    req.waiterId = waiterId;
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Waiter privileges required.',
    });
  }
};

// Apply waiter middleware to all routes
router.use(isWaiter);

// GET /api/waiter/tables
router.get('/tables', (req, res) => {
  const waiterTables = tables.filter(table => table.waiterId === req.waiterId);
  const availableTables = tables.filter(table => table.status === 'available');
  
  res.json({
    success: true,
    message: 'Tables retrieved',
    data: {
      assignedTables: waiterTables,
      availableTables,
      stats: {
        totalTables: tables.length,
        assignedToWaiter: waiterTables.length,
        available: availableTables.length,
        occupied: tables.filter(table => table.status === 'occupied').length,
        reserved: tables.filter(table => table.status === 'reserved').length,
      },
    },
  });
});

// GET /api/waiter/table/:tableId
router.get('/table/:tableId', (req, res) => {
  const table = tables.find(t => t.id === parseInt(req.params.tableId));
  
  if (!table) {
    return res.status(404).json({
      success: false,
      message: 'Table not found',
    });
  }
  
  // Only allow access if waiter is assigned to this table
  if (table.waiterId !== req.waiterId && table.status !== 'available') {
    return res.status(403).json({
      success: false,
      message: 'Not assigned to this table',
    });
  }
  
  const tableOrders = orders.filter(order => order.tableId === table.id && order.waiterId === req.waiterId);
  
  res.json({
    success: true,
    message: 'Table details retrieved',
    data: {
      table,
      currentOrder: tableOrders.find(order => order.status !== 'completed'),
      orderHistory: tableOrders.filter(order => order.status === 'completed'),
    },
  });
});

// POST /api/waiter/table/:tableId/assign
router.post('/table/:tableId/assign', (req, res) => {
  const tableId = parseInt(req.params.tableId);
  const tableIndex = tables.findIndex(t => t.id === tableId);
  
  if (tableIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Table not found',
    });
  }
  
  if (tables[tableIndex].status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'Table is not available',
    });
  }
  
  tables[tableIndex].waiterId = req.waiterId;
  tables[tableIndex].status = 'occupied';
  tables[tableIndex].occupiedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Table assigned successfully',
    data: tables[tableIndex],
  });
});

// POST /api/waiter/table/:tableId/release
router.post('/table/:tableId/release', (req, res) => {
  const tableId = parseInt(req.params.tableId);
  const tableIndex = tables.findIndex(t => t.id === tableId);
  
  if (tableIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Table not found',
    });
  }
  
  if (tables[tableIndex].waiterId !== req.waiterId) {
    return res.status(403).json({
      success: false,
      message: 'Not assigned to this table',
    });
  }
  
  // Complete any active orders for this table
  orders.forEach(order => {
    if (order.tableId === tableId && order.status !== 'completed') {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
    }
  });
  
  tables[tableIndex].waiterId = null;
  tables[tableIndex].status = 'available';
  tables[tableIndex].releasedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Table released successfully',
    data: tables[tableIndex],
  });
});

// GET /api/waiter/orders
router.get('/orders', (req, res) => {
  const waiterOrders = orders.filter(order => order.waiterId === req.waiterId);
  
  const { status, tableId } = req.query;
  
  let filteredOrders = [...waiterOrders];
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  if (tableId) {
    filteredOrders = filteredOrders.filter(order => order.tableId === parseInt(tableId));
  }
  
  // Sort by creation date (newest first)
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({
    success: true,
    message: 'Waiter orders retrieved',
    data: {
      orders: filteredOrders,
      stats: {
        total: waiterOrders.length,
        active: waiterOrders.filter(o => o.status === 'active').length,
        preparing: waiterOrders.filter(o => o.status === 'preparing').length,
        ready: waiterOrders.filter(o => o.status === 'ready').length,
        completed: waiterOrders.filter(o => o.status === 'completed').length,
      },
    },
  });
});

// POST /api/waiter/order
router.post('/order', (req, res) => {
  const { tableId, items, specialInstructions } = req.body;
  
  if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Table ID and items are required',
    });
  }
  
  // Verify waiter is assigned to this table
  const table = tables.find(t => t.id === parseInt(tableId) && t.waiterId === req.waiterId);
  if (!table) {
    return res.status(403).json({
      success: false,
      message: 'Not assigned to this table',
    });
  }
  
  const orderId = `order_${Date.now()}`;
  const newOrder = {
    orderId,
    tableId: parseInt(tableId),
    waiterId: req.waiterId,
    items,
    specialInstructions: specialInstructions || '',
    status: 'active',
    createdAt: new Date().toISOString(),
    estimatedReady: new Date(Date.now() + 20 * 60000).toISOString(), // 20 minutes
  };
  
  orders.push(newOrder);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder,
  });
});

// PUT /api/waiter/order/:orderId/status
router.put('/order/:orderId/status', (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  const validStatuses = ['active', 'preparing', 'ready', 'served', 'completed'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }
  
  const orderIndex = orders.findIndex(o => o.orderId === orderId && o.waiterId === req.waiterId);
  
  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or not authorized',
    });
  }
  
  orders[orderIndex].status = status;
  orders[orderIndex].statusUpdatedAt = new Date().toISOString();
  
  // If marking as served, update table status
  if (status === 'served') {
    const tableIndex = tables.findIndex(
      t => t.id === orders[orderIndex].tableId && t.waiterId === req.waiterId
    );
    if (tableIndex !== -1) {
      tables[tableIndex].lastServed = new Date().toISOString();
    }
  }
  
  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: orders[orderIndex],
  });
});

// GET /api/waiter/stats
router.get('/stats', (req, res) => {
  const waiterOrders = orders.filter(order => order.waiterId === req.waiterId);
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = waiterOrders.filter(order => order.createdAt.startsWith(today));
  
  const stats = {
    daily: {
      orders: todayOrders.length,
      completed: todayOrders.filter(o => o.status === 'completed').length,
      revenue: todayOrders.reduce((sum, order) => {
        const orderTotal = order.items?.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity), 0) || 0;
        return sum + orderTotal;
      }, 0),
    },
    overall: {
      totalOrders: waiterOrders.length,
      averageOrderValue: waiterOrders.length > 0 
        ? waiterOrders.reduce((sum, order) => {
            const orderTotal = order.items?.reduce((itemSum, item) => 
              itemSum + (item.price * item.quantity), 0) || 0;
            return sum + orderTotal;
          }, 0) / waiterOrders.length
        : 0,
      assignedTables: tables.filter(t => t.waiterId === req.waiterId).length,
    },
  };
  
  res.json({
    success: true,
    message: 'Waiter statistics',
    data: stats,
  });
});

export default router;