/**
 * AI Content Generator Service
 * Supports multiple AI providers: OpenAI, Gemini, DeepSeek, and Claude
 */

// API Keys and Endpoints
const API_CONFIG = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4-turbo',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    })
  },
  gemini: {
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    headers: () => ({ 'Content-Type': 'application/json' })
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    })
  },
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-5-sonnet',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    })
  }
};

/**
 * Generate content using the specified AI model
 * @param {Object} formData - Form data including model selection and content parameters
 * @returns {Promise<string>} - HTML content for the TipTap editor
 */
export const generateAiContent = async (formData) => {
  const { model = 'openai', ...contentParams } = formData;
  console.log(`Generating content using ${model} model`, contentParams);

  try {
    const prompt = createPrompt(contentParams);
    const modelConfig = API_CONFIG[model];

    if (!modelConfig) {
      throw new Error(`Unsupported AI model: ${model}`);
    }

    // Format request based on the selected model
    const requestData = formatRequestByModel(model, prompt);

    // Get the correct endpoint (some are functions, others are strings)
    const endpoint = typeof modelConfig.endpoint === 'function'
      ? modelConfig.endpoint(modelConfig.apiKey)
      : modelConfig.endpoint;

    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: modelConfig.headers(modelConfig.apiKey),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract content based on the model's response structure
    const content = extractContentByModel(model, data);

    return cleanHtmlContent(content);
  } catch (error) {
    console.error(`Error generating content with ${model}:`, error);
    throw error;
  }
};

/**
 * Format the API request based on the selected model
 */
