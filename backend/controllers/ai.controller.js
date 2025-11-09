export const aiStatus = async (_req, res) => {
  try {
    const info = await getGeminiStatus();
    return res.status(200).json({ success: true, ...info });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch status' });
  }
};

import { generateBlogContent, generateBlogIdeas, getGeminiStatus } from '../utils/gemini.js';

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        console.log(`🤖 Generating content for prompt: "${prompt.substring(0, 50)}..."`);

        const text = await generateBlogContent(prompt);

        return res.status(200).json({
            success: true,
            message: 'Content generated successfully',
            data: text
        });

    } catch (error) {
        console.error('AI Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to generate content'
        });
    }
};

export const generateIdeas = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }

        console.log(`💡 Generating blog ideas for topic: "${topic}"`);

        const ideas = await generateBlogIdeas(topic);
        console.log('✅ Successfully generated blog ideas');
        return res.status(200).json({
            success: true,
            message: 'Blog ideas generated successfully',
            data: ideas
        });

    } catch (error) {
        console.error('AI Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const improveContent = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        console.log(`🔧 Improving content: "${content.substring(0, 50)}..."`);

        const improvePrompt = `Improve and enhance this blog content while maintaining its core message: "${content}".\nMake it more engaging, add better structure, fix grammar, and enhance readability. Use HTML tags like <h2>, <h3>, <p>, <ul>, <li> for proper formatting.`;
        const improved = await generateBlogContent(improvePrompt);
        console.log('✅ Successfully improved content');
        return res.status(200).json({
            success: true,
            message: 'Content improved successfully',
            data: improved
        });

    } catch (error) {
        console.error('AI Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
