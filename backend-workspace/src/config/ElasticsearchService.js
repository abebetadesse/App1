import { Client } from '@elastic/elasticsearch';

class ElasticsearchService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async initialize() {
    if (!process.env.ELASTICSEARCH_HOST) {
      console.log('🔍 Elasticsearch: No host configured, skipping initialization');
      return false;
    }

    try {
      this.client = new Client({
        node: process.env.ELASTICSEARCH_HOST,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Test connection
      await this.client.ping();
      this.isConnected = true;
      console.log('✅ Elasticsearch: Connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Elasticsearch connection failed:', error.message);
      return false;
    }
  }

  async syncElasticsearch() {
    if (!this.isConnected) {
      console.log('⚠️ Elasticsearch: Not connected, skipping sync');
      return false;
    }

    try {
      // Create indexes if they don't exist
      const indexes = ['profile_owners', 'clients', 'courses'];
      
      for (const index of indexes) {
        const exists = await this.client.indices.exists({ index });
        if (!exists) {
          await this.client.indices.create({
            index,
            body: {
              mappings: {
                properties: {
                  name: { type: 'text' },
                  skills: { type: 'keyword' },
                  serviceCategory: { type: 'keyword' },
                  location: { type: 'text' },
                  rankingScore: { type: 'float' }
                }
              }
            }
          });
          console.log(`✅ Created Elasticsearch index: ${index}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Elasticsearch sync failed:', error.message);
      return false;
    }
  }

  async searchProfiles(query, filters = {}) {
    if (!this.isConnected) {
      throw new Error('Elasticsearch not connected');
    }

    const searchBody = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query,
                fields: ['name', 'skills', 'serviceCategory', 'description'],
                fuzziness: 'AUTO'
              }
            }
          ],
          filter: []
        }
      },
      sort: [
        { rankingScore: { order: 'desc' } },
        { _score: { order: 'desc' } }
      ],
      size: 50
    };

    // Add filters
    if (filters.serviceCategory) {
      searchBody.query.bool.filter.push({
        term: { serviceCategory: filters.serviceCategory }
      });
    }

    if (filters.skills && filters.skills.length > 0) {
      searchBody.query.bool.filter.push({
        terms: { skills: filters.skills }
      });
    }

    if (filters.minRankingScore) {
      searchBody.query.bool.filter.push({
        range: { rankingScore: { gte: filters.minRankingScore } }
      });
    }

    const result = await this.client.search({
      index: 'profile_owners',
      body: searchBody
    });

    return result.body.hits.hits.map(hit => ({
      ...hit._source,
      score: hit._score
    }));
  }
}

export default new;ElasticsearchService();
module.export const ElasticsearchService = ElasticsearchService;