const formatRequestByModel = (model, prompt) => {
  const systemPrompt = 'You are an educational content creator specialized in creating engaging lecture content. Your task is to generate well-structured educational material in clean HTML based on the prompt below.';

  switch (model) {
    case 'openai':
      return {
        model: API_CONFIG.openai.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      };

    case 'gemini':
      return {
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${prompt}` }
            ]
          }
        ]
      };

    case 'deepseek':
      return {
        model: API_CONFIG.deepseek.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      };

    case 'claude':
      return {
        model: API_CONFIG.claude.defaultModel,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 4000
      };

    default:
      throw new Error(`Unsupported model format: ${model}`);
  }
};

/**
 * Extract content from the API response based on the model
 */
const extractContentByModel = (model, data) => {
  switch (model) {
    case 'openai':
      return data.choices?.[0]?.message?.content || '';

    case 'gemini':
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    case 'deepseek':
      return data.choices?.[0]?.message?.content || '';

    case 'claude':
      return data.content?.[0]?.text || '';

    default:
      return '';
  }
};

/**
 * Create an optimized prompt for generating educational lecture content
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

  // Map length to guidance text
  const lengthGuidance = {
    short: 'Keep sections concise (1-2 paragraphs or 3-5 bullet points per section).',
    medium: 'Use moderate length (2-3 paragraphs or 5-8 bullet points per section).',
    long: 'Create detailed sections (4+ paragraphs or 8+ bullet points per section).'
  }[sectionLength];

  // Map tone to guidance text
  const toneGuidance = {
    professional: 'Use formal language and structure appropriate for academic settings.',
    casual: 'Use relaxed, conversational language while maintaining educational value.',
    friendly: 'Maintain a warm, approachable tone with supportive language.',
    enthusiastic: 'Use dynamic, engaging language with excitement about the topic.',
    humorous: 'Include appropriate humor while maintaining educational integrity.',
    technical: 'Focus on precise terminology and detailed explanations.'
  }[tone];

  // Create the prompt
  return `
    Create an educational lecture on "${topic}" for ${targetAudience}.
    
    Structure:
    - Create exactly ${sectionCount} content sections
    - Include a mix of these section types: ${sectionTypes.join(', ')}
    - ${includeHeader ? 'Include an engaging header/introduction section' : 'Skip the header/introduction'}
    - ${includeFooter ? 'Include a summary/conclusion section' : 'Skip the summary/conclusion'}
    - ${includeEmojis ? 'Include relevant emojis to make the content engaging' : 'Do not include emojis'}
    - Insert a thin horizontal line (<hr>) between each section for better visual separation
    
    Content guidelines:
    - ${lengthGuidance}
    - ${toneGuidance}
    - Target audience: ${targetAudience}
    - ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}
    
    IMPORTANT FORMAT INSTRUCTIONS:
    Return your response as clean HTML that can be directly used in a rich text editor.
    - Use semantic HTML tags: <h1> for main title, <h2> for section headers, <h3> for subsections
    - Use <p> for paragraphs, <ul>/<ol> with <li> for lists
    - Create clean bullet points without quotes or full italics - format list items naturally
    - Use <strong> for bold text, <em> for emphasis (but do not italicize entire bullet points)
    - Use <blockquote> for quotes or important callouts
    - For code examples, use <pre><code>...</code></pre>
    - Keep the HTML structure clean and simple
    - Do not include any explanations or markdown - just the HTML content
    - Do not include <!DOCTYPE>, <html>, <head>, or <body> tags
  `;
};


const cleanHtmlContent = (content) => {
  try {
    let cleanedContent = content.replace(/```html/g, '').replace(/```/g, '').trim();

    cleanedContent = cleanedContent.replace(/<\!DOCTYPE.*?>/gi, '')
      .replace(/<html.*?>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head>.*?<\/head>/gis, '')
      .replace(/<body.*?>/gi, '')
      .replace(/<\/body>/gi, '');

    return cleanedContent;
  } catch (error) {
    console.error('Error cleaning HTML response:', error);
    return content;
  }
};

/**
 * Process text with AI based on the specified action
 * @param {string} action - The AI action to perform (simplify, improve, etc.)
 * @param {string} text - The text to process (selected text or whole document)
 * @param {boolean} isSelectionBased - Whether this is for selected text or whole document
 * @param {string} htmlContent - For document-level actions, the current HTML content
 * @param {string} model - The AI model to use (defaults to openai)
 * @returns {Promise<string>} - The processed text or HTML content
 */
export const processTextWithAI = async (action, text, isSelectionBased, htmlContent = null, model = 'openai', custom_prompt = '') => {
  try {
    // Determine what prompt to use based on the action
    const prompt = createActionPrompt(action, text, isSelectionBased, htmlContent);
    const modelConfig = API_CONFIG[model];

    if (!modelConfig) {
      throw new Error(`Unsupported AI model: ${model}`);
    }

    // Format request based on selected model
    let requestData;
    const systemInstruction = getSystemInstructionForAction(action, custom_prompt);

    console.log('system instruction', systemInstruction);

    // Format the request based on the model
    switch (model) {
      case 'openai':
        requestData = {
          model: API_CONFIG.openai.defaultModel,
          messages: [
            { role: 'system', content: `You are an educational content assistant that helps improve text for lectures and educational materials. ${systemInstruction}` },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        };
        break;

      case 'gemini':
        requestData = {
          contents: [
            {
              parts: [
                { text: `As an educational content assistant that helps improve text for lectures and educational materials: ${systemInstruction}\n\n${prompt}` }
              ]
            }
          ]
        };
        break;

      case 'deepseek':
      case 'claude':
        // Similar structure to OpenAI but with model-specific fields
        requestData = {
          model: API_CONFIG[model].defaultModel,
          messages: [
            { role: 'system', content: `You are an educational content assistant that helps improve text for lectures and educational materials. ${systemInstruction}` },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        };
        break;

      default:
        throw new Error(`Unsupported model format: ${model}`);
    }

    // Get the correct endpoint
    const endpoint = typeof modelConfig.endpoint === 'function'
      ? modelConfig.endpoint(modelConfig.apiKey)
      : modelConfig.endpoint;

    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: modelConfig.headers(modelConfig.apiKey),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Extract content based on model
    const processedContent = extractContentByModel(model, data);

    // Clean HTML if needed
    if (!isSelectionBased && htmlContent) {
      return cleanHtmlContent(processedContent);
    }

    return processedContent;

  } catch (error) {
    console.error('Error processing text with AI:', error);
    throw error;
  }
};

/**
 * Create an appropriate prompt based on the selected action
 */
const createActionPrompt = (action, text, isSelectionBased, htmlContent = null) => {
  // Define prompts for different actions
  const actionPrompts = {
    // Selection-based actions
    simplify: `Simplify the following text to make it easier to understand while preserving its educational value:\n\n${text}\n\nProvide only the simplified text without additional commentary.`,

    improve: `Improve the writing quality of the following educational text. Enhance clarity, flow, and engagement while preserving the educational content:\n\n${text}\n\nProvide only the improved text without additional commentary.`,

    shorten: `Make the following educational text more concise while preserving the key information and concepts:\n\n${text}\n\nProvide only the shortened text without additional commentary.`,

    expand: `Expand the following educational text with more details, examples, or explanations to enhance understanding:\n\n${text}\n\nProvide only the expanded text without additional commentary.`,

    translate: `Translate the following educational text to Spanish (if the text appears to already be in Spanish or another non-English language, translate it to English):\n\n${text}\n\nProvide only the translated text without additional commentary.`,

    rewrite: `Rewrite the following educational text to improve engagement while maintaining its educational value. Use a more conversational tone:\n\n${text}\n\nProvide only the rewritten text without additional commentary.`,
  };

  if (!isSelectionBased && htmlContent) {
    return `
I have an educational document in HTML format that needs to be modified according to the specified action.

CURRENT HTML STRUCTURE:
${htmlContent}

REQUESTED ACTION: ${getActionDescription(action)}

IMPORTANT INSTRUCTIONS:
1. Return the COMPLETE HTML with the same structure and tags
2. Modify ONLY the text content within the HTML tags
3. Do not add, remove, or change any HTML tags
4. Do not change any attributes of HTML elements
5. Maintain all headings, lists, paragraphs and other structural elements
6. Return only the modified HTML document with no additional commentary

Your task is to update the text content while preserving the HTML structure perfectly.
`;
  }

  return actionPrompts[action] || `Process the following text: ${text}`;
};

/**
 * Get system instructions based on the action
 */
const getSystemInstructionForAction = (action, custom_prompt) => {
  const systemInstructions = {
    simplify: "Your task is to transform complex text into simpler, more accessible language while maintaining educational value.",
    improve: "Your task is to enhance writing quality, clarity, and engagement of educational text.",
    shorten: "Your task is to make text more concise while preserving key educational information.",
    expand: "Your task is to extend text with more details, examples, or explanations to enhance understanding.",
    translate: "Your task is to accurately translate educational text while preserving meaning and tone.",
    rewrite: "Your task is to transform text to be more engaging while maintaining educational value.",
    doc_improve: "Your task is to enhance the overall quality, clarity, and engagement of educational documents while preserving the exact HTML structure.",
    doc_simplify: "Your task is to make educational documents more accessible while preserving learning objectives and the exact HTML structure.",
    doc_shorten: "Your task is to create concise summaries of educational documents that capture key points while maintaining the exact HTML structure.",
    doc_proofread: "Your task is to correct grammar, spelling, and punctuation while preserving content, meaning, and the exact HTML structure.",
    doc_translate: "Your task is to translate educational documents while preserving structure, meaning, and tone.",
    custom_prompt: `You are an expert language model. Perform the following task on the input text based on the user's instruction:\n"${custom_prompt}"\nEnsure your response aligns precisely with the user's intent while maintaining clarity and coherence.`
  };
  return systemInstructions[action] || "When working with HTML content, maintain the exact same HTML structure, modifying only the text content within tags.";
};

/**
 * Get a description of the requested action
 */
const getActionDescription = (action) => {
  const actionDescriptions = {
    doc_improve: "Improve the overall writing quality of this document. Enhance clarity, flow, and engagement while preserving the educational content.",
    doc_simplify: "Simplify this document to make it easier to understand while preserving its educational value.",
    doc_shorten: "Create a concise summary of this document while preserving the key information and concepts.",
    doc_proofread: "Proofread this document and correct any grammar, spelling, or punctuation errors while preserving the content and meaning.",
    doc_translate: "Translate this document to Spanish (if it appears to be in Spanish or another non-English language, translate it to English)."
  };

  return actionDescriptions[action] || "Process this document";
};