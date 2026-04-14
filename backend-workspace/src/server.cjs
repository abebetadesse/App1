// backend/server.cjs
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// const responseTime = require('response-time'); // Uncomment if installed
const prometheus = require('prom-client');
const cluster = require('cluster');
const os = require('os');
const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// ==================================================
// ENHANCED ENVIRONMENT CONFIGURATION (same as before)
// ==================================================

// Cache environment variables to avoid repeated process.env calls
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3005,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT) || 3306,
  DB_NAME: process.env.DB_NAME || 'tham_platform',
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET,
  ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST,
  REDIS_HOST: process.env.REDIS_HOST,
  MOODLE_API_TOKEN: process.env.MOODLE_API_TOKEN,
  ENABLE_METRICS: process.env.ENABLE_METRICS === 'true',
  REQUEST_LOGGING: process.env.REQUEST_LOGGING !== 'false',

  // Payment Gateway Configurations
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY,

  // External Service Configurations
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // AI Service Configurations
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5153',
    'http://localhost:3001',
    'https://thamplatform.com',
    'capacitor://localhost',
    'ionic://localhost'
  ]
};

// Pre-defined configuration objects
const SYNC_CONFIG = {
  development: { alter: true, force: false },
  test: { alter: false, force: true },
  production: { alter: false, force: false }
};

const REQUIRED_ENV_VARS = [
  'NODE_ENV', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'JWT_SECRET'
];

const OPTIONAL_ENV_VARS = [
  'ELASTICSEARCH_HOST', 'REDIS_HOST', 'MOODLE_API_TOKEN',
  'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY',
  'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'FCM_SERVER_KEY',
  'STRIPE_SECRET_KEY', 'PAYPAL_CLIENT_ID', 'CHAPA_SECRET_KEY',
  'SENDGRID_API_KEY', 'TWILIO_ACCOUNT_SID', 'GOOGLE_MAPS_API_KEY',
  'OPENAI_API_KEY', 'GEMINI_API_KEY'
];

// Pre-defined health endpoints
const HEALTH_ENDPOINTS = [
  { path: '/health', description: 'Basic server status' },
  { path: '/health/db', description: 'Database connectivity' },
  { path: '/health/elasticsearch', description: 'Elasticsearch status' },
  { path: '/health/redis', description: 'Redis connectivity' },
  { path: '/health/advanced', description: 'Advanced service status' },
  { path: '/health/features', description: 'Feature flags status' }
];

// ==================================================
// HELPER FUNCTIONS (implement missing ones)
// ==================================================

const validateEnvironment = () => {
  console.log('🔧 ENVIRONMENT CONFIGURATION');
  console.log('='.repeat(50));

  let configValid = true;
  const results = { required: [], optional: [] };

  REQUIRED_ENV_VARS.forEach(envVar => {
    const value = process.env[envVar];
    const isSet = !!value;
    const displayValue = (envVar.includes('PASSWORD') || envVar.includes('SECRET')) && value
      ? '***' + value.slice(-4)
      : value;

    results.required.push({ envVar, isSet, displayValue });
    if (!isSet) configValid = false;
  });

  OPTIONAL_ENV_VARS.forEach(envVar => {
    const value = process.env[envVar];
    const isSet = !!value;
    const displayValue = (envVar.includes('KEY') || envVar.includes('SECRET') || envVar.includes('TOKEN')) && value
      ? '***' + value.slice(-4)
      : value;

    results.optional.push({ envVar, isSet, displayValue });
  });

  console.log('\n📋 Required Environment Variables:');
  results.required.forEach(({ envVar, isSet, displayValue }) => {
    console.log(`   ${isSet ? '✅' : '❌'} ${envVar}: ${isSet ? displayValue : 'MISSING'}`);
  });

  console.log('\n📋 Optional Environment Variables:');
  results.optional.forEach(({ envVar, isSet, displayValue }) => {
    console.log(`   ${isSet ? '✅' : '⚠️'} ${envVar}: ${isSet ? displayValue : 'Not set (optional)'}`);
  });

  console.log('\n🗄️  Database Configuration:');
  console.log(`   Host: ${ENV.DB_HOST}`);
  console.log(`   Port: ${ENV.DB_PORT}`);
  console.log(`   Database: ${ENV.DB_NAME}`);
  console.log(`   User: ${ENV.DB_USERNAME}`);

  console.log('\n🌐 External Services Status:');
  console.log(`   Elasticsearch: ${ENV.ELASTICSEARCH_HOST ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Redis: ${ENV.REDIS_HOST ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Moodle LMS: ${ENV.MOODLE_API_TOKEN ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Push Notifications: ${process.env.VAPID_PUBLIC_KEY ? '✅ Configured' : '❌ Not configured'}`);

  return configValid;
};

