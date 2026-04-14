import express from 'express';
const router = express.Router();

// Debug: Check if controller file exists
console.log('🔍 Loading profile field controller...');
try {
  import profileFieldController from '../controllers/profileFieldController.js';
  console.log('✅ Profile field controller loaded successfully');
  
  // Debug: Check if functions are available
  console.log('📋 Available functions:');
  console.log('- getActiveFields:', typeof profileFieldController.getActiveFields);
  console.log('- getFieldsBySection:', typeof profileFieldController.getFieldsBySection);
  console.log('- createField:', typeof profileFieldController.createField);
  console.log('- updateField:', typeof profileFieldController.updateField);
  console.log('- deleteField:', typeof profileFieldController.deleteField);
  console.log('- saveFieldValues:', typeof profileFieldController.saveFieldValues);
  console.log('- getFieldValues:', typeof profileFieldController.getFieldValues);
  console.log('- suggestField:', typeof profileFieldController.suggestField);
  console.log('- getFieldSuggestions:', typeof profileFieldController.getFieldSuggestions);
  console.log('- updateSuggestionStatus:', typeof profileFieldController.updateSuggestionStatus);
  console.log('- updateFieldHierarchy:', typeof profileFieldController.updateFieldHierarchy);
  
  import { authenticateToken, requireAdmin } from '../middleware/auth.js';
  import { validateFieldCreation } from '../middleware/validation.js';

  // Public routes
  router.get('/fields/active', profileFieldController.getActiveFields);
  router.get('/fields/section/:section', profileFieldController.getFieldsBySection);

  // Profile owner routes
  router.get('/profile-owners/:profileOwnerId/fields', authenticateToken, profileFieldController.getFieldValues);
  router.post('/profile-owners/:profileOwnerId/fields', authenticateToken, profileFieldController.saveFieldValues);
  router.post('/profile-owners/:profileOwnerId/suggestions', authenticateToken, profileFieldController.suggestField);

  // Admin routes
  router.get('/admin/fields/suggestions', authenticateToken, requireAdmin, profileFieldController.getFieldSuggestions);
  router.put('/admin/fields/suggestions/:id', authenticateToken, requireAdmin, profileFieldController.updateSuggestionStatus);
  router.post('/admin/fields', authenticateToken, requireAdmin, validateFieldCreation, profileFieldController.createField);
  router.put('/admin/fields/:id', authenticateToken, requireAdmin, profileFieldController.updateField);
  router.delete('/admin/fields/:id', authenticateToken, requireAdmin, profileFieldController.deleteField);
  router.put('/admin/fields/hierarchy/update', authenticateToken, requireAdmin, profileFieldController.updateFieldHierarchy);

  console.log('✅ Profile fields routes configured successfully');
  
} catch (error) {
  console.error('❌ Failed to load profile field controller:', error.message);
  console.error('Full error:', error);
}

export default router;