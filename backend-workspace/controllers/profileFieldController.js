import db from '../models.js';
const ProfileField = db.ProfileField;
const ProfileFieldValue = db.ProfileFieldValue;
const FieldSuggestion = db.FieldSuggestion;
import { validationResult } from 'express-validator';

const profileFieldController = {
  // Get all active profile fields for form
  getActiveFields: async (req, res) => {
    try {
      const fields = await ProfileField.findAll({
        where: { isActive: true },
        order: [['section', 'ASC'], ['hierarchy', 'ASC']]
      });
      
      res.json({
        success: true,
        fields
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching profile fields',
        error: error.message
      });
    }
  },

  // Get fields by section
  getFieldsBySection: async (req, res) => {
    try {
      const { section } = req.params;
      const fields = await ProfileField.findAll({
        where: { 
          section,
          isActive: true 
        },
        order: [['hierarchy', 'ASC']]
      });
      
      res.json({
        success: true,
        fields
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching profile fields',
        error: error.message
      });
    }
  },

  // Admin: Create new profile field
  createField: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const fieldData = {
        ...req.body,
        createdBy: req.user.id
      };

      const field = await ProfileField.create(fieldData);
      
      res.status(201).json({
        success: true,
        message: 'Profile field created successfully',
        field
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating profile field',
        error: error.message
      });
    }
  },

  // Admin: Update profile field
  updateField: async (req, res) => {
    try {
      const { id } = req.params;
      const field = await ProfileField.findByPk(id);
      
      if (!field) {
        return res.status(404).json({
          success: false,
          message: 'Profile field not found'
        });
      }

      await field.update(req.body);
      
      res.json({
        success: true,
        message: 'Profile field updated successfully',
        field
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating profile field',
        error: error.message
      });
    }
  },

  // Admin: Delete profile field (soft delete)
  deleteField: async (req, res) => {
    try {
      const { id } = req.params;
      const field = await ProfileField.findByPk(id);
      
      if (!field) {
        return res.status(404).json({
          success: false,
          message: 'Profile field not found'
        });
      }

      await field.update({ isActive: false });
      
      res.json({
        success: true,
        message: 'Profile field deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting profile field',
        error: error.message
      });
    }
  },

  // Profile Owner: Save field values
  saveFieldValues: async (req, res) => {
    try {
      const { profileOwnerId } = req.params;
      const { fieldValues } = req.body;

      // Verify profile owner exists and user has permission
      const ProfileOwner = db.ProfileOwner;
      const profileOwner = await ProfileOwner.findByPk(profileOwnerId);
      if (!profileOwner) {
        return res.status(404).json({
          success: false,
          message: 'Profile owner not found'
        });
      }

      // Check permission
      if (profileOwner.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const savedValues = [];
      
      for (const fieldValue of fieldValues) {
        const [savedValue, created] = await ProfileFieldValue.upsert({
          profileOwnerId,
          fieldId: fieldValue.fieldId,
          fieldValue: fieldValue.value,
          fileUrl: fieldValue.fileUrl
        });
        
        savedValues.push(savedValue);
      }

      res.json({
        success: true,
        message: 'Field values saved successfully',
        savedValues
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error saving field values',
        error: error.message
      });
    }
  },

  // Profile Owner: Get field values
  getFieldValues: async (req, res) => {
    try {
      const { profileOwnerId } = req.params;
      
      const fieldValues = await ProfileFieldValue.findAll({
        where: { profileOwnerId },
        include: [{
          model: ProfileField,
          as: 'field',
          where: { isActive: true }
        }]
      });

      res.json({
        success: true,
        fieldValues
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching field values',
        error: error.message
      });
    }
  },

  // Profile Owner: Suggest new field
  suggestField: async (req, res) => {
    try {
      const { profileOwnerId } = req.params;
      const suggestionData = {
        ...req.body,
        profileOwnerId
      };

      const suggestion = await FieldSuggestion.create(suggestionData);
      
      res.status(201).json({
        success: true,
        message: 'Field suggestion submitted successfully',
        suggestion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting field suggestion',
        error: error.message
      });
    }
  },

  // Admin: Get field suggestions
  getFieldSuggestions: async (req, res) => {
    try {
      const { status } = req.query;
      const where = {};
      
      if (status) {
        where.status = status;
      }

      const suggestions = await FieldSuggestion.findAll({
        where,
        include: [{
          model: db.ProfileOwner,
          as: 'profileOwner',
          include: [{
            model: db.User,
            as: 'user'
          }]
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        suggestions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching field suggestions',
        error: error.message
      });
    }
  },

  // Admin: Update suggestion status
  updateSuggestionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const suggestion = await FieldSuggestion.findByPk(id);
      
      if (!suggestion) {
        return res.status(404).json({
          success: false,
          message: 'Suggestion not found'
        });
      }

      await suggestion.update({
        status,
        adminNotes
      });

      // If approved, automatically create a field
      if (status === 'approved') {
        await ProfileField.create({
          fieldName: suggestion.fieldName,
          fieldType: suggestion.fieldType,
          fieldLabel: suggestion.fieldName,
          section: 'custom',
          isRequired: false,
          isSearchable: true,
          options: suggestion.suggestedOptions,
          createdBy: req.user.id
        });
      }

      res.json({
        success: true,
        message: `Suggestion ${status} successfully`,
        suggestion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating suggestion status',
        error: error.message
      });
    }
  },

  // Update field hierarchy (reordering)
  updateFieldHierarchy: async (req, res) => {
    try {
      const { fields } = req.body; // Array of {id, hierarchy}

      for (const fieldUpdate of fields) {
        await ProfileField.update(
          { hierarchy: fieldUpdate.hierarchy },
          { where: { id: fieldUpdate.id } }
        );
      }

      res.json({
        success: true,
        message: 'Field hierarchy updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating field hierarchy',
        error: error.message
      });
    }
  }
};

// Make sure to export the controller object
export default profileFieldController;