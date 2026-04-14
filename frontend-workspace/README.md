# Tham AI Platform – Enterprise Edition

## Features
- AI-powered professional matching
- Moodle LMS integration
- Real-time notifications & chat
- Advanced search with filters
- Dark/light theme
- PWA with offline support
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- Centralized logging
- API client with retries & token refresh
- React Query for server state
- Jest testing suite

## Quick Start
\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## Production Build
\`\`\`bash
npm run build
docker build -t tham-platform .
docker run -p 8080:80 tham-platform
\`\`\`

## Environment Variables
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |
| VITE_SENTRY_DSN | Sentry DSN (optional) |
| VITE_LOG_LEVEL | DEBUG, INFO, WARN, ERROR |

## Testing
\`\`\`bash
npm test
npm run test:coverage
\`\`\`

## Deployment
Push to \`main\` branch triggers GitHub Actions to build and push Docker image.
