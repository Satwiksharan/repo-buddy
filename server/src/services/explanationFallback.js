/**
 * Deterministic Fallback Engine for Project Explanations
 * Ensures RepoBuddy continues working gracefully when AI API is unavailable.
 */

class ExplanationFallback {
  /**
   * Generate grounded fallback explanation based on repository context
   * @param {Object} projectContext
   */
  generateFallback(projectContext = {}) {
    const name = projectContext.project?.name || 'CampusConnect';
    const tech = projectContext.technologies || {};
    const frontend = Array.isArray(tech.frontend) ? tech.frontend : ['React', 'Tailwind CSS'];
    const backend = Array.isArray(tech.backend) ? tech.backend : ['Node.js', 'Express.js'];
    const database = Array.isArray(tech.database) ? tech.database : ['MongoDB', 'Mongoose'];
    const auth = Array.isArray(tech.authentication) ? tech.authentication : ['JWT'];

    const arch = projectContext.architecture?.primaryPattern || 'Client-Server';

    const stackStr = [
      ...frontend,
      ...backend,
      ...database
    ].join(', ');

    const summary30s = `"${name} is a full-stack web application built using ${stackStr}. It addresses core domain workflows by providing a clean user portal backed by a RESTful API. The application follows a ${arch} architecture separating client state management from server business logic."`;

    const summary1m = `"${name} was developed to solve student engagement and data management challenges by consolidating user actions into a streamlined web interface.

The application utilizes ${frontend.join(' and ') || 'React'} for frontend user interactions, communicating over HTTP endpoints with an ${backend.join(' and ') || 'Express.js'} server. Data persistence is managed via ${database.join(' and ') || 'MongoDB'}, maintaining document collections for rapid querying.

A key technical decision was separating API routes into dedicated controller modules to enforce single responsibility principles."`;

    const summary3m = `"${name} is a full-stack web project designed to streamline user operations through a scalable architecture.

Architecture & Stack:
The application employs a ${arch} structure featuring a ${frontend.join('/') || 'React'} frontend layer communicating with a ${backend.join('/') || 'Express'} API backend. Data is persisted in ${database.join('/') || 'MongoDB'}.

Authentication & Data Flow:
User authorization is managed using ${auth.join('/') || 'JWT'} tokens. Incoming HTTP requests pass through verification middleware before delegating execution to backend controllers.

Technical Challenges & Future Improvements:
A key technical challenge was ensuring schema validation and fast query response times under high concurrency. If scaling this project further, introducing a Redis caching layer for frequent read queries and automated E2E test suites would further enhance reliability."`;

    const techDecisions = [
      {
        technology: database[0] || 'MongoDB',
        question: `Why did you choose ${database[0] || 'MongoDB'}?`,
        explanation: `Document flexibility allowed rapid iteration on user schemas without requiring complex SQL migration scripts during initial development.`
      },
      {
        technology: auth[0] || 'JWT',
        question: `Why did you use ${auth[0] || 'JWT'} for authentication?`,
        explanation: `Stateless JWT tokens enable stateless API authentication across distributed endpoints without server-side session lookup overhead.`
      }
    ];

    return {
      isFallback: true,
      summary30s,
      summary1m,
      summary3m,
      techDecisions,
      sections: {
        overview: `${name} full-stack web application`,
        architecture: `Follows a ${arch} layout with separated frontend and backend responsibilities.`,
        authentication: `Secured using ${auth.join(', ') || 'JWT'} token validation middleware.`,
        challenges: 'Managing concurrent state updates and database index optimizations.'
      }
    };
  }
}

module.exports = new ExplanationFallback();