const initializeDatabase = async () => {
  console.log('\n🗄️  DATABASE INITIALIZATION');
  console.log('='.repeat(50));

  try {
    const { sequelize } = require('./models'); // adjust path if needed

    const connectionPromise = sequelize.authenticate();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 15000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Database connection established successfully');

    const [results] = await sequelize.query('SELECT version() as version');
    console.log(`   Database Version: ${results[0].version}`);

    const strategy = SYNC_CONFIG[ENV.NODE_ENV] || SYNC_CONFIG.development;
    console.log(`\n🔄 Database Sync Strategy (${ENV.NODE_ENV}):`);
    console.log(`   Alter: ${strategy.alter ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   Force: ${strategy.force ? '⚠️  ENABLED (WILL DROP ALL TABLES)' : '✅ Safe'}`);

    if (strategy.force && ENV.NODE_ENV === 'production') {
      throw new Error('Force sync not allowed in production');
    }

    if (ENV.NODE_ENV !== 'production' || strategy.alter) {
      await sequelize.sync(strategy);
      console.log('✅ Database synchronized successfully');
    } else {
      console.log('✅ Database sync skipped (production mode)');
    }

    if (ENV.NODE_ENV === 'development') {
      try {
        const { User, ProfileOwner, Client, Connection } = require('./models');
        const [userCount, profileOwnerCount, clientCount, connectionCount] = await Promise.all([
          User.count(),
          ProfileOwner.count(),
          Client.count(),
          Connection.count()
        ]);

        console.log('\n📊 Initial Database Counts:');
        console.log(`   Users: ${userCount}`);
        console.log(`   Profile Owners: ${profileOwnerCount}`);
        console.log(`   Clients: ${clientCount}`);
        console.log(`   Connections: ${connectionCount}`);
      } catch (countError) {
        console.log('   📊 Count stats: Unable to retrieve (tables may be empty)');
      }
    }

    return sequelize;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

const initializeElasticsearch = async () => {
  if (!ENV.ELASTICSEARCH_HOST) {
    console.log('\n🔍 Elasticsearch: ❌ Not configured - skipping');
    return false;
  }

  console.log('\n🔍 ELASTICSEARCH INITIALIZATION');
  console.log('='.repeat(50));

  try {
    // Lazy load Elasticsearch service – ensure module exists
    let elasticsearchService;
    try {
      elasticsearchService = require('./services/ElasticsearchService');
    } catch (e) {
      console.log('   ⚠️  Elasticsearch service module not found, skipping');
      return false;
    }
    await elasticsearchService.initialize();
    await elasticsearchService.syncElasticsearch();

    console.log('✅ Elasticsearch synchronized successfully');
    console.log(`   Host: ${ENV.ELASTICSEARCH_HOST}`);
    console.log(`   Port: ${process.env.ELASTICSEARCH_PORT || 9200}`);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch initialization failed:', error.message);
    if (ENV.NODE_ENV === 'production') {
      throw error;
    } else {
      console.log('   ⚠️  Continuing without Elasticsearch (development mode)');
      return false;
    }
  }
};

const initializeRedis = async () => {
  if (!ENV.REDIS_HOST) {
    console.log('\n🔴 Redis: ❌ Not configured - skipping');
    return null;
  }

  console.log('\n🔴 REDIS INITIALIZATION');
  console.log('='.repeat(50));

  try {
    const Redis = require('ioredis');
    const redis = new Redis({
      host: ENV.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true
    });

    await redis.ping();
    console.log('✅ Redis connection established successfully');
    return redis;
  } catch (error) {
    console.error('❌ Redis initialization failed:', error.message);
    if (ENV.NODE_ENV === 'production') {
      throw error;
    } else {
      console.log('   ⚠️  Continuing without Redis (development mode)');
      return null;
    }
  }
};

const initializeMonitoring = (app) => {
  console.log('\n📊 PERFORMANCE MONITORING');
  console.log('='.repeat(50));

  console.log(`   ${ENV.ENABLE_METRICS ? '✅' : '⚠️'} Metrics collection: ${ENV.ENABLE_METRICS ? 'enabled' : 'disabled'}`);
  console.log(`   ${ENV.REQUEST_LOGGING ? '✅' : '❌'} Request logging: ${ENV.REQUEST_LOGGING ? 'enabled' : 'disabled'}`);

  if (ENV.ENABLE_METRICS) {
    const collectDefaultMetrics = prometheus.collectDefaultMetrics;
    collectDefaultMetrics({ timeout: 5000 });

    // Basic metrics
    const httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5]
    });

    app.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', prometheus.register.contentType);
        const metrics = await prometheus.register.metrics();
        res.end(metrics);
      } catch (error) {
        res.status(500).json({ error: 'Metrics collection failed' });
      }
    });

    console.log('   📈 Prometheus endpoint: /metrics');
  }
};

