# 🚀 Modern AI/ML Engineer Portfolio

A production-ready, full-stack portfolio website built with modern technologies. Features include error monitoring, analytics, automated deployment, and a complete AI/ML showcase.

## 🎯 Quick Start

```bash
# Clone and install
git clone <your-repo>
cd modern-portfolio
npm install

# Start development
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **TanStack Query** - Server state management
- **Wouter** - Routing

### Backend (Optional)
- **Node.js + Express** - Server
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe queries
- **Passport.js** - Authentication

### Monitoring & Analytics
- **Sentry** - Error tracking
- **Google Analytics 4** - User analytics

### DevOps
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting
- **Vite** - Build tool
- **esbuild** - Server bundling

## 📁 Project Structure

```
modern-portfolio/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities (Sentry, Analytics)
│   │   └── data/          # Static portfolio data
│   └── index.html
├── server/                 # Backend (optional)
│   ├── index.ts           # Entry point
│   ├── routes.ts          # API routes
│   ├── sentry.config.ts   # Error monitoring
│   └── rate-limit.ts      # DDoS protection
├── shared/                 # Shared types & schemas
│   ├── routes.ts          # API route definitions
│   └── schema.ts          # Database schema
├── script/                 # Build scripts
│   └── build.ts           # Production build
├── .github/workflows/      # CI/CD
│   └── deploy.yml         # GitHub Actions
└── data/                   # CV/LaTeX files
```

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended)
```bash
# 1. Create GitHub repository
# 2. Push your code
git add .
git commit -m "Initial portfolio"
git push origin main

# 3. Enable GitHub Pages
# Settings → Pages → Source: GitHub Actions

# 4. Deploy manually (optional)
npm run deploy
```

### Option 2: Vercel/Netlify
```bash
# Connect your GitHub repo
# Build command: npm run build
# Output directory: dist/public
```

### Option 3: Self-hosted
```bash
# Build and start
npm run build
npm run start

# Server runs on http://localhost:5000
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for development:

```env
# Google Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=G-XNZ049R7NF

# Sentry (optional)
VITE_SENTRY_DSN=https://your-dsn.ingest.sentry.io/project-id
SENTRY_DSN=https://your-dsn.ingest.sentry.io/project-id

# Database (optional - only if using backend)
DATABASE_URL=postgresql://user:pass@localhost:5432/portfolio

# App version
VITE_APP_VERSION=1.0.0
```

### GitHub Secrets (for CI/CD)

Add to Settings → Secrets and variables → Actions:

- `SENTRY_DSN` - Error monitoring
- `GOOGLE_ANALYTICS_ID` - Analytics tracking

## 📝 Customization

### 1. Update Portfolio Data

Edit `client/src/data/portfolio-data.ts`:

```typescript
export const portfolioData = {
  personalInfo: {
    name: "Your Name",
    role: "AI/ML Engineer",
    bio: "Your bio...",
    email: "your@email.com",
    // ... more fields
  },
  experiences: [
    {
      title: "Senior Engineer",
      company: "Your Company",
      period: "2023 - Present",
      description: ["Achievement 1", "Achievement 2"],
    },
  ],
  projects: [
    {
      title: "Project Name",
      description: "What it does",
      techStack: ["React", "TypeScript"],
      link: "https://github.com/...",
    },
  ],
  // ... skills, blogs, etc.
};
```

### 2. Customize Styling

Edit `client/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6; /* Your brand color */
  --secondary: #8b5cf6;
}
```

### 3. Add/Remove Sections

Edit `client/src/pages/Home.tsx`:

```tsx
// Add new section
<section id="new-section" className="py-24 md:py-32">
  <div className="container mx-auto px-4">
    <SectionHeading title="New Section" subtitle="Description" />
    {/* Your content */}
  </div>
</section>
```

### 4. Update Images

Place images in `client/public/images/`:
- Profile: `profile.jpg` or `profile.webp`
- Blog thumbnails: `blog-*.jpg`
- Project screenshots: `project-*.jpg`

**Recommended sizes:**
- Profile: 400×400px (square)
- Blog thumbnails: 1200×675px (16:9)
- Project cards: 800×600px (4:3)

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:ci

