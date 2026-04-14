// src/controllers/searchController.js
import { ProfileOwner, User, UserCourse, Course, Connection, SearchQuery } from '../models.js';
import { Op } from 'sequelize';
import MatchingEngine from '../services/MatchingEngine.js';

class SearchController {
  constructor() {
    this.matchingEngine = new MatchingEngine();
  }

  async searchProfiles(req, res) {
    try {
      const { filters, pagination = { page: 1, limit: 10 } } = req.body;
      const clientId = req.user?.clientId || null;

      // Validate filters
      if (!filters) {
        return res.status(400).json({
          success: false,
          error: 'Search filters are required'
        });
      }

      // Build search criteria
      const searchCriteria = this.buildSearchCriteria(filters);

      // Perform search
      const results = await this.matchingEngine.findBestMatches(searchCriteria, pagination.limit);

      // Save search query if client is logged in
      if (clientId) {
        await SearchQuery.create({
          clientId,
          searchCriteria: filters,
          resultsCount: results.length,
          topMatches: results.slice(0, 10).map(r => r.id)
        });
      }

      res.json({
        success: true,
        results,
        totalCount: results.length,
        queryId: clientId ? `client_${clientId}_${Date.now()}` : null
      });

    } catch (error) {
      console.error('Search profiles error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getBestMatches(req, res) {
    try {
      const { queryId } = req.params;

      // For now, we'll return matches based on the latest search
      // In a real implementation, you'd retrieve the saved search query
      const results = await this.matchingEngine.findBestMatches({}, 10);

      res.json({
        success: true,
        results: results.slice(0, 10),
        queryId
      });

    } catch (error) {
      console.error('Get best matches error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await ProfileOwner.findAll({
        attributes: ['serviceCategory'],
        group: ['serviceCategory'],
        where: {
          serviceCategory: {
            [Op.ne]: null
          }
        }
      });

      res.json({
        success: true,
        categories: categories.map(c => c.serviceCategory).filter(Boolean)
      });

    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getSkills(req, res) {
    try {
      const skills = await ProfileOwner.findAll({
        attributes: ['skills'],
        where: {
          skills: {
            [Op.ne]: null
          }
        }
      });

      // Extract unique skills
      const allSkills = new Set();
      skills.forEach(profile => {
        if (profile.skills && Array.isArray(profile.skills)) {
          profile.skills.forEach(skill => allSkills.add(skill));
        }
      });

      res.json({
        success: true,
        skills: Array.from(allSkills)
      });

    } catch (error) {
      console.error('Get skills error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async createConnection(req, res) {
    try {
      const { profileOwnerId, searchQueryId } = req.body;
      const clientId = req.user.clientId;

      if (!clientId) {
        return res.status(400).json({
          success: false,
          error: 'Client ID is required'
        });
      }

      // Verify profile owner exists and is available
      const profileOwner = await ProfileOwner.findByPk(profileOwnerId, {
        include: [User]
      });

      if (!profileOwner) {
        return res.status(404).json({
          success: false,
          error: 'Profile owner not found'
        });
      }

      if (!profileOwner.isAvailable) {
        return res.status(400).json({
          success: false,
          error: 'Profile owner is not available'
        });
      }

      // Get client info
      const client = await Client.findByPk(clientId, {
        include: [User]
      });

      // Create connection
      const connection = await Connection.create({
        clientId,
        profileOwnerId,
        searchQueryId,
        connectionDate: new Date(),
        status: 'initiated'
      });

      // TODO: Trigger notification to profile owner
      // notificationService.notifyProfileOwnerConnection(connection.id);

      res.status(201).json({
        success: true,
        connection: {
          id: connection.id,
          clientPhone: client.phoneNumber,
          message: 'Profile owner has been notified and will contact you shortly'
        }
      });

    } catch (error) {
      console.error('Create connection error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  buildSearchCriteria(filters) {
    const criteria = {};

    if (filters.serviceCategory) criteria.serviceCategory = filters.serviceCategory;
    if (filters.minExperience) criteria.minExperience = parseInt(filters.minExperience);
    if (filters.maxHourlyRate) criteria.maxHourlyRate = parseFloat(filters.maxHourlyRate);
    if (filters.availability) criteria.availability = filters.availability;
    if (filters.minProfessionalRank) criteria.minProfessionalRank = parseInt(filters.minProfessionalRank);
    if (filters.skills) criteria.skills = Array.isArray(filters.skills) ? filters.skills : [filters.skills];
    if (filters.location) criteria.location = filters.location;
    if (filters.hasCertificates) criteria.hasCertificates = Boolean(filters.hasCertificates);

    return criteria;
  }
}

export default new SearchController();