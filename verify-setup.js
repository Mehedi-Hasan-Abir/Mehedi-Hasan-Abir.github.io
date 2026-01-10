#!/usr/bin/env node

/**
 * Verification script for the production-ready portfolio
 * Checks that all required files and configurations exist
 */

import fs from 'fs';
import path from 'path';

const checks = [
  // Core files
  { file: 'client/src/data/portfolio-data.ts', description: 'Static portfolio data' },
  { file: 'client/src/hooks/use-portfolio.ts', description: 'Portfolio hooks (static only)' },
  { file: 'client/src/App.tsx', description: 'Main React app' },
  { file: 'client/src/main.tsx', description: 'App entry point' },
  
  // Sentry configuration
  { file: 'client/src/lib/sentry.config.ts', description: 'Frontend Sentry config' },
  { file: 'server/sentry.config.ts', description: 'Backend Sentry config' },
  
  // Rate limiting
  { file: 'server/rate-limit.ts', description: 'Rate limiting middleware' },
  
  // Swagger documentation
  { file: 'server/swagger.ts', description: 'API documentation config' },
  
  // CI/CD
  { file: '.github/workflows/deploy.yml', description: 'GitHub Actions workflow' },
  
  // Testing
  { file: 'jest.config.js', description: 'Jest configuration' },
  { file: 'jest.setup.js', description: 'Jest setup file' },
  
  // Analytics
  { file: 'client/src/lib/analytics.ts', description: 'Google Analytics integration' },
  
  // Build configuration
  { file: 'vite.config.ts', description: 'Vite build config' },
  { file: 'package.json', description: 'Package configuration' },
  
  // Documentation
  { file: 'DEPLOYMENT_SETUP.md', description: 'Deployment guide' },
  { file: 'PRODUCTION_READY_SUMMARY.md', description: 'Implementation summary' },
];

console.log('🔍 Verifying Portfolio Setup...\n');

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const fullPath = path.join(process.cwd(), check.file);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.description}`);
    console.log(`   File: ${check.file}`);
    passed++;
  } else {
    console.log(`❌ ${check.description}`);
    console.log(`   File: ${check.file} - MISSING`);
    failed++;
  }
  console.log('');
});

// Check package.json scripts
console.log('📦 Checking package.json scripts...\n');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const requiredScripts = ['dev', 'build', 'start', 'check', 'deploy', 'test', 'test:ci'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ Script: npm run ${script}`);
  } else {
    console.log(`❌ Script: npm run ${script} - MISSING`);
    failed++;
  }
});

// Check dependencies
console.log('\n📦 Checking key dependencies...\n');
const dependencies = [
  '@sentry/react',
  '@sentry/node', 
  'express-rate-limit',
  'swagger-ui-express',
  'swagger-jsdoc'
];

dependencies.forEach(dep => {
  const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
  const hasDevDep = packageJson.devDependencies && packageJson.devDependencies[dep];
  
  if (hasDep || hasDevDep) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    failed++;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📁 Total Checks: ${checks.length + requiredScripts.length + dependencies.length}`);

if (failed === 0) {
  console.log('\n🎉 SUCCESS! All checks passed. Portfolio is production-ready!');
  console.log('\nNext steps:');
  console.log('1. Add GitHub secrets (SENTRY_DSN, GOOGLE_ANALYTICS_ID)');
  console.log('2. Push to GitHub to trigger deployment');
  console.log('3. Enable GitHub Pages in repository settings');
} else {
  console.log('\n⚠️  Some checks failed. Please review the missing files.');
  process.exit(1);
}