# Verbose output
npm run test:verbose
```

**Current test coverage:**
- ✅ SectionHeading component
- ✅ Portfolio data structure
- ✅ Component rendering

## 🔍 Monitoring & Analytics

### Sentry Error Tracking
- **Frontend**: Catches client-side errors
- **Backend**: Catches server errors (if using backend)
- **Performance**: Monitors page load times
- **Setup**: Add DSN to environment variables

### Google Analytics 4
- **Page views**: Automatic tracking
- **Events**: Custom event tracking
- **User behavior**: Engagement metrics
- **Setup**: Add GA4 ID to environment variables

## 🛡️ Security Features

### Rate Limiting
- **Development**: Disabled (unlimited requests)
- **Production**: 500 requests/minute per IP
- **GitHub Pages**: Disabled (static only)

### Security Headers
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Data Privacy
- ✅ No personal data in client-side code
- ✅ IP addresses scrubbed from Sentry
- ✅ Query parameters removed from URLs
- ✅ GDPR compliant analytics

## 📊 Performance

### Build Optimization
- **Vite**: Fast HMR in development
- **esbuild**: Optimized production builds
- **Code splitting**: Automatic with Vite
- **Image optimization**: WebP format

### Bundle Size
- **Frontend**: ~150KB (gzipped)
- **Server**: ~50KB (if used)
- **Total**: <200KB initial load

### Loading Strategy
- ✅ Lazy loading for images
- ✅ Component code splitting
- ✅ Static data (no API calls)
- ✅ Optimized fonts

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
on: [push, workflow_dispatch]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run check
      - run: npm run test:ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
```

### Manual Deployment
```bash
# Local deployment
npm run deploy

# This runs:
# 1. TypeScript check
# 2. Tests
# 3. Build
# 4. Deploy to GitHub Pages
```

## 🎨 Features Showcase

### ✅ Static Data Strategy
- No backend required
- Works on GitHub Pages
- Instant loading
- Always available

### ✅ Error Monitoring
- Sentry integration
- Automatic error reporting
- Performance tracking
- Release monitoring

### ✅ Analytics
- Google Analytics 4
- Real-time tracking
- User behavior insights
- Traffic sources

### ✅ Testing
- Jest + React Testing Library
- Component unit tests
- CI/CD integration
- Coverage reporting

### ✅ API Documentation
- Swagger/OpenAPI
- Interactive docs at `/api-docs`
- Endpoint testing
- Schema validation

### ✅ Rate Limiting
- DDoS protection
- IPv6 compatible
- Configurable limits
- Development friendly

## 🔧 Troubleshooting

### Common Issues

#### 1. Rate Limiting Blocks Development
```bash
# Check if rate limiting is disabled in dev
# server/index.ts should have:
if (process.env.NODE_ENV === 'production') {
  app.use(apiLimiter);
}
```

#### 2. Tests Fail
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
npm ci

# Check TypeScript
npm run check
```

#### 3. Build Fails
```bash
# Check for TypeScript errors
npm run check

# Clean and rebuild
rm -rf dist
npm run build
```

#### 4. Sentry Not Working
- Verify DSN format: `https://xxx.ingest.sentry.io/xxx`
- Check `NODE_ENV=production`
- Verify environment variables

## 📈 Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Check for outdated packages
npm outdated
```

### Performance Monitoring
- Check Sentry dashboard weekly
- Review Google Analytics monthly
- Monitor GitHub Actions logs
- Track bundle size changes

## 🚀 Advanced Usage

### Custom Domain
1. Add domain to GitHub Pages settings
2. Create `CNAME` file in `client/public/`
3. Update DNS records
4. Wait for propagation

### Database Integration
```bash
# Setup PostgreSQL
npm run db:push

# Update environment variables
DATABASE_URL=postgresql://...
```

### Email Notifications
```typescript
// Add contact form with rate limiting
// Use services like SendGrid, AWS SES
```

## 📚 Resources

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Sentry Docs](https://docs.sentry.io)
- [Google Analytics](https://analytics.google.com)

### Deployment Guides
- [GitHub Pages](https://pages.github.com)
- [Vercel](https://vercel.com/docs)
- [Netlify](https://docs.netlify.com)

## 🤝 Contributing

This is your portfolio! Feel free to:

1. **Add features** - New sections, animations, etc.
2. **Improve performance** - Optimize loading, reduce bundle size
3. **Enhance UX** - Better interactions, accessibility
4. **Update content** - New projects, blog posts

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

---

## 🎯 Summary

**What you have:**
- ✅ Production-ready portfolio
- ✅ Error monitoring with Sentry
- ✅ Analytics with Google Analytics
- ✅ Automated CI/CD with GitHub Actions
- ✅ Testing infrastructure
- ✅ API documentation
- ✅ DDoS protection
- ✅ Static deployment support

**What to do next:**
1. Update `portfolio-data.ts` with your content
2. Add your images to `public/images/`
3. Configure environment variables
4. Deploy to GitHub Pages
5. Monitor with Sentry & Analytics

**Ready to go live!** 🚀