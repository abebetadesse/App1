import fs from 'fs';
import path from 'path';

class ControllerValidationSystem {
  constructor() {
    this.validationResults = new Map();
    this.routeCoverage = new Map();
    this.dependencyGraph = new Map();
  }

  // Enhanced Controller Export Validation
  validateControllerExports() {
    console.log('\n🔍 ENHANCED CONTROLLER EXPORT VALIDATION');
    console.log('='.repeat(60));

    const controllers = {
      adminController: {
        path: './controllers/adminController',
        expectedMethods: [
          'getDashboardData',
          'getConnectionAnalytics', 
          'getUserManagement',
          'updateUserStatus',
          'verifyProfileOwner',
          'getPlatformStatistics',
          'manageSystemSettings'
        ],
        dependencies: ['authService', 'userService', 'analyticsService']
      },
      rankingController: {
        path: './controllers/rankingController', 
        expectedMethods: [
          'getRankingCriteria',
          'createRankingCriteria',
          'updateRankingCriteria',
          'deleteRankingCriteria',
          'triggerRankingRecalculation',
          'getRankingAnalytics',
          'calculateProfileRanking',
          'getRankingLeaderboard'
        ],
        dependencies: ['rankingService', 'moodleService', 'cacheService']
      },
      authController: {
        path: './controllers/authController',
        expectedMethods: [
          'login',
          'register',
          'logout',
          'forgotPassword',
          'resetPassword',
          'verifyEmail',
          'refreshToken',
          'changePassword'
        ],
        dependencies: ['authService', 'emailService', 'userService']
      },
      profileOwnerController: {
        path: './controllers/profileOwnerController',
        expectedMethods: [
          'getAllProfileOwners',
          'getProfileOwner', 
          'createProfileOwner',
          'updateProfileOwner',
          'deleteProfileOwner',
          'uploadDocuments',
          'linkMoodleAccount',
          'getRankingDetails',
          'setAvailability',
          'getConnectionHistory',
          'updatePricing'
        ],
        dependencies: ['profileOwnerService', 'documentService', 'moodleService']
      },
      clientController: {
        path: './controllers/clientController',
        expectedMethods: [
          'getProfile',
          'updateProfile',
          'getConnections',
          'searchProfiles',
          'createConnection',
          'provideFeedback'
        ],
        dependencies: ['clientService', 'searchService', 'notificationService']
      },
      searchController: {
        path: './controllers/searchController', 
        expectedMethods: [
          'searchProfiles',
          'getBestMatches',
          'getCategories',
          'getSkills',
          'getSearchSuggestions',
          'saveSearchQuery',
          'getSearchHistory'
        ],
        dependencies: ['searchService', 'matchingEngine', 'cacheService']
      },
      connectionController: {
        path: './controllers/connectionController',
        expectedMethods: [
          'createConnection',
          'getConnections',
          'updateConnectionStatus',
          'getConnectionDetails',
          'addConnectionNotes'
        ],
        dependencies: ['connectionService', 'notificationService']
      },
      notificationController: {
        path: './controllers/notificationController',
        expectedMethods: [
          'getNotifications',
          'markAsRead',
          'deleteNotification',
          'getUnreadCount',
          'updatePreferences'
        ],
        dependencies: ['notificationService', 'pushService']
      }
    };

    let allValid = true;
    const comprehensiveResults = {};

    for (const [controllerName, config] of Object.entries(controllers)) {
      try {
        console.log(`\n📦 Validating ${controllerName}...`);
        
        // Clear require cache for fresh validation
        // delete require.cache[/* require.resolve(...) */];
        const controller = require(config.path);
        
        comprehensiveResults[controllerName] = { 
          valid: true, 
          methods: {},
          dependencies: config.dependencies,
          stats: {}
        };

        // Enhanced object validation
        if (typeof controller !== 'object' || controller === null) {
          console.log(`   ❌ ${controllerName}: Not a valid object export`);
          allValid = false;
          comprehensiveResults[controllerName].valid = false;
          comprehensiveResults[controllerName].error = 'Invalid object export';
          continue;
        }

        // Check if it's a class instance
        const isClassInstance = controller.constructor && 
                               controller.constructor.name !== 'Object';
        
        console.log(`   🏗️  Type: ${isClassInstance ? 'Class Instance' : 'Object Literal'}`);
        if (isClassInstance) {
          console.log(`   📝 Constructor: ${controller.constructor.name}`);
        }

        // Validate each expected method with enhanced checks
        let methodCount = 0;
        let asyncMethodCount = 0;
        
        config.expectedMethods.forEach(methodName => {
          const method = controller[methodName];
          const methodType = typeof method;
          const exists = methodType === 'function';
          const isAsync = exists && method.constructor.name === 'AsyncFunction';
          const parameterCount = exists ? method.length : 0;
          
          comprehensiveResults[controllerName].methods[methodName] = {
            exists,
            type: methodType,
            isAsync,
            parameterCount,
            signature: this.inferSignature(method)
          };

          const status = exists ? '✅' : '❌';
          const asyncIndicator = isAsync ? '⚡' : '🔄';
          console.log(`   ${status} ${asyncIndicator} ${methodName}: ${methodType} (${parameterCount} params)`);
          
          if (exists) {
            methodCount++;
            if (isAsync) asyncMethodCount++;
          }
        });

        // Enhanced statistics
        comprehensiveResults[controllerName].stats = {
          totalMethods: config.expectedMethods.length,
          implementedMethods: methodCount,
          asyncMethods: asyncMethodCount,
          syncMethods: methodCount - asyncMethodCount,
          implementationRate: Math.round((methodCount / config.expectedMethods.length) * 100)
        };

        // Check for extra methods (potential issues or undocumented features)
        const extraMethods = Object.getOwnPropertyNames(controller)
          .filter(name => 
            typeof controller[name] === 'function' && 
            !config.expectedMethods.includes(name) &&
            !name.startsWith('_') && // Ignore private methods
            name !== 'constructor'
          );

        if (extraMethods.length > 0) {
          console.log(`   ⚠️  Extra methods found: ${extraMethods.join(', ')}`);
          comprehensiveResults[controllerName].extraMethods = extraMethods;
        }

        // Check for potential middleware methods
        const middlewareMethods = Object.getOwnPropertyNames(controller)
          .filter(name => 
            typeof controller[name] === 'function' &&
            (name.toLowerCase().includes('middleware') || 
             name.toLowerCase().includes('validate') ||
             name.toLowerCase().includes('sanitize'))
          );

        if (middlewareMethods.length > 0) {
          console.log(`   🛡️  Middleware methods: ${middlewareMethods.join(', ')}`);
          comprehensiveResults[controllerName].middlewareMethods = middlewareMethods;
        }

        const percentage = comprehensiveResults[controllerName].stats.implementationRate;
        console.log(`   📊 ${methodCount}/${config.expectedMethods.length} methods (${percentage}%)`);
        console.log(`   ⚡ ${asyncMethodCount} async methods`);

        if (methodCount !== config.expectedMethods.length) {
          allValid = false;
          comprehensiveResults[controllerName].valid = false;
        }

      } catch (error) {
        console.log(`   ❌ ${controllerName}: Failed to load - ${error.message}`);
        allValid = false;
        comprehensiveResults[controllerName] = { 
          valid: false, 
          error: error.message,
          stack: error.stack,
          methods: {},
          stats: { implementationRate: 0 }
        };
      }
    }

    this.validationResults = comprehensiveResults;
    return { allValid, results: comprehensiveResults };
  }