const registerHealthChecks = (app, serviceManager) => {
  console.log('\n❤️  HEALTH CHECK ENDPOINTS');
  console.log('='.repeat(50));

  HEALTH_ENDPOINTS.forEach(endpoint => {
    console.log(`   ✅ ${endpoint.path} - ${endpoint.description}`);
  });

  app.get('/health', async (req, res) => {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: ENV.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        services: serviceManager.getServiceStatus ? serviceManager.getServiceStatus() : {},
        system: {
          memory: process.memoryUsage(),
          pid: process.pid
        }
      };

      const unhealthyServices = Object.values(healthData.services).filter(s => s !== 'healthy').length;
      healthData.status = unhealthyServices > 0 ? 'degraded' : 'healthy';
      healthData.unhealthyServices = unhealthyServices;

      res.status(unhealthyServices > 2 ? 503 : 200).json(healthData);
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message, timestamp: new Date().toISOString() });
    }
  });

  app.get('/health/advanced', async (req, res) => {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
      services: serviceManager.getServiceStatus ? serviceManager.getServiceStatus() : {},
      real_time: {
        connections: global.io?.engine?.clientsCount || 0,
        rooms: global.io?.sockets?.adapter?.rooms?.size || 0
      },
      features: {
        real_time: true,
        push_notifications: !!process.env.VAPID_PUBLIC_KEY,
        mobile_support: true,
        ai_services: true
      }
    };
    res.json(healthData);
  });
};

