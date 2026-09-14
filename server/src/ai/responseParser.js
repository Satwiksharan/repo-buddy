/**
 * Response Parser Service
 * Validates and safely parses structured JSON from AI providers.
 */

const parseJsonResponse = (rawText) => {
  try {
    if (!rawText) return null;
    
    // Clean markdown code blocks if wrapped in ```json ... ```
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[AI Response Parser Error] Failed to parse JSON:', error.message);
    return null;
  }
};

module.exports = {
  parseJsonResponse
};
