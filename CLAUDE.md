# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Management
- Uses **pnpm** as the package manager
- Install dependencies: `pnpm install`

### Development Server
- Development mode: `pnpm run start:dev` (with file watching)
- Debug mode: `pnpm run start:debug` (with debugging enabled)
- Production mode: `pnpm run start:prod`

### Build & Code Quality
- Build the project: `pnpm run build`
- Format code: `pnpm run format`
- Lint and fix: `pnpm run lint`

### Testing
- Run unit tests: `pnpm run test`
- Run tests in watch mode: `pnpm run test:watch`
- Run e2e tests: `pnpm run test:e2e`
- Generate test coverage: `pnpm run test:cov`
- Debug tests: `pnpm run test:debug`

## Architecture Overview

This is a **NestJS** backend application with the following key architectural components:

### Core Stack
- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Configuration**: Environment-based with Joi validation

### Project Structure
- `src/main.ts` - Application entry point, bootstraps the NestJS app on port 3000 (or PORT env var)
- `src/app.module.ts` - Root application module with global configuration
- `src/common/database/` - Database connection and configuration module
- `test/` - E2E tests and Jest configuration

### Configuration Management
- Uses `@nestjs/config` with global configuration
- Environment validation via Joi schema
- Required environment variables:
  - `MONGODB_URI` - MongoDB connection string
  - `PORT` - Application port

### Database Architecture
- MongoDB integration through `@nestjs/mongoose`
- Async configuration using ConfigService
- Database module in `src/common/database/database.module.ts`

### Code Quality Setup
- **ESLint**: TypeScript-ESLint with Prettier integration
- **TypeScript**: Strict configuration with decorators enabled
- **Jest**: Unit and e2e testing framework
- **Prettier**: Code formatting

## Key Dependencies
- Core: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
- Database: `@nestjs/mongoose`, `mongoose`
- Configuration: `@nestjs/config`, `joi`
- Testing: `jest`, `supertest`, `@nestjs/testing`