const setupGlobalErrorHandling = () => {
  let lastErrorLog = 0;
  const errorLogCooldown = 1000;

  process.on('unhandledRejection', (reason, promise) => {
    const now = Date.now();
    if (now - lastErrorLog < errorLogCooldown) return;
    lastErrorLog = now;

    console.error('🚨 Unhandled Promise Rejection:');
    console.error('   Reason:', reason instanceof Error ? reason.message : reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:');
    console.error('   Error:', error.message);

    if (ENV.NODE_ENV === 'production') {
      console.log('   🛑 Initiating emergency shutdown...');
      process.exit(1);
    }
  });
};

// Analytics endpoint – accepts POST requests and returns 200 OK
app.post('/analytics', (req, res) => {
  // Optional: log the received data
  console.log('📊 Analytics data received:', req.body);
  res.status(200).json({ success: true, message: 'Analytics recorded' });
});
// ==================================================
// PAYMENT SERVICE INTEGRATIONS
// ==================================================

class PaymentServiceManager {
  constructor() {
    this.providers = new Map();
    this.webhookHandlers = new Map();
  }

  async initializePaymentProviders() {
    console.log('\n💳 PAYMENT PROVIDER INITIALIZATION');
    console.log('='.repeat(50));

    const providers = [
      {
        name: 'stripe',
        enabled: !!ENV.STRIPE_SECRET_KEY,
        init: this.initializeStripe.bind(this)
      },
      {
        name: 'paypal',
        enabled: !!ENV.PAYPAL_CLIENT_ID,
        init: this.initializePayPal.bind(this)
      },
      {
        name: 'chapa',
        enabled: !!ENV.CHAPA_SECRET_KEY,
        init: this.initializeChapa.bind(this)
      }
    ];

    for (const provider of providers) {
      if (provider.enabled) {
        try {
          await provider.init();
          console.log(`✅ ${provider.name.toUpperCase()} - Initialized successfully`);
        } catch (error) {
          console.error(`❌ ${provider.name.toUpperCase()} - Initialization failed:`, error.message);
        }
      } else {
        console.log(`⚠️ ${provider.name.toUpperCase()} - Not configured (skipping)`);
      }
    }
  }

  initializeStripe() {
    const stripe = require('stripe')(ENV.STRIPE_SECRET_KEY);
    this.providers.set('stripe', stripe);
    this.webhookHandlers.set('stripe', this.handleStripeWebhook.bind(this));
    return stripe;
  }

  async initializePayPal() {
    const paypal = require('@paypal/checkout-server-sdk');
    const environment = new paypal.core.SandboxEnvironment(ENV.PAYPAL_CLIENT_ID, ENV.PAYPAL_CLIENT_SECRET);
    const client = new paypal.core.PayPalHttpClient(environment);
    this.providers.set('paypal', client);
    return client;
  }

  initializeChapa() {
    const chapaConfig = {
      secretKey: ENV.CHAPA_SECRET_KEY,
      baseUrl: 'https://api.chapa.co/v1'
    };
    this.providers.set('chapa', chapaConfig);
    return chapaConfig;
  }

  async createPaymentIntent(provider, paymentData) {
    const paymentProvider = this.providers.get(provider);
    if (!paymentProvider) throw new Error(`Payment provider ${provider} not available`);

    switch (provider) {
      case 'stripe':
        return await this.createStripePaymentIntent(paymentProvider, paymentData);
      case 'paypal':
        return await this.createPayPalOrder(paymentProvider, paymentData);
      case 'chapa':
        return await this.createChapaPayment(paymentProvider, paymentData);
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  async createStripePaymentIntent(stripe, paymentData) {
    const { amount, currency, customerId, metadata } = paymentData;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      customer: customerId,
      metadata: metadata || {},
      automatic_payment_methods: { enabled: true },
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    };
  }

  async createPayPalOrder(paypalClient, paymentData) {
    const { amount, currency, items } = paymentData;
    const paypal = require('@paypal/checkout-server-sdk');
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: currency || 'USD', value: amount.toString() },
        items: items || []
      }]
    });
    const response = await paypalClient.execute(request);
    return {
      orderId: response.result.id,
      status: response.result.status,
      links: response.result.links
    };
  }

  async createChapaPayment(chapaConfig, paymentData) {
    const { amount, currency, email, firstName, lastName, tx_ref } = paymentData;
    const response = await axios.post(
      `${chapaConfig.baseUrl}/transaction/initialize`,
      {
        amount: amount.toString(),
        currency: currency || 'ETB',
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: tx_ref || uuidv4(),
        callback_url: `${process.env.API_BASE_URL}/webhooks/chapa`,
        return_url: `${process.env.CLIENT_BASE_URL}/payment/success`
      },
      { headers: { Authorization: `Bearer ${chapaConfig.secretKey}`, 'Content-Type': 'application/json' } }
    );
    return {
      checkoutUrl: response.data.data.checkout_url,
      transactionId: response.data.data.id,
      status: 'pending'
    };
  }

  async handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = this.providers.get('stripe').webhooks.constructEvent(req.rawBody, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  }

  async handlePaymentSuccess(paymentIntent) {
    const { PaymentTransaction } = require('./models');
    await PaymentTransaction.update(
      { status: 'completed', processedAt: new Date() },
      { where: { externalTransactionId: paymentIntent.id } }
    );
    this.triggerPostPaymentActions(paymentIntent.metadata);
  }

  async handlePaymentFailure(paymentIntent) {
    const { PaymentTransaction } = require('./models');
    await PaymentTransaction.update(
      { status: 'failed', errorMessage: paymentIntent.last_payment_error?.message },
      { where: { externalTransactionId: paymentIntent.id } }
    );
  }

  triggerPostPaymentActions(metadata) {
    // Optional: notify profile owner
    if (metadata.connectionId) {
      try {
        const notificationService = require('./services/NotificationService');
        if (notificationService && notificationService.notifyPaymentSuccess) {
          notificationService.notifyPaymentSuccess(metadata.connectionId);
        }
      } catch (e) { /* ignore */ }
    }
  }
}

// ==================================================
// EXTERNAL SERVICE INTEGRATIONS
// ==================================================

class ExternalServiceManager {
  constructor() {
    this.services = new Map();
  }

