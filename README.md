# Chatter API

NestJS backend application with GraphQL and MongoDB for the Chatter chat application.

## Description

Backend API built with [NestJS](https://github.com/nestjs/nest) framework, providing GraphQL endpoints for the Chatter application.

## Tech Stack

- **Framework**: NestJS
- **API**: GraphQL with Apollo Server
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Testing**: Jest

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=chatter
PORT=3000
```

## Development

```bash
# Install all dependencies
pnpm install

# Development with hot reload
pnpm run start:dev

# Debug mode
pnpm run start:debug

# Production mode
pnpm run start:prod
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

## GraphQL Playground

When running in development mode, GraphiQL playground is available at:
```
http://localhost:3000/graphql
```

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
├── common/
│   └── database/        # Database configuration and patterns
└── users/               # Users module (GraphQL resolver, service, DTOs)
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org)
- [Mongoose Documentation](https://mongoosejs.com)
