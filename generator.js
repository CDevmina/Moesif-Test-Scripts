/**
 * Data generator for Moesif test events
 */

/**
 * Generate a random string ID
 * Uses timestamp, random string, and counter for uniqueness
 */
let idCounter = 0;
function generateId(prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const counter = (idCounter++).toString(36);
  return prefix ? `${prefix}_${timestamp}_${counter}_${random}` : `${timestamp}_${counter}_${random}`;
}

/**
 * Generate a random date within the past N days
 * @param {number} daysAgo - Number of days in the past
 * @returns {Date}
 */
function getRandomDateInPast(daysAgo = 30) {
  const now = new Date();
  const randomDaysAgo = Math.random() * daysAgo;
  const randomDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
  return randomDate;
}

/**
 * Available template IDs for application creation
 */
const TEMPLATE_IDS = [
  'nextjs-application',
  'react-spa',
  'vue-application',
  'express-api',
  'django-backend',
  'spring-boot-api',
  'fastapi-service',
  'rails-webapp'
];

/**
 * Sample organization names
 */
const ORG_NAMES = [
  'Acme Corp',
  'TechStart Inc',
  'DevOps Solutions',
  'CloudNative Labs',
  'DataDriven Co',
  'API First Systems',
  'MicroServices Ltd',
  'Platform Engineering'
];

/**
 * Sample application name prefixes
 */
const APP_PREFIXES = [
  'dashboard',
  'api-gateway',
  'user-service',
  'payment-processor',
  'analytics',
  'notification-service',
  'auth-service',
  'data-pipeline'
];

/**
 * Generate a single application_created event
 * @param {Object} options - Generation options
 * @returns {Object} Moesif action event
 */
function generateApplicationCreatedEvent(options = {}) {
  const templateId = options.templateId || TEMPLATE_IDS[Math.floor(Math.random() * TEMPLATE_IDS.length)];
  const userId = generateId('user');
  const companyId = generateId('company');
  const applicationId = generateId('app');
  const organizationId = generateId('org');
  const appPrefix = APP_PREFIXES[Math.floor(Math.random() * APP_PREFIXES.length)];
  const orgName = ORG_NAMES[Math.floor(Math.random() * ORG_NAMES.length)];
  const applicationName = `${appPrefix}-${Math.random().toString(36).substring(2, 7)}`;
  
  const eventTime = options.timestamp || getRandomDateInPast(30);
  
  return {
    action_name: 'application_created',
    user_id: userId,
    company_id: companyId,
    request: {
      time: eventTime.toISOString()
    },
    metadata: {
      template_id: templateId,
      application_id: applicationId,
      application_name: applicationName,
      organization_id: organizationId,
      organization_name: orgName,
      created_at: eventTime.toISOString()
    }
  };
}

/**
 * Generate multiple application_created events
 * @param {number} count - Number of events to generate
 * @param {Object} options - Generation options
 * @returns {Array} Array of Moesif action events
 */
function generateBulkEvents(count = 100, options = {}) {
  const events = [];
  
  for (let i = 0; i < count; i++) {
    events.push(generateApplicationCreatedEvent(options));
  }
  
  // Sort events by timestamp (oldest first)
  events.sort((a, b) => {
    return new Date(a.request.time) - new Date(b.request.time);
  });
  
  return events;
}

module.exports = {
  generateApplicationCreatedEvent,
  generateBulkEvents,
  TEMPLATE_IDS
};
