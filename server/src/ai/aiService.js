const axios = require('axios');
const config = require('../config/env');
const promptBuilder = require('./promptBuilder');
const responseParser = require('./responseParser');
const explanationFallback = require('../services/explanationFallback');

/**
 * Centralized AI Service Layer
 * Abstracts AI provider interactions (Google Gemini API, OpenAI API, Hosted AI Proxy).
 */
class AIService {
  constructor() {
    this.apiKey = config.ai.apiKey;
    this.model = config.ai.model || 'gemini-3.6-flash';
    this.baseUrl = config.ai.baseUrl || 'https://generativelanguage.googleapis.com';
  }

  hasValidApiKey() {
    return Boolean(
      this.apiKey &&
      !this.apiKey.includes('your_ai_api_key') &&
      this.apiKey.trim().length > 5
    );
  }

  /**
   * Universal AI Provider Caller with Model Fallbacks
   */
  async callAIProvider(prompt) {
    if (!this.hasValidApiKey()) {
      return null;
    }

    const isGeminiUrl = this.baseUrl.includes('generativelanguage.googleapis.com');
    const candidateModels = [this.model, 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    const modelsToTry = Array.from(new Set(candidateModels));

    if (isGeminiUrl) {
      for (const targetModel of modelsToTry) {
        try {
          const url = `${this.baseUrl}/v1beta/models/${targetModel}:generateContent?key=${this.apiKey}`;
          const response = await axios.post(
            url,
            {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2
              }
            },
            { timeout: 20000 }
          );

          const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = responseParser.parseJsonResponse(candidateText);
          if (parsed) {
            console.log(`[AIService Success] Generated AI content using model: ${targetModel}`);
            return parsed;
          }
        } catch (error) {
          console.warn(`[AIService Notice] Gemini model '${targetModel}' call failed (${error.message}). Trying next candidate...`);
        }
      }
    } else {
      // OpenAI-Compatible Format
      try {
        const url = `${this.baseUrl}/v1/chat/completions`;
        const response = await axios.post(
          url,
          {
            model: this.model,
            messages: [
              { role: 'system', content: 'You are a senior technical interviewer. Always output valid JSON.' },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 20000
          }
        );

        const content = response.data?.choices?.[0]?.message?.content;
        return responseParser.parseJsonResponse(content);
      } catch (error) {
        console.warn(`[AIService Warning] OpenAI-compatible call failed: ${error.message}`);
      }
    }

    return null;
  }

  /**
   * Generate Grounded Project Explanation Pitches (30s, 1m, 3m)
   */
  async generateProjectExplanation(projectContext) {
    const prompt = promptBuilder.buildProjectExplanationPrompt(projectContext);
    const aiParsedData = await this.callAIProvider(prompt);

    if (aiParsedData && (aiParsedData.summary30s || aiParsedData.summary1m)) {
      return {
        success: true,
        data: {
          isFallback: false,
          summary30s: aiParsedData.summary30s,
          summary1m: aiParsedData.summary1m,
          summary3m: aiParsedData.summary3m,
          techDecisions: aiParsedData.techDecisions || [],
          sections: aiParsedData.sections || {}
        }
      };
    }

    return {
      success: true,
      data: explanationFallback.generateFallback(projectContext)
    };
  }

  /**
   * Evaluate Candidate's Spoken/Written Pitch to "Tell me about your project"
   */
  async evaluateProjectExplanation(projectContext, studentExplanation) {
    const prompt = promptBuilder.buildExplanationEvaluationPrompt(projectContext, studentExplanation);
    const aiParsedData = await this.callAIProvider(prompt);

    if (aiParsedData && aiParsedData.scores) {
      return {
        success: true,
        data: {
          isFallback: false,
          scores: aiParsedData.scores,
          strengths: aiParsedData.strengths || [],
          missingConcepts: aiParsedData.missingConcepts || [],
          feedback: aiParsedData.feedback || '',
          followUpQuestion: aiParsedData.followUpQuestion || ''
        }
      };
    }

    return {
      success: true,
      data: this.generateFallbackEvaluation(projectContext, studentExplanation)
    };
  }

  /**
   * Generate Project-Grounded Technical Interview Questions
   */
  async generateQuestions(projectContext) {
    const prompt = promptBuilder.buildQuestionGenerationPrompt(projectContext);
    const aiParsedData = await this.callAIProvider(prompt);

    if (Array.isArray(aiParsedData) && aiParsedData.length > 0) {
      return { success: true, data: aiParsedData };
    }

    if (aiParsedData && Array.isArray(aiParsedData.questions)) {
      return { success: true, data: aiParsedData.questions };
    }

    return { success: true, data: [] };
  }

  /**
   * Evaluate Mock Interview Answer & Generate Adaptive Follow-Up
   */
  async evaluateAnswer(questionText, answerText, expectedConcepts = [], projectContext = {}) {
    const prompt = promptBuilder.buildAnswerEvaluationPrompt(questionText, answerText, expectedConcepts, projectContext);
    const aiParsedData = await this.callAIProvider(prompt);

    if (aiParsedData && aiParsedData.scores) {
      return {
        success: true,
        data: {
          isFallback: false,
          scores: aiParsedData.scores,
          strengths: aiParsedData.strengths || [],
          missingConcepts: aiParsedData.missingConcepts || [],
          feedback: aiParsedData.feedback || '',
          followUpQuestion: aiParsedData.followUpQuestion || ''
        }
      };
    }

    return {
      success: true,
      data: {
        isFallback: true,
        scores: { accuracy: 82, completeness: 75, depth: 70, clarity: 84, overall: 78 },
        strengths: ['Accurately explained token verification flow'],
        missingConcepts: ['Could expand on refresh token expiration handling'],
        feedback: 'Solid response! Explicitly mention how error middleware handles expired JWT tokens.',
        followUpQuestion: 'Where is the secret key stored and how do you prevent committing it to version control?'
      }
    };
  }

  /**
   * Deterministic Evaluation Fallback Engine
   */
  generateFallbackEvaluation(projectContext = {}, studentExplanation = '') {
    const textLower = studentExplanation.toLowerCase();
    const tech = projectContext.technologies || {};
    const database = Array.isArray(tech.database) ? tech.database : ['MongoDB'];

    let score = 70;
    const strengths = [];
    const missing = [];

    if (textLower.includes('problem') || textLower.includes('built') || textLower.includes('solve')) {
      score += 10;
      strengths.push('Stated the core problem and project motivation clearly.');
    } else {
      missing.push('Did not explicitly state the core problem being solved.');
    }

    if (textLower.includes('react') || textLower.includes('express') || textLower.includes('mongo') || textLower.includes('node')) {
      score += 10;
      strengths.push('Accurately mentioned core technology stack components.');
    } else {
      missing.push('Missing explicit technology stack breakdown.');
    }

    if (textLower.includes('architecture') || textLower.includes('middleware') || textLower.includes('controller') || textLower.includes('api')) {
      score += 10;
      strengths.push('Mentioned backend architecture and API structure.');
    } else {
      missing.push('Did not explain how data flows through your architecture.');
    }

    score = Math.min(95, Math.max(50, score));

    return {
      isFallback: true,
      scores: {
        projectUnderstanding: score,
        structure: score - 5,
        technicalDepth: score - 10,
        clarity: score + 4,
        completeness: score - 6,
        overall: score
      },
      strengths: strengths.length > 0 ? strengths : ['Good starting overview of the project.'],
      missingConcepts: missing.length > 0 ? missing : ['Could elaborate on database schema optimization and security.'],
      feedback: 'Focus on connecting the problem statement directly to your architecture choices (e.g. why MongoDB was chosen for event records).',
      followUpQuestion: `Why did you choose ${database[0] || 'MongoDB'} for data persistence in this application?`
    };
  }
}

module.exports = new AIService();
