import { Client } from '@elastic/elasticsearch';

class ElasticsearchService {
  constructor() {
    // Provide proper node configuration
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      // Optional: Add authentication if needed
      // auth: {
      //   username: process.env.ELASTICSEARCH_USERNAME,
      //   password: process.env.ELASTICSEARCH_PASSWORD
      // },
      // Optional: Add TLS/SSL configuration
      // tls: {
      //   rejectUnauthorized: false // Only for development
      // }
    });
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Test connection
      const health = await this.client.cluster.health();
      console.log('✅ Elasticsearch connected successfully');
      console.log(`📊 Cluster status: ${health.status}`);
      
      this.isConnected = true;
      
      // Create indices if they don't exist
      await this.createIndices();
      
      return this.client;
    } catch (error) {
      console.error('❌ Elasticsearch connection failed:', error.message);
      console.log('💡 Make sure Elasticsearch is running and ELASTICSEARCH_URL is set');
      throw error;
    }
  }

  async createIndices() {
    const indices = ['profile_owners', 'clients', 'courses'];
    
    for (const indexName of indices) {
      try {
        const exists = await this.client.indices.exists({ index: indexName });
        
        if (!exists) {
          await this.client.indices.create({
            index: indexName,
            body: {
              settings: {
                number_of_shards: 1,
                number_of_replicas: 0
              },
              mappings: {
                properties: this.getIndexMapping(indexName)
              }
            }
          });
          console.log(`✅ Created index: ${indexName}`);
        } else {
          console.log(`✅ Index already exists: ${indexName}`);
        }
      } catch (error) {
        console.error(`❌ Failed to create index ${indexName}:`, error.message);
      }
    }
  }

  getIndexMapping(indexName) {
    const mappings = {
      profile_owners: {
        id: { type: 'keyword' },
        userId: { type: 'keyword' },
        serviceCategory: { type: 'keyword' },
        subcategories: { type: 'keyword' },
        skills: { type: 'keyword' },
        experienceYears: { type: 'integer' },
        hourlyRate: { type: 'float' },
        dailyRate: { type: 'float' },
        availability: { type: 'keyword' },
        location: { type: 'text' },
        professionalRank: { type: 'integer' },
        rankingScore: { type: 'float' },
        isAvailable: { type: 'boolean' },
        profileCompletion: { type: 'integer' },
        isVerified: { type: 'boolean' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      },
      clients: {
        id: { type: 'keyword' },
        userId: { type: 'keyword' },
        companyName: { type: 'text' },
        industry: { type: 'keyword' },
        contactPreference: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      },
      courses: {
        id: { type: 'keyword' },
        moodleCourseId: { type: 'integer' },
        courseName: { type: 'text' },
        category: { type: 'keyword' },
        description: { type: 'text' },
        durationHours: { type: 'integer' },
        difficultyLevel: { type: 'keyword' },
        credits: { type: 'integer' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    };

    return mappings[indexName] || {};
  }

  async search(index, query) {
    if (!this.isConnected) {
      throw new Error('Elasticsearch not connected');
    }

    try {
      const result = await this.client.search({
        index: index,
        body: query
      });
      return result;
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }

  async indexDocument(index, id, document) {
    if (!this.isConnected) {
      throw new Error('Elasticsearch not connected');
    }

    try {
      const result = await this.client.index({
        index: index,
        id: id,
        body: document,
        refresh: true
      });
      return result;
    } catch (error) {
      console.error('Elasticsearch index error:', error);
      throw error;
    }
  }

  async updateDocument(index, id, document) {
    if (!this.isConnected) {
      throw new Error('Elasticsearch not connected');
    }

    try {
      const result = await this.client.update({
        index: index,
        id: id,
        body: {
          doc: document
        },
        refresh: true
      });
      return result;
    } catch (error) {
      console.error('Elasticsearch update error:', error);
      throw error;
    }
  }

  async deleteDocument(index, id) {
    if (!this.isConnected) {
      throw new Error('Elasticsearch not connected');
    }

    try {
      const result = await this.client.delete({
        index: index,
        id: id,
        refresh: true
      });
      return result;
    } catch (error) {
      console.error('Elasticsearch delete error:', error);
      throw error;
    }
  }
}

export default new;ElasticsearchService();