  async initializeExternalServices() {
    console.log('\n🌐 EXTERNAL SERVICE INITIALIZATION');
    console.log('='.repeat(50));

    const services = [
      {
        name: 'email',
        enabled: !!ENV.SENDGRID_API_KEY,
        init: this.initializeEmailService.bind(this)
      },
      {
        name: 'sms',
        enabled: !!ENV.TWILIO_ACCOUNT_SID,
        init: this.initializeSMSService.bind(this)
      },
      {
        name: 'cloud_storage',
        enabled: !!ENV.CLOUDINARY_CLOUD_NAME,
        init: this.initializeCloudStorage.bind(this)
      },
      {
        name: 'maps',
        enabled: !!ENV.GOOGLE_MAPS_API_KEY,
        init: this.initializeMapsService.bind(this)
      },
      {
        name: 'ai_services',
        enabled: !!ENV.OPENAI_API_KEY || !!ENV.GEMINI_API_KEY,
        init: this.initializeAIServices.bind(this)
      }
    ];

    for (const service of services) {
      if (service.enabled) {
        try {
          await service.init();
          console.log(`✅ ${service.name.toUpperCase()} - Initialized successfully`);
        } catch (error) {
          console.error(`❌ ${service.name.toUpperCase()} - Initialization failed:`, error.message);
        }
      } else {
        console.log(`⚠️ ${service.name.toUpperCase()} - Not configured (skipping)`);
      }
    }
  }

  initializeEmailService() {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(ENV.SENDGRID_API_KEY);
    this.services.set('email', sgMail);
    return sgMail;
  }

  initializeSMSService() {
    const twilio = require('twilio')(ENV.TWILIO_ACCOUNT_SID, ENV.TWILIO_AUTH_TOKEN);
    this.services.set('sms', twilio);
    return twilio;
  }