  inferSignature(method) {
    if (typeof method !== 'function') return null;
    
    const params = [];
    const methodString = method.toString();
    
    // Simple parameter extraction
    const paramMatch = methodString.match(/\(([^)]*)\)/);
    if (paramMatch) {
      params.push(...paramMatch[1].split(',').map(p => p.trim()).filter(p => p));
    }
    
    return {
      parameterCount: method.length,
      parameters: params,
      isAsync: method.constructor.name === 'AsyncFunction'
    };
  }

  // Enhanced Route-Controller Mapping Validation
  validateRouteControllerMapping() {
    console.log('\n🔄 ENHANCED ROUTE-CONTROLLER MAPPING VALIDATION');
    console.log('='.repeat(60));

    const routeMappings = {
      // Admin Routes
      'GET /api/admin/dashboard': ['adminController', 'getDashboardData'],
      'GET /api/admin/analytics/connections': ['adminController', 'getConnectionAnalytics'],
      'GET /api/admin/analytics/ranking': ['rankingController', 'getRankingAnalytics'],
      'GET /api/admin/users': ['adminController', 'getUserManagement'],
      'PUT /api/admin/users/:userId/status': ['adminController', 'updateUserStatus'],
      'POST /api/admin/profile-owners/:profileOwnerId/verify': ['adminController', 'verifyProfileOwner'],
      'GET /api/admin/statistics': ['adminController', 'getPlatformStatistics'],
      
      // Ranking Routes
      'GET /api/admin/ranking-criteria': ['rankingController', 'getRankingCriteria'],
      'POST /api/admin/ranking-criteria': ['rankingController', 'createRankingCriteria'],
      'PUT /api/admin/ranking-criteria/:id': ['rankingController', 'updateRankingCriteria'],
      'DELETE /api/admin/ranking-criteria/:id': ['rankingController', 'deleteRankingCriteria'],
      'POST /api/admin/ranking/recalculate': ['rankingController', 'triggerRankingRecalculation'],
      'GET /api/admin/ranking/leaderboard': ['rankingController', 'getRankingLeaderboard'],
      
      // Auth Routes
      'POST /api/auth/login': ['authController', 'login'],
      'POST /api/auth/register': ['authController', 'register'],
      'POST /api/auth/forgot-password': ['authController', 'forgotPassword'],
      'POST /api/auth/reset-password': ['authController', 'resetPassword'],
      'POST /api/auth/refresh-token': ['authController', 'refreshToken'],
      'POST /api/auth/logout': ['authController', 'logout'],
      'POST /api/auth/verify-email': ['authController', 'verifyEmail'],
      
      // Profile Owner Routes
      'GET /api/profile-owners': ['profileOwnerController', 'getAllProfileOwners'],
      'GET /api/profile-owners/:id': ['profileOwnerController', 'getProfileOwner'],
      'POST /api/profile-owners': ['profileOwnerController', 'createProfileOwner'],
      'PUT /api/profile-owners/:id': ['profileOwnerController', 'updateProfileOwner'],
      'DELETE /api/profile-owners/:id': ['profileOwnerController', 'deleteProfileOwner'],
      'POST /api/profile-owners/:id/documents': ['profileOwnerController', 'uploadDocuments'],
      'POST /api/profile-owners/:id/moodle-link': ['profileOwnerController', 'linkMoodleAccount'],
      'GET /api/profile-owners/:id/ranking': ['profileOwnerController', 'getRankingDetails'],
      'PUT /api/profile-owners/:id/availability': ['profileOwnerController', 'setAvailability'],
      'GET /api/profile-owners/:id/connections': ['profileOwnerController', 'getConnectionHistory'],
      'PUT /api/profile-owners/:id/pricing': ['profileOwnerController', 'updatePricing'],
      
      // Client Routes
      'GET /api/clients/profile': ['clientController', 'getProfile'],
      'PUT /api/clients/profile': ['clientController', 'updateProfile'],
      'GET /api/clients/connections': ['clientController', 'getConnections'],
      'POST /api/clients/search': ['clientController', 'searchProfiles'],
      'POST /api/clients/connections': ['clientController', 'createConnection'],
      'POST /api/clients/feedback': ['clientController', 'provideFeedback'],
      
      // Search Routes
      'POST /api/search/profiles': ['searchController', 'searchProfiles'],
      'GET /api/search/best-matches/:queryId': ['searchController', 'getBestMatches'],
      'GET /api/search/categories': ['searchController', 'getCategories'],
      'GET /api/search/skills': ['searchController', 'getSkills'],
      'GET /api/search/suggestions': ['searchController', 'getSearchSuggestions'],
      'POST /api/search/save': ['searchController', 'saveSearchQuery'],
      'GET /api/search/history': ['searchController', 'getSearchHistory'],
      
      // Connection Routes
      'POST /api/connections': ['connectionController', 'createConnection'],
      'GET /api/connections': ['connectionController', 'getConnections'],
      'PUT /api/connections/:id/status': ['connectionController', 'updateConnectionStatus'],
      'GET /api/connections/:id': ['connectionController', 'getConnectionDetails'],
      'POST /api/connections/:id/notes': ['connectionController', 'addConnectionNotes'],
      
      // Notification Routes
      'GET /api/notifications': ['notificationController', 'getNotifications'],
      'PUT /api/notifications/:id/read': ['notificationController', 'markAsRead'],
      'DELETE /api/notifications/:id': ['notificationController', 'deleteNotification'],
      'GET /api/notifications/unread-count': ['notificationController', 'getUnreadCount'],
      'PUT /api/notifications/preferences': ['notificationController', 'updatePreferences']
    };

    let mappingValid = true;
    const mappingResults = {};

    Object.entries(routeMappings).forEach(([route, [controllerName, methodName]]) => {
      const controller = this.validationResults[controllerName];
      const methodExists = controller?.methods?.[methodName]?.exists === true;
      const methodInfo = controller?.methods?.[methodName];
      
      mappingResults[route] = {
        controller: controllerName,
        method: methodName,
        exists: methodExists,
        methodInfo: methodInfo
      };

      const status = methodExists ? '✅' : '❌';
      const methodType = methodExists ? methodInfo.type : 'MISSING';
      const asyncIndicator = methodExists && methodInfo.isAsync ? '⚡' : '';
      
      console.log(`${status} ${route} -> ${controllerName}.${methodName}() [${methodType}]${asyncIndicator}`);
      
      if (!methodExists) mappingValid = false;
    });

    this.routeCoverage = mappingResults;
    return { mappingValid, results: mappingResults };
  }

  // Enhanced Middleware Validation
  validateMiddlewareExports() {
    console.log('\n🛡️  ENHANCED MIDDLEWARE VALIDATION');
    console.log('='.repeat(60));

    const middlewareConfig = {
      auth: {
        path: './middleware/auth',
        expectedMethods: [
          'authenticateToken',
          'requireRole',
          'requireAdmin',
          'requireProfileOwner',
          'requireClient',
          'optionalAuth',
          'refreshTokenIfExpired'
        ]
      },
      validation: {
        path: './middleware/validation',
        expectedMethods: [
          'validateRequestBody',
          'validateQueryParams',
          'validateRouteParams',
          'sanitizeInput',
          'validateFileUpload'
        ]
      },
      rateLimit: {
        path: './middleware/rateLimit',
        expectedMethods: [
          'generalLimiter',
          'authLimiter',
          'apiLimiter',
          'searchLimiter'
        ]
      },
      errorHandler: {
        path: './middleware/errorHandler',
        expectedMethods: [
          'handleValidationError',
          'handleAuthError',
          'handleDatabaseError',
          'handleExternalServiceError',
          'logError'
        ]
      }
    };

    let middlewareValid = true;
    const middlewareResults = {};

    for (const [middlewareName, config] of Object.entries(middlewareConfig)) {
      try {
        console.log(`\n📦 Validating ${middlewareName} middleware...`);
        
        // delete require.cache[/* require.resolve(...) */];
        const middleware = require(config.path);

        middlewareResults[middlewareName] = { valid: true, methods: {} };

        config.expectedMethods.forEach(methodName => {
          const method = middleware[methodName];
          const methodType = typeof method;
          const exists = methodType === 'function';
          const isMiddleware = exists && method.length >= 3; // req, res, next
          
          middlewareResults[middlewareName].methods[methodName] = {
            exists,
            type: methodType,
            isMiddleware,
            parameterCount: exists ? method.length : 0
          };

          const status = exists ? '✅' : '❌';
          const middlewareIndicator = isMiddleware ? '🛡️' : '⚠️';
          console.log(`   ${status} ${middlewareIndicator} ${methodName}: ${methodType} (${exists ? method.length : 0} params)`);
          
          if (!exists) middlewareValid = false;
        });

      } catch (error) {
        console.log(`   ❌ ${middlewareName}: Failed to load - ${error.message}`);
        middlewareValid = false;
        middlewareResults[middlewareName] = { 
          valid: false, 
          error: error.message,
          methods: {}
        };
      }
    }

    return { middlewareValid, results: middlewareResults };
  }

  // Generate Comprehensive Validation Report
  generateValidationReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE VALIDATION REPORT');
    console.log('='.repeat(60));

    const { allValid: controllersValid, results: controllerResults } = this.validateControllerExports();
    const { mappingValid: routesValid, results: routeResults } = this.validateRouteControllerMapping();
    const { middlewareValid, results: middlewareResults } = this.validateMiddlewareExports();

    // Controller Statistics
    console.log('\n🎯 CONTROLLER STATISTICS');
    console.log('-'.repeat(40));
    
    let totalMethods = 0;
    let implementedMethods = 0;
    let asyncMethods = 0;

    Object.entries(controllerResults).forEach(([controllerName, result]) => {
      if (result.stats) {
        totalMethods += result.stats.totalMethods;
        implementedMethods += result.stats.implementedMethods;
        asyncMethods += result.stats.asyncMethods;
        
        const status = result.valid ? '✅' : '❌';
        console.log(`${status} ${controllerName.padEnd(25)}: ${result.stats.implementationRate.toString().padStart(3)}% (${result.stats.implementedMethods}/${result.stats.totalMethods})`);
      }
    });

    const overallImplementationRate = Math.round((implementedMethods / totalMethods) * 100);
    console.log(`\n📈 Overall Implementation: ${overallImplementationRate}% (${implementedMethods}/${totalMethods} methods)`);
    console.log(`⚡ Async Methods: ${asyncMethods}`);
    console.log(`🔄 Sync Methods: ${implementedMethods - asyncMethods}`);

    // Route Coverage Analysis
    console.log('\n🔄 ROUTE COVERAGE ANALYSIS');
    console.log('-'.repeat(40));
    
    const totalRoutes = Object.keys(routeResults).length;
    const coveredRoutes = Object.values(routeResults).filter(r => r.exists).length;
    const routeCoverageRate = Math.round((coveredRoutes / totalRoutes) * 100);
    
    console.log(`📍 Total Routes: ${totalRoutes}`);
    console.log(`✅ Covered Routes: ${coveredRoutes}`);
    console.log(`❌ Missing Routes: ${totalRoutes - coveredRoutes}`);
    console.log(`📊 Coverage Rate: ${routeCoverageRate}%`);

    // Middleware Status
    console.log('\n🛡️  MIDDLEWARE STATUS');
    console.log('-'.repeat(40));
    
    const totalMiddleware = Object.keys(middlewareResults).length;
    const validMiddleware = Object.values(middlewareResults).filter(m => m.valid).length;
    
    console.log(`📦 Total Middleware: ${totalMiddleware}`);
    console.log(`✅ Valid Middleware: ${validMiddleware}`);
    console.log(`❌ Invalid Middleware: ${totalMiddleware - validMiddleware}`);

    // Final Validation Result
    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL VALIDATION RESULTS');
    console.log('='.repeat(60));

    const allSystemsGo = controllersValid && routesValid && middlewareValid;

    if (allSystemsGo) {
      console.log('✅ ALL SYSTEMS GO! Enterprise validation passed successfully.');
      console.log('🚀 Server is ready for production deployment!');
    } else {
      console.log('❌ VALIDATION FAILED! Issues detected in the following areas:');
      
      if (!controllersValid) console.log('   • Controller exports');
      if (!routesValid) console.log('   • Route-controller mappings');
      if (!middlewareValid) console.log('   • Middleware exports');
      
      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('   1. Check controller file paths and exports');
      console.log('   2. Verify all required methods are implemented');
      console.log('   3. Ensure route mappings are correct');
      console.log('   4. Validate middleware function signatures');
      console.log('   5. Run unit tests for critical components');
      
      // Show specific missing methods
      console.log('\n🔍 MISSING CRITICAL METHODS:');
      Object.entries(controllerResults).forEach(([controllerName, result]) => {
        if (!result.valid && result.methods) {
          const missingMethods = Object.entries(result.methods)
            .filter(([method, info]) => !info.exists)
            .map(([method]) => method);
          
          if (missingMethods.length > 0) {
            console.log(`   📦 ${controllerName}: ${missingMethods.join(', ')}`);
          }
        }
      });
    }

    console.log('\n' + '='.repeat(60));

    return {
      allSystemsGo,
      summary: {
        controllers: {
          valid: controllersValid,
          implementationRate: overallImplementationRate,
          totalMethods,
          implementedMethods
        },
        routes: {
          valid: routesValid,
          coverageRate: routeCoverageRate,
          totalRoutes,
          coveredRoutes
        },
        middleware: {
          valid: middlewareValid,
          totalMiddleware,
          validMiddleware
        }
      },
      details: {
        controllers: controllerResults,
        routes: routeResults,
        middleware: middlewareResults
      }
    };
  }

  // Export validation results for external use
  exportValidationResults() {
    const report = this.generateValidationReport();
    
    // Save to file for CI/CD integration
    if (process.env.NODE_ENV === 'production') {
      import fs from 'fs';
      const reportPath = './validation-report.json';
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n💾 Validation report saved to: ${reportPath}`);
    }
    
    return report;
  }
}

// Enhanced Model Validation
const validateModels = () => {
  console.log('\n🗄️  ENHANCED MODEL VALIDATION');
  console.log('='.repeat(50));
  
  try {
    import models from './models.js';
    const modelNames = Object.keys(models).filter(key => 
      !['sequelize', 'Sequelize', 'Op'].includes(key)
    );
    
    console.log(`✅ ${modelNames.length} models loaded successfully:`);
    
    modelNames.forEach(modelName => {
      const model = models[modelName];
      const attributes = Object.keys(model.rawAttributes || {});
      const associations = Object.keys(model.associations || {});
      
      console.log(`   📊 ${modelName}`);
      console.log(`      📝 Attributes: ${attributes.length}`);
      console.log(`      🔗 Associations: ${associations.length}`);
      
      if (associations.length > 0) {
        console.log(`      👥 Related: ${associations.join(', ')}`);
      }
    });
    
    // Check basic model functionality
    if (models.sequelize) {
      console.log(`   🔗 Sequelize instance: ${typeof models.sequelize}`);
      console.log(`   💾 Database: ${models.sequelize.config.database}`);
      console.log(`   🏠 Host: ${models.sequelize.config.host}`);
    }
    
    return { valid: true, modelCount: modelNames.length };
    
  } catch (error) {
    console.log(`❌ Model validation failed: ${error.message}`);
    return { valid: false, error: error.message };
  }
};

// Main validation execution with enhanced error handling
const runComprehensiveValidation = () => {
  try {
    console.log('🚀 STARTING ENTERPRISE COMPREHENSIVE VALIDATION...\n');
    
    const validationSystem = new ControllerValidationSystem();
    const validationReport = validationSystem.exportValidationResults();
    
    // Additional model validation
    const modelValidation = validateModels();
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 VALIDATION COMPLETE');
    console.log('='.repeat(60));
    
    const overallStatus = validationReport.allSystemsGo && modelValidation.valid;
    
    if (overallStatus) {
      console.log('🎉 ALL VALIDATIONS PASSED! System is ready for deployment.');
      console.log('\n📦 Validation Summary:');
      console.log(`   ✅ Controllers: ${validationReport.summary.controllers.implementationRate}% implemented`);
      console.log(`   ✅ Routes: ${validationReport.summary.routes.coverageRate}% covered`);
      console.log(`   ✅ Middleware: ${validationReport.summary.middleware.validMiddleware}/${validationReport.summary.middleware.totalMiddleware} valid`);
      console.log(`   ✅ Models: ${modelValidation.modelCount} models loaded`);
      
      return true;
    } else {
      console.log('⚠️  VALIDATION COMPLETED WITH ISSUES');
      console.log('💡 Server will start, but some features may not work properly.');
      
      return false;
    }
    
  } catch (error) {
    console.error('💥 CRITICAL VALIDATION ERROR:', error);
    console.log('❌ Validation system failed. Please check the validation setup.');
    
    // Don't crash the server, just warn
    console.log('⚠️  Server will start anyway, but validation is incomplete.');
    return false;
  }
};

// Export for use in server.js
export {
ControllerValidationSystem,
  runComprehensiveValidation,
  validateModels
};

// Auto-run if this file is executed directly
if (require.main === module) {
  runComprehensiveValidation();
}

export {
ControllerValidationSystem
};