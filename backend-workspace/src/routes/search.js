import express from 'express';
const router = express.Router();

import { ProfileOwner, Client, SearchQuery, Connection } from '../models.js';
import searchController from '../controllers/searchController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

router.post('/profiles', authenticateToken, searchController.searchProfiles);
router.get('/best-matches/:queryId', authenticateToken, searchController.getBestMatches);
router.get('/categories', searchController.getCategories);
router.post('/connections', authenticateToken, requireRole(['client']), searchController.createConnection);
// Import the MatchingEngine class properly
import MatchingEngine from '../services/MatchingEngine.js';

// Create instance of MatchingEngine
const matchingEngine = new MatchingEngine();

// Advanced search endpoint
router.post('/profiles', authenticateToken, async (req, res) => {
  try {
    const { filters, pagination = { page: 1, limit: 10 } } = req.body;
    const clientId = req.user.clientId || req.user.id;

    // Validate filters
    if (!filters) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search filters are required' 
      });
    }

    // Perform search using matching engine
    const results = await matchingEngine.findBestMatches(filters, pagination.limit);

    // Save search query for analytics
    const searchQuery = await SearchQuery.create({
      clientId,
      searchCriteria: filters,
      resultsCount: results.length,
      topMatches: results.map(r => r.id)
    });

    res.json({
      success: true,
      results: results,
      totalCount: results.length,
      queryId: searchQuery.id
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during search' 
    });
  }
});

// Get best matches for a specific query
router.get('/best-matches/:queryId', authenticateToken, async (req, res) => {
  try {
    const { queryId } = req.params;
    
    const searchQuery = await SearchQuery.findByPk(queryId);
    if (!searchQuery) {
      return res.status(404).json({ 
        success: false, 
        error: 'Search query not found' 
      });
    }

    // Verify the client owns this search query
    if (searchQuery.clientId !== req.user.clientId && searchQuery.clientId !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this search query' 
      });
    }

    // Get the top matches with full profile data
    const topMatches = await ProfileOwner.findAll({
      where: { id: searchQuery.topMatches },
      include: ['User'] // Assuming you have User association
    });

    res.json({
      success: true,
      results: topMatches,
      searchCriteria: searchQuery.searchCriteria
    });

  } catch (error) {
    console.error('Error fetching best matches:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get available search categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await ProfileOwner.findAll({
      attributes: ['serviceCategory'],
      group: ['serviceCategory'],
      where: { 
        serviceCategory: { 
          [require('sequelize').Op.ne]: null 
        } 
      }
    });

    res.json({
      success: true,
      categories: categories.map(cat => cat.serviceCategory)
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get available skills for filtering
router.get('/skills', async (req, res) => {
  try {
    const { category } = req.query;
    
    const whereClause = category ? { serviceCategory: category } : {};
    
    const profileOwners = await ProfileOwner.findAll({
      attributes: ['skills'],
      where: whereClause
    });

    // Extract and deduplicate skills
    const allSkills = new Set();
    profileOwners.forEach(profile => {
      if (profile.skills && Array.isArray(profile.skills)) {
        profile.skills.forEach(skill => allSkills.add(skill));
      }
    });

    res.json({
      success: true,
      skills: Array.from(allSkills)
    });

  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export default router;