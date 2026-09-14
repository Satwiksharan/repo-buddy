/**
 * Deterministic Technology Stack Detector
 * Direct extraction of technologies, libraries, and frameworks from codebase package.json manifest files.
 * NOTE: As per product rules, deterministic manifest parsing is used for accuracy.
 */

class TechnologyDetector {
  /**
   * Detect technologies directly from repository files (especially package.json)
   * @param {Array<{path: string, content?: string}>} files
   */
  detectTechnologies(files = []) {
    const tech = {
      frontend: new Set(),
      backend: new Set(),
      database: new Set(),
      authentication: new Set(),
      testing: new Set(),
      deployment: new Set()
    };

    // Find all package.json files across the codebase tree (e.g. root, client/, server/)
    const packageJsonFiles = files.filter((f) => f.path && f.path.toLowerCase().endsWith('package.json'));
    const allDeps = {};
    const packageNames = [];

    packageJsonFiles.forEach((f) => {
      if (f.content) {
        try {
          const pkg = typeof f.content === 'string' ? JSON.parse(f.content) : f.content;
          if (pkg.name) packageNames.push(pkg.name);
          Object.assign(allDeps, pkg.dependencies || {}, pkg.devDependencies || {}, pkg.peerDependencies || {});
        } catch (e) {
          console.warn(`[TechnologyDetector] Could not parse package.json at ${f.path}:`, e.message);
        }
      }
    });

    // Detect TypeScript presence
    if (allDeps['typescript'] || files.some((f) => f.path.endsWith('.ts') || f.path.endsWith('.tsx') || f.path.endsWith('tsconfig.json'))) {
      tech.frontend.add('TypeScript');
    }

    // Frontend Frameworks & UI Libraries
    if (allDeps['react'] || allDeps['react-dom']) tech.frontend.add('React');
    if (allDeps['next']) tech.frontend.add('Next.js');
    if (allDeps['vue']) tech.frontend.add('Vue.js');
    if (allDeps['nuxt']) tech.frontend.add('Nuxt');
    if (allDeps['svelte'] || allDeps['@sveltejs/kit']) tech.frontend.add('Svelte');
    if (allDeps['@angular/core']) tech.frontend.add('Angular');
    if (allDeps['tailwindcss'] || files.some((f) => f.path.includes('tailwind.config'))) tech.frontend.add('Tailwind CSS');
    if (allDeps['vite'] || files.some((f) => f.path.includes('vite.config'))) tech.frontend.add('Vite');
    if (allDeps['webpack']) tech.frontend.add('Webpack');
    if (allDeps['redux'] || allDeps['@reduxjs/toolkit']) tech.frontend.add('Redux');
    if (allDeps['zustand']) tech.frontend.add('Zustand');
    if (allDeps['@tanstack/react-query'] || allDeps['react-query']) tech.frontend.add('React Query');
    if (allDeps['@mui/material'] || allDeps['@emotion/react']) tech.frontend.add('Material UI');
    if (allDeps['bootstrap']) tech.frontend.add('Bootstrap');
    if (allDeps['framer-motion']) tech.frontend.add('Framer Motion');
    if (allDeps['axios']) tech.frontend.add('Axios');

    // Backend Frameworks & Runtimes
    if (allDeps['express']) tech.backend.add('Express.js');
    if (allDeps['@nestjs/core']) tech.backend.add('NestJS');
    if (allDeps['fastify']) tech.backend.add('Fastify');
    if (allDeps['hono']) tech.backend.add('Hono');
    if (allDeps['koa']) tech.backend.add('Koa');
    if (allDeps['socket.io'] || allDeps['socket.io-client']) tech.backend.add('Socket.io');
    if (allDeps['graphql'] || allDeps['apollo-server'] || allDeps['@apollo/server']) tech.backend.add('GraphQL');
    if (allDeps['@trpc/server']) tech.backend.add('tRPC');

    // Non-JS backend fallbacks
    if (files.some((f) => f.path.includes('requirements.txt') || f.path.includes('pyproject.toml'))) {
      const pyContent = files.map((f) => f.content || '').join('\n');
      if (pyContent.includes('fastapi')) tech.backend.add('FastAPI');
      if (pyContent.includes('django')) tech.backend.add('Django');
      if (pyContent.includes('flask')) tech.backend.add('Flask');
      if (!tech.backend.size) tech.backend.add('Python');
    }
    if (files.some((f) => f.path.endsWith('pom.xml') || f.path.endsWith('build.gradle'))) {
      tech.backend.add('Spring Boot');
    }
    if (files.some((f) => f.path.endsWith('go.mod'))) {
      tech.backend.add('Go');
    }
    if (files.some((f) => f.path.endsWith('cargo.toml'))) {
      tech.backend.add('Rust');
    }

    // Node.js runtime detection
    if (allDeps['express'] || allDeps['koa'] || allDeps['@nestjs/core'] || allDeps['fastify'] || Object.keys(allDeps).length > 0) {
      tech.backend.add('Node.js');
    }

    // Database & ORMs
    if (allDeps['mongoose'] || allDeps['mongodb']) {
      tech.database.add('MongoDB');
      if (allDeps['mongoose']) tech.database.add('Mongoose');
    }
    if (allDeps['prisma'] || allDeps['@prisma/client']) {
      tech.database.add('Prisma ORM');
    }
    if (allDeps['drizzle-orm']) {
      tech.database.add('Drizzle ORM');
    }
    if (allDeps['sequelize']) {
      tech.database.add('Sequelize');
    }
    if (allDeps['typeorm']) {
      tech.database.add('TypeORM');
    }
    if (allDeps['pg']) {
      tech.database.add('PostgreSQL');
    }
    if (allDeps['mysql'] || allDeps['mysql2']) {
      tech.database.add('MySQL');
    }
    if (allDeps['redis'] || allDeps['ioredis']) {
      tech.database.add('Redis');
    }
    if (allDeps['@supabase/supabase-js']) {
      tech.database.add('Supabase');
    }

    // Authentication
    if (allDeps['jsonwebtoken']) tech.authentication.add('JWT (JSON Web Tokens)');
    if (allDeps['passport']) tech.authentication.add('Passport.js');
    if (allDeps['bcrypt'] || allDeps['bcryptjs']) tech.authentication.add('Bcrypt Hashing');
    if (allDeps['firebase'] || allDeps['firebase-admin']) tech.authentication.add('Firebase Auth');
    if (allDeps['next-auth'] || allDeps['@auth/core']) tech.authentication.add('NextAuth / Auth.js');
    if (allDeps['@clerk/clerk-sdk-node'] || allDeps['@clerk/nextjs']) tech.authentication.add('Clerk');
    if (allDeps['lucia']) tech.authentication.add('Lucia Auth');

    // Testing Frameworks
    if (allDeps['jest']) tech.testing.add('Jest');
    if (allDeps['vitest']) tech.testing.add('Vitest');
    if (allDeps['cypress']) tech.testing.add('Cypress');
    if (allDeps['@playwright/test']) tech.testing.add('Playwright');
    if (allDeps['mocha']) tech.testing.add('Mocha');

    // Deployment & DevOps
    if (files.some((f) => f.path.toLowerCase().includes('dockerfile'))) tech.deployment.add('Docker');
    if (files.some((f) => f.path.includes('docker-compose'))) tech.deployment.add('Docker Compose');
    if (files.some((f) => f.path.includes('.github/workflows'))) tech.deployment.add('GitHub Actions');

    return {
      frontend: Array.from(tech.frontend),
      backend: Array.from(tech.backend),
      database: Array.from(tech.database),
      authentication: Array.from(tech.authentication),
      testing: Array.from(tech.testing),
      deployment: Array.from(tech.deployment),
      rawDependenciesCount: Object.keys(allDeps).length,
      detectedManifests: packageJsonFiles.map((f) => f.path)
    };
  }
}

module.exports = new TechnologyDetector();
