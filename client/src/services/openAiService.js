// services/openAiService.js

// Configuration for OpenAI API
const OPENAI_API_KEY = 'sk-proj-hLndDrpIxrLFJwUU91RYT3BlbkFJUzr23Aeuiids1TLi6tfx';
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate content using OpenAI API based on form data
 * @param {Object} formData - Form data for generating content
 * @returns {Object|string} - TipTap compatible content (JSON structure or HTML)
 */
export const generateAiContent = async (formData) => {
  try {

    console.log('formdata',formData)
    const prompt = createPrompt(formData);


    console.log('prompt',prompt)
    
    // Call OpenAI API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an educational content creator assistant. Your task is to generate well-structured lecture content based on the provided specifications. Your output should be in a JSON structure that follows the TipTap editor format. Focus on creating educational, accurate, and engaging content.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the response to get TipTap compatible content
    return parseTipTapContent(content);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

/**
 * Create a detailed prompt for OpenAI based on form data
 */
const createPrompt = (formData) => {
  const {
    topic,
    sectionCount,
    sectionTypes,
    sectionLength,
    tone,
    includeHeader,
    includeFooter,
    includeEmojis,
    targetAudience,
    additionalInstructions
  } = formData;

  // Length guidance based on selection
  const lengthGuidance = {
    short: 'Keep sections concise (1-2 paragraphs or 3-5 bullet points per section).',
    medium: 'Use moderate length (2-3 paragraphs or 5-8 bullet points per section).',
    long: 'Create detailed sections (4+ paragraphs or 8+ bullet points per section).'
  }[sectionLength];

  // Tone guidance
  const toneGuidance = {
    professional: 'Use formal language and structure appropriate for academic settings.',
    casual: 'Use relaxed, conversational language while maintaining educational value.',
    friendly: 'Maintain a warm, approachable tone with supportive language.',
    enthusiastic: 'Use dynamic, engaging language with excitement about the topic.',
    humorous: 'Include appropriate humor while maintaining educational integrity.',
    technical: 'Focus on precise terminology and detailed explanations.'
  }[tone];

  // Section types information
  const sectionTypesStr = sectionTypes.join(', ');

  // Create the prompt
  return `
    Create an educational lecture on "${topic}" for ${targetAudience}.
    
    Structure:
    - Create exactly ${sectionCount} content sections
    - Include a mix of these section types: ${sectionTypesStr}
    - ${includeHeader ? 'Include an engaging header/introduction section' : 'Skip the header/introduction'}
    - ${includeFooter ? 'Include a summary/conclusion section' : 'Skip the summary/conclusion'}
    - ${includeEmojis ? 'Include relevant emojis to make the content engaging' : 'Do not include emojis'}
    
    Content guidelines:
    - ${lengthGuidance}
    - ${toneGuidance}
    - Target audience: ${targetAudience}
    - ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}
    
    IMPORTANT FORMAT INSTRUCTIONS:
    Return your response in a JSON structure that follows the TipTap editor format. Here's an example structure:
    
    {
      "type": "doc",
      "content": [
        {
          "type": "heading",
          "attrs": { "level": 1 },
          "content": [{ "type": "text", "text": "Title Goes Here" }]
        },
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Content goes here" }]
        },
        // More nodes as needed
      ]
    }
    
    Use the appropriate node types (paragraph, heading, bulletList, orderedList, taskList, codeBlock, blockquote, table) as specified.
    For formatted text, use marks like bold, italic, etc.
    For emoji support, simply include the emoji character in text nodes.
  `;
};

/**
 * Parse the OpenAI response to get TipTap compatible content
 */
const parseTipTapContent = (content) => {
  try {
    // Try to parse as JSON
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonContent = content.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonContent);
    }
    
    // If not valid JSON, assume it's HTML format
    return content;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    // Return raw content as fallback
    return content;
  }
};