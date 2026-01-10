# Portfolio Deployment & Setup Guide

This guide covers setting up the portfolio with GitHub Pages, Sentry monitoring, CI/CD, and all production features.

## 🚀 Quick Start for GitHub Pages

### 1. Repository Setup
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial portfolio setup"

# Create GitHub repository
# Go to github.com and create a new repository
# Then link and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Environment Variables
Create a `.env.local` file for local development (never commit this):

```env
# Database (optional for GitHub Pages)
DATABASE_URL=postgresql://user:pass@localhost:5432/portfolio

# Sentry (optional)
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project-id
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project-id

# Google Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# App Version
VITE_APP_VERSION=1.0.0
```

### 3. GitHub Secrets
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `SENTRY_DSN` - Your Sentry DSN
- `GOOGLE_ANALYTICS_ID` - Your GA4 measurement ID

### 4. Deploy Manually
```bash
# Build and deploy to GitHub Pages
npm run deploy
```

## 🔄 CI/CD Automation

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Runs on every push to main/master**
2. **Performs checks:**
   - TypeScript compilation
   - Unit tests with coverage
   - Build process
3. **Deploys to GitHub Pages**
4. **Uses environment variables from secrets**

### Manual Deployment via GitHub Actions
```bash
# Push to main branch
git add .
git commit -m "Update portfolio"
git push origin main

# GitHub Actions will automatically build and deploy
```

## 🛡️ Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Documentation**: 30 requests per minute per IP
- **Strict endpoints**: 10 requests per minute per IP
- **Disabled** in production when using static data (GitHub Pages)

### Security Headers
```javascript
// Automatically added:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Powered-By: removed
```

## 📊 Monitoring & Analytics

### Sentry Error Monitoring
- **Frontend**: `@sentry/react` + `@sentry/tracing`
- **Backend**: `@sentry/node`
- **Configuration**: `client/src/lib/sentry.config.ts` & `server/sentry.config.ts`
- **Features**:
  - Error tracking with stack traces
  - Performance monitoring (10% sample rate)
  - Environment-based initialization
  - Data scrubbing for privacy

### Google Analytics 4
- **Setup**: Add `VITE_GOOGLE_ANALYTICS_ID` to environment
- **Tracking**: Page views, events, user engagement

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# CI mode with coverage
npm run test:ci

# Verbose output
npm run test:verbose
```

### Test Coverage
- **Target**: 70% coverage across all metrics
- **Includes**: Components, hooks, utilities
- **Excludes**: Main entry points, configuration files

### Writing Tests
```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('should render title', () => {
    render(<SectionHeading title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## 📚 API Documentation

### Accessing Swagger Docs
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

### Available Endpoints
```bash
GET /api/experiences     # Professional experiences
GET /api/projects        # Projects portfolio
GET /api/skills          # Technical skills
GET /api/personal-info   # Personal information
GET /api/blogs           # Blog posts
```

### Example API Response
```json
{
  "id": 1,
  "title": "Senior Software Engineer",
  "company": "Technonext",
  "period": "Jun 2025 – Present",
  "description": ["Working on Ticket Parsing...", "Built LLM-powered pipeline..."]
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. GitHub Pages Deployment Fails
```bash
# Check if dist/public exists
npm run build
ls dist/public

# Verify GitHub Pages settings
# Settings → Pages → Source → GitHub Actions
```

#### 2. Sentry Not Working
- Ensure `SENTRY_DSN` is set in environment
- Check that `NODE_ENV=production`
- Verify DSN format: `https://xxx.ingest.sentry.io/xxx`

#### 3. Rate Limiting Issues
- In development, rate limiting is active
- In production with GitHub Pages, it's disabled (no API calls)
- If using backend, adjust limits in `server/rate-limit.ts`

#### 4. Tests Failing
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
npm ci

# Run with verbose output
npm run test:verbose
```

## 📦 Production Checklist

- [ ] GitHub repository created
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Environment variables configured
- [ ] Sentry DSN added (optional but recommended)
- [ ] Google Analytics ID added (optional)
- [ ] GitHub Actions secrets configured
- [ ] Tests passing locally
- [ ] Build completes without errors
- [ ] API documentation accessible
- [ ] Rate limiting configured
- [ ] Security headers verified
- [ ] Error monitoring active

## 🔧 Advanced Configuration

### Custom Domain
1. Add custom domain to GitHub Pages settings
2. Create `CNAME` file in `client/public/` with your domain
3. Update DNS records

### Database (Optional)
If you want to use a database instead of static data:
1. Set up PostgreSQL
2. Add `DATABASE_URL` to environment
3. Run `npm run db:push`
4. Remove static data fallback from hooks

### Performance Optimization
- Images are optimized and use WebP format
- Code splitting is automatic with Vite
- Lazy loading for components
- Minimal bundle size with esbuild

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review GitHub Actions logs
3. Check Sentry dashboard for errors
4. Review console output in development

---

**Note**: This portfolio is designed for GitHub Pages deployment with static data. All API calls are mocked to use local data, making it perfect for static hosting without backend infrastructure.