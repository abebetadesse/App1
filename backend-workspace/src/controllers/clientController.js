// src/controllers/clientController.js
import { Client, User, Connection, SearchQuery } from '../models.js';

class ClientController {
  async getProfile(req, res) {
    try {
      const { id } = req.params;

      const client = await Client.findByPk(id, {
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          },
          {
            model: Connection,
            include: ['ProfileOwner']
          },
          {
            model: SearchQuery
          }
        ]
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      res.json({
        success: true,
        client
      });
    } catch (error) {
      console.error('Get client profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await Client.findByPk(id);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      await client.update(updateData);

      res.json({
        success: true,
        client,
        message: 'Client profile updated successfully'
      });
    } catch (error) {
      console.error('Update client profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getConnections(req, res) {
    try {
      const { clientId } = req.params;

      const connections = await Connection.findAll({
        where: { clientId },
        include: ['ProfileOwner'],
        order: [['connectionDate', 'DESC']]
      });

      res.json({
        success: true,
        connections,
        count: connections.length
      });
    } catch (error) {
      console.error('Get client connections error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Additional methods that might be expected
  async getAllClients(req, res) {
    try {
      const clients = await Client.findAll({
        include: [{
          model: User,
          attributes: ['id', 'email', 'isActive', 'lastLogin']
        }]
      });

      res.json({
        success: true,
        clients,
        count: clients.length
      });
    } catch (error) {
      console.error('Get all clients error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getClient(req, res) {
    try {
      const { id } = req.params;

      const client = await Client.findByPk(id, {
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }
        ]
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      res.json({
        success: true,
        client
      });
    } catch (error) {
      console.error('Get client error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await Client.findByPk(id);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      await client.update(updateData);

      res.json({
        success: true,
        client,
        message: 'Client updated successfully'
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getClientStats(req, res) {
    try {
      const { clientId } = req.params;

      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      const totalConnections = await Connection.count({ where: { clientId } });
      const successfulConnections = await Connection.count({ 
        where: { 
          clientId, 
          status: 'successful' 
        } 
      });
      const totalSearches = await SearchQuery.count({ where: { clientId } });

      res.json({
        success: true,
        stats: {
          totalConnections,
          successfulConnections,
          totalSearches,
          successRate: totalConnections > 0 ? (successfulConnections / totalConnections) * 100 : 0
        }
      });
    } catch (error) {
      console.error('Get client stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export default new;ClientController();
