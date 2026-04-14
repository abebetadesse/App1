import Joi from 'joi';

// Common validation schemas
const commonValidators = {
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).required(),
  name: Joi.string().min(2).max(100).required(),
  text: Joi.string().max(1000),
  number: Joi.number(),
  boolean: Joi.boolean(),
  array: Joi.array(),
  object: Joi.object(),
  date: Joi.date()
};

// Auth validations
const authValidators = {
  login: Joi.object({
    email: commonValidators.email,
    password: commonValidators.password
  }),

  register: Joi.object({
    email: commonValidators.email,
    password: commonValidators.password,
    role: Joi.string().valid('profile_owner', 'client', 'admin').required(),
    phoneNumber: commonValidators.phone,
    firstName: commonValidators.name,
    lastName: commonValidators.name
  }),

  forgotPassword: Joi.object({
    email: commonValidators.email
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: commonValidators.password
  })
};

// Admin validations
const adminValidators = {
  updateUserStatus: Joi.object({
    status: Joi.string().valid('active', 'inactive', 'suspended').required(),
    reason: Joi.string().max(500).optional()
  }),

  verifyProfileOwner: Joi.object({
    verificationStatus: Joi.string().valid('verified', 'rejected').required(),
    verificationNotes: Joi.string().max(1000).optional()
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().max(100).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Ranking validations
const rankingValidators = {
  createCriteria: Joi.object({
    name: commonValidators.name,
    category: Joi.string().required(),
    weight: Joi.number().min(0).max(1).required(),
    formula: Joi.string().required(),
    parameters: Joi.object().optional(),
    isActive: Joi.boolean().default(true)
  }),

  updateCriteria: Joi.object({
    name: commonValidators.name.optional(),
    category: Joi.string().optional(),
    weight: Joi.number().min(0).max(1).optional(),
    formula: Joi.string().optional(),
    parameters: Joi.object().optional(),
    isActive: Joi.boolean().optional()
  })
};

// Payment validations
const paymentValidators = {
  createPayment: Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().valid('USD', 'ETB', 'EUR').required(),
    provider: Joi.string().valid('stripe', 'paypal', 'chapa').required(),
    metadata: Joi.object().optional()
  })
};

// Export all validators
export {
common as commonValidators,
  auth as authValidators,
  admin as adminValidators,
  ranking as rankingValidators,
  payment as paymentValidators,

  // Validation middleware
  validate: (schema) => {
    return (req, res, next) => {
      const { error, value
};= schema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
      }
      
      req.body = value;
      next();
    };
  },

  // Validate params
  validateParams: (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.params);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid parameters',
          details: error.details.map(detail => detail.message)
        });
      }
      
      req.params = value;
      next();
    };
  },

  // Validate query
  validateQuery: (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: error.details.map(detail => detail.message)
        });
      }
      
      req.query = value;
      next();
    };
  }
};
// /app/src/utils/simple-validator.js
const simpleValidation = async () => {
  console.log('🔍 Running simple system check...');
  
  const controllers = [
    '../controllers/adminController',
    '../controllers/authController', 
    '../controllers/profileOwnerController',
    '../controllers/clientController',
    '../controllers/searchController',
    '../controllers/rankingController'
  ];
  
  let validCount = 0;
  
  for (const controllerPath of controllers) {
    try {
      require(controllerPath);
      console.log(`✅ ${controllerPath} - OK`);
      validCount++;
    } catch (error) {
      console.log(`❌ ${controllerPath} - Missing`);
    }
  }
  
  console.log(`📊 ${validCount}/${controllers.length} controllers loaded`);
  return validCount === controllers.length;
};

export {
simpleValidation
};