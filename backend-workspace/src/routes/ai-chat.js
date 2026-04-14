import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.js';

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt, provider = 'openai', options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    import externalServiceManager from '../server.js';.serviceManager.getExternalServiceManager();
    const content = await externalServiceManager.generateAIContent(provider, prompt, options);

    res.json({
      success: true,
      data: {
        content,
        provider,
        promptLength: prompt.length,
        responseLength: content.length
      }
    });
  } catch (error) {
    console.error('AI content generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'AI service unavailable',
      message: error.message
    });
  }
});

router.post('/suggest-profile', authenticateToken, async (req, res) => {
  try {
    const { profileData, improvementType } = req.body;
    
    const prompt = `As a career coach, provide specific suggestions to improve this profile for ${improvementType}:

Profile Data: ${JSON.stringify(profileData)}

Please provide:
1. 3 specific improvement suggestions
2. Key skills to highlight
3. Professional summary optimization
4. Any relevant certifications or courses to consider

Format the response as structured JSON.`;

    import externalServiceManager from '../server.js';.serviceManager.getExternalServiceManager();
    const suggestions = await externalServiceManager.generateAIContent('openai', prompt, {
      temperature: 0.7,
      max_tokens: 800
    });

    res.json({
      success: true,
      data: JSON.parse(suggestions)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate profile suggestions'
    });
  }
});

export default router;