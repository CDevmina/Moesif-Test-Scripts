/**
 * Moesif API client for posting test data
 */

const axios = require('axios');

class MoesifClient {
  constructor(appId, apiUrl = 'https://api.moesif.net/v1') {
    if (!appId) {
      throw new Error('MOESIF_APP_ID is required. Please set it in your .env file or environment variables.');
    }
    
    this.appId = appId;
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'X-Moesif-Application-Id': this.appId,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  /**
   * Post actions to Moesif in bulk
   * @param {Array} actions - Array of action events
   * @returns {Promise} API response
   */
  async postActionsBatch(actions) {
    try {
      const response = await this.client.post('/actions/batch', actions);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }

  /**
   * Post companies to Moesif in bulk (placeholder for future use)
   * @param {Array} companies - Array of company objects
   * @returns {Promise} API response
   */
  async postCompaniesBatch(companies) {
    try {
      const response = await this.client.post('/companies/batch', companies);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }

  /**
   * Post users to Moesif in bulk (placeholder for future use)
   * @param {Array} users - Array of user objects
   * @returns {Promise} API response
   */
  async postUsersBatch(users) {
    try {
      const response = await this.client.post('/users/batch', users);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }
}

module.exports = MoesifClient;
