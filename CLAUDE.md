# CLAUDE.md

**CRITICAL** - Respond in Korean.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm run dev` - Start development server with auto-reload
- **Build**: `pnpm run build` - Build the application for production
- **Production server**: `pnpm run start:prod` - Start production server
- **Linting**: `pnpm run lint` - Check code style and fix auto-fixable issues
- **Lint fix**: `pnpm run lint:fix` - Automatically fix linting issues

## Architecture Overview

This is a NestJS API server built with TypeScript, using Fastify as the HTTP adapter and Drizzle ORM for database operations. The application follows a modular architecture with strict separation of concerns.

### Core Architecture Patterns

- **Modular Structure**: Features organized as NestJS modules (Auth, Users, Admin)
- **Repository Pattern**: Data access abstracted through repository classes
- **Dependency Injection**: All dependencies managed through NestJS DI container
- **Global Configuration**: Centralized configuration using `src/conf/conf.ts`

### Key Architectural Components

1. **Application Bootstrap** (`src/main.ts`):
   - Uses Fastify adapter with cookies and CORS support
   - Global Zod validation pipes
   - HTTP logging and response time interceptors
   - Swagger API documentation at `/api`

2. **Module Structure**:
   - `AuthModule`: JWT authentication, login, registration
   - `UsersModule`: User management and profile operations
   - `AdminModule`: Administrative functionality
   - `DrizzleModule`: Global database connection and schema

3. **Configuration System** (`src/conf/conf.ts`):
   - Type-safe configuration using `registerAs`
   - Environment variables with sensible defaults
   - Separate configs for server, JWT, database, mailer, etc.

### Database Architecture

- **ORM**: Drizzle ORM with PostgreSQL
- **Schema Organization**: Schemas defined in `src/drizzle/schemas/`
- **Tables**: Table definitions in `src/drizzle/tables/`
- **Connection**: Global DRIZZLE symbol injection pattern

### Request/Response Architecture

- **Standardized Responses**: All APIs use `createResponse()` and `createError()` utilities
- **DTO Pattern**: Request/response types defined in `dto/` directory
- **Response Codes**: Centralized in `code/response.code.ts`
- **Messages**: Centralized in `code/message.code.ts`

### Path Aliases

```typescript
"@/*": ["src/*"]     // Internal modules
"@dto/*": ["dto/*"]  // Data Transfer Objects
"@code/*": ["code/*"] // Response/message codes
```

### Security Implementation

- **JWT Authentication**: Tokens stored in HttpOnly cookies
- **Password Hashing**: bcrypt with appropriate rounds
- **Request Limiting**: Global throttling (60 requests/minute)
- **CORS**: Configured for credentials and specific headers

### Utility Functions

- `createResponse<T>(code, message, data)`: Standardized success responses
- `createError(code, message)`: Standardized error responses
- `setCookie()`: Utility for setting secure HTTP cookies

### Development Standards

- **ESLint Configuration**: Stylistic rules with TypeScript support
- **Code Style**: 2-space indentation, single quotes, trailing commas in arrays/objects
- **TypeScript**: Non-strict mode with decorator support
- **Validation**: Zod schemas for request validation

### Module Dependencies

The application uses a clean dependency graph:
- Controllers depend on Services
- Services depend on Repositories
- Repositories depend on Drizzle connection
- All modules can access global ConfigService

When working with this codebase, always maintain the existing architectural patterns and use the provided utility functions for consistency.
