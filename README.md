# La Bodega 2.0 API

Serverless backend for **La Bodega**, a personal vault for storing account credentials grouped into categories. The API is written in TypeScript and runs as one AWS Lambda function per route behind an API Gateway **HTTP API**, backed by a MySQL database.

## Tech stack

- **Runtime:** Node.js 20 on AWS Lambda (API Gateway HTTP API, payload format v2)
- **Language:** TypeScript
- **Database:** MySQL via [`mysql2`](https://www.npmjs.com/package/mysql2)
- **Auth:** JWT ([`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)) and bcrypt hashing ([`bcryptjs`](https://www.npmjs.com/package/bcryptjs))
- **Build:** [esbuild](https://esbuild.github.io/) bundles each handler into a self-contained file
- **Local dev:** [Serverless Framework](https://www.serverless.com/) + [`serverless-offline`](https://github.com/dherault/serverless-offline)

## Project structure

```
src/
├── config/
│   ├── database.ts        # MySQL connection pool (module-scoped, reused across warm invocations)
│   └── env.ts             # Loads and types environment variables
├── functions/             # Lambda entry points, one file per route
│   ├── auth/              # signup, login, check, current
│   ├── category/          # create, get_all
│   └── account/           # create, get_all_by_category
├── modules/               # Business logic, framework-agnostic
│   └── <module>/
│       ├── <module>.service.ts     # Validation and business rules
│       ├── <module>.repository.ts  # SQL queries
│       ├── dtos/                   # Request/response shapes
│       └── row_types/              # Database row types
├── types/                 # Shared types (errors, pagination)
└── utils/                 # Lambda helpers, JWT, hashing, AppError
```

Each handler in `src/functions` parses the request (body, path and query parameters, bearer token), calls the matching service, and returns a JSON response. Services throw `AppError(statusCode, message)` for expected failures, which handlers turn into `{ "error": "<message>" }` responses. Any other error is logged and returned as a `500`.

## Getting started

### Prerequisites

- Node.js 20+
- A reachable MySQL database with the `USER`, `AUTH`, `CATEGORY` and `ACCOUNT` tables

### Installation

```bash
npm install
cp .env.example .env
```

### Environment variables

Fill in `.env`:

| Variable         | Description                                    | Default       |
| ---------------- | ---------------------------------------------- | ------------- |
| `MYSQL_HOST`     | MySQL host                                     | —             |
| `MYSQL_USER`     | MySQL user                                     | —             |
| `MYSQL_PASSWORD` | MySQL password                                 | —             |
| `MYSQL_DATABASE` | Database name                                  | —             |
| `MYSQL_PORT`     | MySQL port                                     | `3306`        |
| `NODE_ENV`       | Environment name                               | `development` |
| `JWT_KEY`        | Secret used to sign and verify JWTs            | —             |

### Running locally

```bash
npm run build      # Bundle handlers into dist/functions
npm run start:dev  # Start serverless-offline
```

`serverless-offline` serves the API on `http://localhost:3000` by default. Rebuild after changing source files, since the offline server runs the bundled output in `dist/`.

## Scripts

| Script                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run build`        | Bundle every `*.handler.ts` with esbuild (minified, with source maps) |
| `npm run start:dev`    | Run the API locally with `serverless-offline`        |
| `npm run format`       | Format the codebase with Prettier                    |
| `npm run format:check` | Check formatting without writing changes             |

## API reference

All request and response bodies are JSON. Protected routes require an `Authorization: Bearer <jwt>` header. Tokens expire after **1 hour**.

### Auth

| Method | Path            | Auth | Description                                      |
| ------ | --------------- | ---- | ------------------------------------------------ |
| POST   | `/auth/signup`  | No   | Create a user and return a JWT                   |
| POST   | `/auth/login`   | No   | Log in and return a JWT                          |
| GET    | `/auth/check`   | Yes  | Validate the session and return the user ID      |
| GET    | `/auth/current` | Yes  | Return the current user's ID and username        |

**`POST /auth/signup`** and **`POST /auth/login`**

```json
{ "username": "jane", "keyHash": "<client-side hash of the master key>" }
```

Response `200`:

```json
{ "jwt": "<token>" }
```

The client sends a hash of the user's master key instead of the key itself; the server hashes it again with bcrypt before storing it.

**`GET /auth/check`** returns `{ "id": 1 }`.

**`GET /auth/current`** returns `{ "id": 1, "username": "jane" }`.

### Categories

| Method | Path            | Auth | Description                          |
| ------ | --------------- | ---- | ------------------------------------ |
| GET    | `/category/all` | Yes  | List the current user's categories   |
| POST   | `/category`     | Yes  | Create a category                    |

**`POST /category`**

```json
{ "name": "Social media" }
```

Response `201`: `{ "id": 3 }`

**`GET /category/all`** response `200`:

```json
[{ "id": 3, "name": "Social media" }]
```

### Accounts

| Method | Path                         | Auth | Description                                     |
| ------ | ---------------------------- | ---- | ----------------------------------------------- |
| GET    | `/account/all/{categoryId}`  | Yes  | List accounts in a category, paginated          |
| POST   | `/account`                   | Yes  | Create an account in one of the user's categories |

**`POST /account`**

```json
{
    "name": "Personal",
    "username": "jane.doe",
    "email": "jane@example.com",
    "password": "<value to store>",
    "platform": "Instagram",
    "categoryId": 3
}
```

Response `201`: `{ "id": 12 }`

**`GET /account/all/{categoryId}?page=1&limit=10`**

| Query param | Default | Notes        |
| ----------- | ------- | ------------ |
| `page`      | `1`     |              |
| `limit`     | `10`    | Capped at 100 |

Response `200`:

```json
{
    "data": [
        {
            "id": 12,
            "name": "Personal",
            "username": "jane.doe",
            "email": "jane@example.com",
            "password": "<stored value>",
            "platform": "Instagram",
            "creationDate": "2026-01-01T00:00:00.000Z",
            "lastModifiedDate": "2026-01-01T00:00:00.000Z"
        }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 1
}
```

Both account routes return `404` if the category doesn't exist or doesn't belong to the current user.

### Errors

Errors use a single shape:

```json
{ "error": "Invalid session" }
```

| Status | When                                                                |
| ------ | ------------------------------------------------------------------- |
| `400`  | Missing or malformed body, missing parameters, username already taken |
| `401`  | Missing, invalid or expired token; wrong username or key            |
| `404`  | User or category not found                                          |
| `500`  | Unexpected server error                                             |

## Deployment

AWS resources (Lambda functions, the API Gateway HTTP API and the database) are managed manually in the AWS console. `serverless.yml` is used only to run the API locally with `serverless-offline`, not to deploy.

To deploy a function:

1. Run `npm run build`.
2. Upload the bundled file for that function from `dist/functions/<module>/<action>.js`. Each bundle includes its dependencies, so `node_modules` isn't needed.
3. Set the handler to `<action>.handler` and configure the environment variables listed above.

CORS is configured on the API Gateway HTTP API. Local CORS settings in `serverless.yml` allow `https://labodega.velazduran.com` and `http://localhost:3000`.

## Code style

The project uses Prettier (4-space indent, single quotes, no semicolons, 120-character lines). Run `npm run format` before committing.
