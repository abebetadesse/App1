const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redisClient = require('../config/redis');

// GET /api/v1/taxonomy/tree - Full nested tree
router.get('/tree', async (req, res, next) => {
  try {
    const cacheKey = 'taxonomy:tree';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const { rows } = await db.query(`
      WITH RECURSIVE tree AS (
        SELECT id, name, level, path::text, parent_id,
               COALESCE((SELECT json_agg(json_build_object('id', c.id, 'name', c.name)) 
                         FROM taxonomy_nodes c WHERE c.parent_id = tn.id), '[]') as children
        FROM taxonomy_nodes tn WHERE parent_id IS NULL AND is_active = true
      )
      SELECT * FROM tree ORDER BY path
    `);
    
    // Build nested structure
    const nodeMap = {};
    const roots = [];
    rows.forEach(row => { nodeMap[row.id] = { ...row, children: [] }; });
    rows.forEach(row => {
      if (row.parent_id) nodeMap[row.parent_id].children.push(nodeMap[row.id]);
      else roots.push(nodeMap[row.id]);
    });

    await redisClient.setex(cacheKey, 3600, JSON.stringify(roots));
    res.json(roots);
  } catch (error) { next(error); }
});

// POST /api/v1/taxonomy/admin/node - Add new taxonomy node (admin only)
router.post('/admin/node', async (req, res, next) => {
  try {
    const { name, level, parent_id } = req.body;
    // Insert node and update cache...
    res.status(201).json({ success: true });
  } catch (error) { next(error); }
});

module.exports = router;
