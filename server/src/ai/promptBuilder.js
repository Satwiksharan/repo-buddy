/**
 * Prompt Builder Service
 * Constructs grounded, context-aware AI prompts for RepoBuddy engines.
 */

const buildProjectExplanationPrompt = (projectContext = {}) => {
  return `You are a senior technical interviewer and engineering lead.
Analyze the provided repository context and generate structured interview pitches for the candidate.

Repository Context:
${JSON.stringify(projectContext, null, 2)}

Grounding Rules (STRICT):
1. Base responses strictly on repository evidence (technologies, files, architecture).
2. Never fabricate non-existent files, endpoints, or unreferenced technologies.
3. Clearly label any inferred reasoning as: "Possible explanation based on your implementation."
4. Provide structured output in JSON format with fields: summary30s, summary1m, summary3m, techDecisions, sections.`;
};

const buildExplanationEvaluationPrompt = (projectContext = {}, studentExplanation = '') => {
  return `You are a senior technical interviewer evaluating a candidate's answer to "Tell me about your project."

Repository Implementation Context:
${JSON.stringify(projectContext, null, 2)}

Candidate's Spoken/Written Response:
"${studentExplanation}"

Evaluation Rules:
1. Evaluate candidate response against 5 criteria: projectUnderstanding, structure, technicalDepth, clarity, completeness (each 0-100) and overall score.
2. Check if candidate's answer matches actual repository implementation. If there is a mismatch (e.g. candidate claims auth is in controller but repository has middleware/auth.js), explicitly note the mismatch in missingConcepts or feedback.
3. Identify 2-3 specific strengths.
4. Identify 2-3 missing concepts or technical areas needing depth.
5. Provide concise, actionable feedback.
6. Provide an adaptive follow-up question based on candidate's answer.

Return ONLY valid JSON matching this schema:
{
  "scores": {
    "projectUnderstanding": 91,
    "structure": 84,
    "technicalDepth": 72,
    "clarity": 88,
    "completeness": 76,
    "overall": 82
  },
  "strengths": ["..."],
  "missingConcepts": ["..."],
  "feedback": "...",
  "followUpQuestion": "..."
}`;
};

const buildQuestionGenerationPrompt = (projectContext = {}) => {
  return `Generate realistic technical interview questions grounded in the following project repository:
${JSON.stringify(projectContext, null, 2)}

Return a JSON array of questions with category, difficulty, question text, expectedConcepts, and sourceFiles.`;
};

const buildAnswerEvaluationPrompt = (question, answer, expectedConcepts, repositoryContext) => {
  return `Evaluate candidate's interview response:
Question: ${question}
Answer: ${answer}
Expected Concepts: ${JSON.stringify(expectedConcepts)}
Repo Context: ${JSON.stringify(repositoryContext)}

Return JSON with scores (accuracy, completeness, depth, clarity, overall), strengths, missingConcepts, feedback, and followUpQuestion.`;
};

module.exports = {
  buildProjectExplanationPrompt,
  buildExplanationEvaluationPrompt,
  buildQuestionGenerationPrompt,
  buildAnswerEvaluationPrompt
};