  initializeCloudStorage() {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_API_SECRET
    });
    this.services.set('cloud_storage', cloudinary);
    return cloudinary;
  }

  initializeMapsService() {
    const { Client } = require('@googlemaps/google-maps-services-js');
    const googleMapsClient = new Client({});
    this.services.set('maps', { client: googleMapsClient, apiKey: ENV.GOOGLE_MAPS_API_KEY });
    return googleMapsClient;
  }

  initializeAIServices() {
    const aiServices = {};
    if (ENV.OPENAI_API_KEY) {
      const { OpenAI } = require('openai');
      aiServices.openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY });
    }
    if (ENV.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      aiServices.gemini = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    }
    this.services.set('ai_services', aiServices);
    return aiServices;
  }

  async sendEmail(template, data) {
    const sgMail = this.services.get('email');
    if (!sgMail) throw new Error('Email service not configured');
    const msg = {
      to: data.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@thamplatform.com',
      templateId: template,
      dynamic_template_data: data
    };
    await sgMail.send(msg);
  }

  async sendSMS(to, message) {
    const twilio = this.services.get('sms');
    if (!twilio) throw new Error('SMS service not configured');
    return await twilio.messages.create({ body: message, from: ENV.TWILIO_PHONE_NUMBER, to });
  }

  async uploadToCloudinary(file, options = {}) {
    const cloudinary = this.services.get('cloud_storage');
    if (!cloudinary) throw new Error('Cloud storage not configured');
    return await cloudinary.uploader.upload(file, { folder: 'tham-platform', resource_type: 'auto', ...options });
  }

  async geocodeAddress(address) {
    const mapsService = this.services.get('maps');
    if (!mapsService) throw new Error('Maps service not configured');
    const response = await mapsService.client.geocode({ params: { address, key: mapsService.apiKey } });
    return response.data.results[0];
  }

  async generateAIContent(provider, prompt, options = {}) {
    const aiServices = this.services.get('ai_services');
    if (!aiServices) throw new Error('AI services not configured');
    const aiService = aiServices[provider];
    if (!aiService) throw new Error(`AI provider ${provider} not configured`);

    switch (provider) {
      case 'openai':
        const completion = await aiService.chat.completions.create({
          model: options.model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options.max_tokens || 500,
          temperature: options.temperature || 0.7
        });
        return completion.choices[0].message.content;
      case 'gemini':
        const model = aiService.getGenerativeModel({ model: options.model || 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}

// ==================================================
// ENHANCED SERVICE MANAGER
// ==================================================

class EnhancedServiceManager {
  constructor() {
    this.services = new Map();
    this.healthStatus = new Map();
    this.paymentManager = new PaymentServiceManager();
    this.externalServiceManager = new ExternalServiceManager();
  }

  async initializeAllServices() {
    console.log('\n🚀 INITIALIZING ENHANCED SERVICES');
    console.log('='.repeat(50));

    const services = [
      { name: 'database', init: initializeDatabase, critical: true },
      { name: 'elasticsearch', init: initializeElasticsearch, critical: false },
      { name: 'redis', init: initializeRedis, critical: false },
      { name: 'payments', init: this.paymentManager.initializePaymentProviders.bind(this.paymentManager), critical: false },
      { name: 'external_services', init: this.externalServiceManager.initializeExternalServices.bind(this.externalServiceManager), critical: false },
      { name: 'realtime', init: this.initializeRealTimeServices.bind(this), critical: false },
      { name: 'push', init: this.initializePushServices.bind(this), critical: false }
    ];

    const criticalServices = services.filter(s => s.critical);
    const nonCriticalServices = services.filter(s => !s.critical);

    for (const service of criticalServices) {
      await this.initializeServiceWithRetry(service.name, service.init);
    }

    await Promise.allSettled(
      nonCriticalServices.map(service =>
        this.initializeServiceWithRetry(service.name, service.init)
      )
    );
  }

  async initializeServiceWithRetry(serviceName, initFunction, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await initFunction();
        console.log(`✅ ${serviceName} - Initialized successfully`);
        this.services.set(serviceName, result);
        this.healthStatus.set(serviceName, 'healthy');
        return result;
      } catch (error) {
        console.warn(`⚠️ ${serviceName} - Attempt ${attempt} failed:`, error.message);
        if (attempt === retries) {
          console.error(`🔴 ${serviceName} - All initialization attempts failed`);
          this.healthStatus.set(serviceName, 'unhealthy');
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  initializeRealTimeServices() {
    console.log('✅ Real-time services initialized');
    return true;
  }

  initializePushServices() {
    if (!process.env.VAPID_PUBLIC_KEY) {
      console.log('⚠️ Push services: Not configured - skipping');
      return null;
    }
    console.log('✅ Push services initialized');
    return true;
  }

  getServiceStatus() {
    return Object.fromEntries(this.healthStatus);
  }

  getPaymentManager() {
    return this.paymentManager;
  }

  getExternalServiceManager() {
    return this.externalServiceManager;
  }
}

// ==================================================
// ENHANCED ROUTE LOADING WITH PAYMENT & EXTERNAL ROUTES
// ==================================================

const loadEnhancedRoutes = (app) => {
  console.log('\n🔄 LOADING ENHANCED ROUTES');
  console.log('='.repeat(50));

  const routeDefinitions = [
    { path: '/api/v1/auth', module: './routes/auth', critical: true },
    { path: '/api/v1/profile-owners', module: './routes/profile-owners', critical: false },
    { path: '/api/v1/clients', module: './routes/clients', critical: false },
    { path: '/api/v1/search', module: './routes/search', critical: true },
    { path: '/api/v1/moodle', module: './routes/moodle', critical: false },
    { path: '/api/v1/admin', module: './routes/admin', critical: false },
    { path: '/api/v1/payments', module: './routes/payments', critical: false },
    { path: '/api/v1/notifications', module: './routes/notifications', critical: false },
    { path: '/api/v1/upload', module: './routes/upload', critical: false },
    { path: '/api/ai/chat', module: './routes/ai-chat', critical: false },
    { path: '/api/ai/voice', module: './routes/ai-voice', critical: false },
    { path: '/webhooks/stripe', module: './routes/webhooks/stripe', critical: false }
  ];

  routeDefinitions.forEach(({ path, module, critical }) => {
    try {
      const routeModule = require(module);
      app.use(path, routeModule);
      console.log(`✅ ${path} - Loaded successfully`);
    } catch (error) {
      if (critical) {
        console.error(`🔴 Critical route ${path} failed: ${error.message}`);
        // Fallback endpoint for critical routes
        app.use(path, (req, res) => {
          res.status(503).json({ error: 'Service temporarily unavailable', path, timestamp: new Date().toISOString() });
        });
      } else {
        console.warn(`⚠️ Non-critical route ${path} failed: ${error.message}`);
      }
    }
  });
};

// ==================================================
// ENHANCED MOBILE CONFIGURATION
// ==================================================

const setupMobileConfig = (app) => {
  app.get('/api/mobile/config', (req, res) => {
    const platform = req.headers['x-platform'] || 'web';
    const mobileConfig = {
      platform,
      features: {
        offline_mode: true,
        push_notifications: !!process.env.VAPID_PUBLIC_KEY,
        background_sync: true,
        deep_linking: true,
        payment_gateways: {
          stripe: !!ENV.STRIPE_SECRET_KEY,
          paypal: !!ENV.PAYPAL_CLIENT_ID,
          chapa: !!ENV.CHAPA_SECRET_KEY
        },
        external_services: {
          maps: !!ENV.GOOGLE_MAPS_API_KEY,
          cloud_storage: !!ENV.CLOUDINARY_CLOUD_NAME,
          ai_services: !!ENV.OPENAI_API_KEY || !!ENV.GEMINI_API_KEY
        }
      },
      api: {
        base_url: process.env.API_BASE_URL || `http://localhost:${ENV.PORT}`,
        timeout: 30000
      },
      real_time: { enabled: true, ping_interval: 25000 },
      payment_config: {
        default_currency: 'USD',
        supported_currencies: ['USD', 'ETB', 'EUR'],
        minimum_amount: 1.00
      }
    };
    res.json(mobileConfig);
  });
};

// ==================================================
// ENHANCED REAL-TIME FEATURES WITH PAYMENT SUPPORT
// ==================================================

const setupRealTime = (server, io) => {
  io.on('connection', (socket) => {
    console.log(`🔗 Client connected: ${socket.id}`);

    socket.on('authenticate', async (token) => {
      try {
        const jwt = require('jsonwebtoken');
        const user = jwt.verify(token, ENV.JWT_SECRET);
        socket.userId = user.id;
        socket.join(`user:${user.id}`);
        socket.emit('authenticated', { success: true, userId: user.id });
      } catch (error) {
        socket.emit('authentication_failed', { error: 'Invalid token' });
      }
    });

    socket.on('payment_intent_created', (data) => {
      socket.to(`user:${data.userId}`).emit('payment_awaiting_confirmation', data);
    });

    socket.on('payment_success', (data) => {
      socket.to(`user:${data.profileOwnerId}`).emit('payment_received', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

// ==================================================
// ENHANCED SECURITY AUDIT
// ==================================================

const performEnhancedSecurityAudit = () => {
  console.log('\n🛡️  ENHANCED SECURITY AUDIT');
  console.log('='.repeat(50));

  const SECURITY_CHECKS = [
    { check: 'JWT Secret', status: ENV.JWT_SECRET && ENV.JWT_SECRET.length >= 32, message: 'JWT secret should be at least 32 characters' },
    { check: 'Environment', status: ENV.NODE_ENV !== undefined, message: 'NODE_ENV should be explicitly set' },
    { check: 'Database SSL', status: process.env.DB_SSL === 'true' || ENV.NODE_ENV === 'production', message: 'SSL should be enabled in production' },
    { check: 'CORS Configuration', status: ENV.ALLOWED_ORIGINS.length > 0, message: 'CORS origins should be properly configured' },
    { check: 'Payment Security', status: !ENV.STRIPE_SECRET_KEY || ENV.STRIPE_SECRET_KEY.startsWith('sk_live'), message: 'Use live Stripe keys in production' },
    { check: 'External API Keys', status: ENV.NODE_ENV === 'production' ? (ENV.STRIPE_SECRET_KEY && ENV.SENDGRID_API_KEY && ENV.TWILIO_ACCOUNT_SID) : true, message: 'All external services should be configured in production' }
  ];

  SECURITY_CHECKS.forEach(check => {
    const status = check.status ? '✅' : '⚠️';
    console.log(`   ${status} ${check.check}: ${check.message}`);
  });
};

// ==================================================
// ENHANCED GLOBAL MIDDLEWARE
// ==================================================

const setupMiddleware = (app) => {
  // Special middleware for payment webhooks (needs raw body)
  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

  // Enhanced Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://apis.google.com", "blob:"],
        connectSrc: ["'self'", `ws://localhost:${ENV.PORT}`, `wss://localhost:${ENV.PORT}`, "https://api.moodle.org", "https://k4b.et"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        mediaSrc: ["'self'", "blob:", "data:"],
        frameSrc: ["'self'", "https://moodle.k4b.et"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // CORS
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [...ENV.ALLOWED_ORIGINS, 'https://js.stripe.com', 'https://www.paypal.com', 'https://api.chapa.co'];
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID', 'X-Device-ID', 'X-Platform', 'Stripe-Signature']
  }));

  // Body parsing
  app.use(express.json({ limit: '50mb', verify: (req, res, buf) => { req.rawBody = buf; } }));
  app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100 }));

  // Security middleware
  app.use(xss());
  app.use(hpp());
  app.use(cookieParser(ENV.JWT_SECRET));

  // Compression
  app.use(compression({ level: 6, threshold: 1024 }));

  // Request ID and timing (if logging enabled)
  if (ENV.REQUEST_LOGGING) {
    app.use((req, res, next) => {
      req.id = uuidv4();
      req.startTime = Date.now();
      res.setHeader('X-Request-ID', req.id);
      next();
    });

    // Uncomment if response-time is installed
    // app.use(responseTime((req, res, time) => {
    //   const duration = time / 1000;
    //   res.setHeader('X-Processing-Time', `${duration.toFixed(3)}s`);
    // }));

    if (ENV.NODE_ENV !== 'production') app.use(morgan('combined'));
  }
};

// ==================================================
// ENHANCED SERVER STARTUP
// ==================================================

const startEnhancedServer = async () => {
  try {
    console.log('🚀 THAM PLATFORM ENHANCED ENTERPRISE SERVER STARTUP');
    console.log('='.repeat(50));

    const envValid = validateEnvironment();
    if (!envValid && ENV.NODE_ENV === 'production') throw new Error('Missing required environment variables in production');

    performEnhancedSecurityAudit();

    const app = express();
    const server = createServer(app);
    const io = new SocketServer(server, {
      cors: { origin: ENV.ALLOWED_ORIGINS, methods: ['GET', 'POST'], credentials: true },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e8
    });

    // Attach to global for health checks
    global.io = io;

    setupMiddleware(app);

    const serviceManager = new EnhancedServiceManager();
    await serviceManager.initializeAllServices();

    loadEnhancedRoutes(app);
    initializeMonitoring(app);
    registerHealthChecks(app, serviceManager);
    setupMobileConfig(app);
    setupRealTime(server, io);

    server.listen(ENV.PORT, '0.0.0.0', () => {
      const startTime = Date.now();
      console.log('\n🎉 ENHANCED ENTERPRISE SERVER STARTUP COMPLETE');
      console.log('='.repeat(50));
      console.log(`   Port: ${ENV.PORT}`);
      console.log(`   Environment: ${ENV.NODE_ENV}`);
      console.log(`   PID: ${process.pid}`);
      console.log(`   Startup time: ${Date.now() - startTime}ms`);
      console.log(`\n🔗 Access Points:`);
      console.log(`   API Base: http://localhost:${ENV.PORT}/api/v1`);
      console.log(`   Health: http://localhost:${ENV.PORT}/health`);
      console.log(`   Mobile Config: http://localhost:${ENV.PORT}/api/mobile/config`);
      console.log(`   Payment Webhooks: http://localhost:${ENV.PORT}/webhooks/stripe`);
      if (ENV.ENABLE_METRICS) console.log(`   Metrics: http://localhost:${ENV.PORT}/metrics`);
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n⚠️ Received SIGTERM. Starting graceful shutdown...');
      await serviceManager.services.get('database')?.close();
      io.close();
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000);
    });
    process.on('SIGINT', async () => {
      console.log('\n⚠️ Received SIGINT. Starting graceful shutdown...');
      await serviceManager.services.get('database')?.close();
      io.close();
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000);
    });

  } catch (error) {
    console.error('\n💥 ENHANCED STARTUP FAILURE');
    console.log('='.repeat(50));
    console.error('Error:', error.message);
    if (ENV.NODE_ENV === 'development') console.error('Stack:', error.stack);
    process.exit(1);
  }
};
// Accept analytics POST requests (required by frontend)
app.post('/api/analytics', (req, res) => {
  console.log('📊 Analytics received:', req.body);
  res.status(200).json({ success: true });
});
// Setup global error handling
setupGlobalErrorHandling();

// Start the server
startEnhancedServer();

module.exports = { app: null, server: null, io: null, serviceManager: null };