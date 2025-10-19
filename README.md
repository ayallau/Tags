# Tags Monorepo

A modern tagging system built with TypeScript, React, and Node.js using a monorepo architecture.

## 🏗️ Architecture

This monorepo uses:

- **pnpm workspaces** for package management
- **Turborepo** for build orchestration and caching
- **TypeScript ESM** with NodeNext module resolution
- **Shared packages** for code reuse across applications

## 📁 Project Structure

```
Tags/
├── apps/                    # Applications
│   ├── web/                # React + Vite frontend
│   ├── server/             # Express.js backend
│   └── mobile/             # Mobile app (placeholder)
├── packages/                # Shared packages
│   ├── models/             # Zod schemas & TypeScript types
│   ├── api/                # Axios client & API endpoints
│   ├── config/             # Shared configuration & constants
│   ├── tsconfig/           # Shared TypeScript configuration
│   └── eslint-config/      # Shared ESLint configuration
├── .github/workflows/      # CI/CD pipelines
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers (web + server)
pnpm dev

# Or start individual apps
pnpm dev --filter=@tags/web
pnpm dev --filter=@tags/server
```

## 📋 Available Scripts

### Root Level

```bash
# Development
pnpm dev                    # Start all apps in development mode

# Build
pnpm build                  # Build all packages and apps
pnpm build --filter=@tags/* # Build only packages

# Quality Checks
pnpm typecheck              # Type check all packages
pnpm lint                   # Lint all packages
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code with Prettier
pnpm format:check           # Check code formatting

# Testing
pnpm test                   # Run all tests

# Utilities
pnpm clean                  # Clean all build artifacts
```

### Package Level

Each package has its own scripts:

```bash
# Example: Run scripts for specific package
pnpm --filter=@tags/web dev
pnpm --filter=@tags/server build
pnpm --filter=@tags/models typecheck
```

## 🔧 Development

### Adding New Packages

1. Create package directory in `packages/`
2. Add `package.json` with `"name": "@tags/package-name"`
3. Update `pnpm-workspace.yaml` if needed
4. Add package to dependencies in consuming apps

### Adding New Apps

1. Create app directory in `apps/`
2. Add `package.json` with `"name": "@tags/app-name"`
3. Configure TypeScript and ESLint
4. Add to Turbo pipeline in `turbo.json`

### Shared Packages

#### @tags/models

Zod schemas and TypeScript types for:

- User management
- Tag system
- Authentication
- API responses

#### @tags/api

Axios-based API client with:

- Automatic token refresh
- Request/response interceptors
- Type-safe endpoints
- Error handling

#### @tags/config

Shared configuration including:

- Application constants
- Feature flags
- Environment settings
- Validation schemas

## 🌐 Applications

### Web App (`apps/web`)

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Port**: 5173 (development)
- **Build**: `pnpm build --filter=@tags/web`

### Server (`apps/server`)

- **Framework**: Express.js + TypeScript
- **Database**: MongoDB
- **Authentication**: JWT + Passport
- **Port**: 3001 (development)
- **Build**: `pnpm build --filter=@tags/server`

### Mobile (`apps/mobile`)

- **Status**: Placeholder for future Expo implementation
- **Framework**: React Native (planned)

## 🔒 Environment Variables

Each app has its own `.env.example` file:

- `apps/server/env.example` - Server configuration
- `apps/web/env.example` - Web app configuration
- `apps/mobile/env.example` - Mobile app configuration

Copy these files to `.env` and update the values.

## 🚦 CI/CD

GitHub Actions workflow includes:

- **Lint**: Code quality checks
- **TypeCheck**: TypeScript validation
- **Build**: Package and app builds
- **Test**: Test execution
- **Format Check**: Code formatting validation

## 📦 Package Management

### Adding Dependencies

```bash
# Add to root (dev dependencies)
pnpm add -D typescript

# Add to specific package
pnpm --filter=@tags/web add react-router-dom

# Add workspace dependency
pnpm --filter=@tags/web add @tags/models
```

### Workspace Dependencies

Use `workspace:*` for internal packages:

```json
{
  "dependencies": {
    "@tags/models": "workspace:*",
    "@tags/api": "workspace:*"
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **TypeScript errors**: Run `pnpm typecheck` to identify issues
2. **Build failures**: Ensure all packages are built with `pnpm build --filter=@tags/*`
3. **Import errors**: Check that workspace dependencies are properly configured
4. **Cache issues**: Run `pnpm clean` and rebuild

### Development Tips

- Use `pnpm dev` to start all apps simultaneously
- Check `turbo.json` for build pipeline configuration
- Use `--filter` flag to run commands on specific packages
- Monitor `.turbo/` directory for cache management

## 📚 Additional Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo)
- [TypeScript ESM](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks: `pnpm typecheck && pnpm lint && pnpm test`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
