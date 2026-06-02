# Local Development Guide for local.byronwade.com

This guide will help you set up and run the local business directory platform locally for development.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun
- Docker (optional, for local database)
- Git

### 1. Setup Environment

Run the automated setup script:
```bash
./scripts/setup-local.sh
```

Or manually:
```bash
# Copy environment template
cp env.local.example .env.local

# Add local domain to hosts file (macOS/Linux)
echo "127.0.0.1 local.byronwade.com" | sudo tee -a /etc/hosts

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Edit `.env.local` and update with your actual API keys:
```bash
# Required for portfolio data
GITHUB_API_TOKEN=your_github_token_here

# Optional: Local business directory features
MAPS_API_KEY=your_maps_api_key_here
GEOCODING_API_KEY=your_geocoding_api_key_here
```

### 3. Start Development Server

#### Option A: Direct Development
```bash
npm run dev:local
```

#### Option B: With Turbo (faster builds)
```bash
npm run dev:local:turbo
```

#### Option C: Docker Development
```bash
npm run docker:local
```

### 4. Access Your Local Site

Visit: **http://local.byronwade.com:3001**

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev:local` | Start development server on local.byronwade.com:3001 |
| `npm run dev:local:turbo` | Start with Turbopack for faster builds |
| `npm run build:local` | Build for local development |
| `npm run start:local` | Start production server locally |
| `npm run docker:local` | Start with Docker (includes database) |
| `npm run docker:local:down` | Stop Docker services |

## 🐳 Docker Development

The Docker setup includes:
- **local-byronwade-dev**: Next.js development server
- **local-db**: PostgreSQL database
- **local-redis**: Redis cache

### Start Docker Services
```bash
npm run docker:local
```

### View Logs
```bash
docker-compose -f docker-compose.local.yml logs -f local-byronwade
```

### Stop Services
```bash
npm run docker:local:down
```

## 📁 Project Structure

```
byronwade.com/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions
├── types/                  # TypeScript types
├── public/                 # Static assets
├── scripts/                # Development scripts
├── docker-compose.local.yml # Local Docker setup
├── Dockerfile.local        # Development Dockerfile
├── env.local.example       # Environment template
└── LOCAL_DEVELOPMENT.md    # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Development server port | Yes |
| `HOSTNAME` | Local hostname | Yes |
| `GITHUB_API_TOKEN` | GitHub API access token | Yes |
| `MAPS_API_KEY` | Maps API key for location features | No |
| `GEOCODING_API_KEY` | Geocoding API key | No |

### Local Features

The local development environment includes:
- ✅ Hot reloading with Fast Refresh
- ✅ Source maps for debugging
- ✅ Local database (PostgreSQL)
- ✅ Local cache (Redis)
- ✅ Debug logging
- ✅ Performance monitoring disabled
- ✅ Image optimization disabled for speed

## 🐛 Debugging

### Node.js Debugging
The Docker setup includes Node.js debugging on port 9229:
```bash
# Attach debugger in VS Code
# Add to launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Docker: Attach to Node",
  "port": 9229,
  "address": "localhost",
  "localRoot": "${workspaceFolder}",
  "remoteRoot": "/app"
}
```

### Browser Debugging
- Open Chrome DevTools
- Use React Developer Tools extension
- Check Network tab for API calls

### Database Debugging
```bash
# Connect to local database
docker exec -it local-byronwade-db psql -U local_user -d local_byronwade
```

## 📊 Performance

### Development Optimizations
- Disabled image optimization
- Disabled font optimization
- Enabled source maps
- Fast Refresh enabled
- Turbopack available

### Monitoring
```bash
# View resource usage
docker stats local-byronwade-dev

# View logs
docker-compose -f docker-compose.local.yml logs -f
```

## 🔄 Updates

### Update Dependencies
```bash
npm update
npm run docker:local:down
npm run docker:local
```

### Reset Development Environment
```bash
# Clear all caches
npm run clear

# Reset Docker volumes
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up --build
```

## 🚨 Troubleshooting

### Common Issues

**Port 3001 already in use:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Docker container won't start:**
```bash
docker-compose -f docker-compose.local.yml down
docker system prune -f
docker-compose -f docker-compose.local.yml up --build
```

**Hostname not resolving:**
```bash
# Check /etc/hosts
cat /etc/hosts | grep local.byronwade.com

# Add manually if missing
echo "127.0.0.1 local.byronwade.com" | sudo tee -a /etc/hosts
```

**Database connection issues:**
```bash
# Check if database is running
docker ps | grep local-db

# Restart database
docker-compose -f docker-compose.local.yml restart local-db
```

## 📞 Support

For issues specific to local.byronwade.com development:
1. Check this guide first
2. Review Docker logs
3. Check environment variables
4. Verify hostname resolution

---

**Happy coding! 🎉**
