# Lambda Migration Plan

Migrate this Express API to per-route AWS Lambda functions, built with esbuild and
tested locally with `serverless-offline`. Resources (Lambdas, API Gateway HTTP API,
RDS, etc.) are created manually in the AWS console — the Serverless Framework config
here is used **only** to drive `serverless-offline` locally, not for deployment.

Current architecture is a layered `router → controller → service → repository` setup
where only the router/controller layer is coupled to Express — services and
repositories are already framework-agnostic, so they carry over unchanged.

Decisions already made:
- One Lambda per route (not a single Express-adapter Lambda).
- API Gateway **HTTP API** (v2 payload format, `APIGatewayProxyEventV2`).
- Express is fully removed — no dual local-dev path. `serverless-offline` is the only
  way to run the API locally.

## 1. Dependencies

- Remove: `express`, `cors`, `@types/express`, `@types/cors`
- Add (dev): `@types/aws-lambda`, `serverless`, `serverless-offline`
- Keep: `bcryptjs`, `jsonwebtoken`, `mysql2`, `dotenv`, `esbuild`

## 2. New shared utils (`src/utils/`)

- **`lambda_response.utils.ts`** — builds `APIGatewayProxyStructuredResultV2` (JSON
  body, status code, `Content-Type` header).
- **`lambda_handler.utils.ts`** — `withHandler(fn)` wrapper replicating the current
  per-controller try/catch: catches `AppError` and maps it to its status/message,
  catches unknown errors and logs + returns 500. Removes the duplicated
  error-handling boilerplate that currently lives in every controller function.
- **`require_auth.utils.ts`** — replaces `middleware/auth.middleware.ts`.
  `getUserId(event)` reads `event.headers.authorization`, verifies the JWT via the
  existing `jsonwebtoken.utils.ts`, and returns `userId`, or throws
  `AppError(401, ...)` which `withHandler` turns into a proper response.

## 3. Config changes

- `config/env.ts`: move `import 'dotenv/config'` here (currently only in
  `index.ts`) so every handler entrypoint loads env vars regardless of which
  Lambda cold-starts first.
- `config/database.ts`: lower `connectionLimit` to 1–2. The pool stays at module
  scope (already structured this way) so warm containers reuse it, but Lambda
  concurrency means many containers running in parallel — a large per-container
  pool can exhaust RDS max connections.
- `config/cors.ts`: **delete**. CORS is configured on the API Gateway HTTP API in
  the console, and mirrored in `serverless.yml` (`httpApi.cors: true`) for local
  offline testing — not handled in application code.

## 4. Convert modules → per-route handlers

For each of the 8 existing routes, create `src/functions/{module}/{action}.ts`
exporting `handler`, folding the controller logic in directly. Service/repository
layers are untouched.

| Route | New file |
|---|---|
| POST /api/auth/signup | `functions/auth/signup.ts` |
| POST /api/auth/login | `functions/auth/login.ts` |
| GET /api/auth/check | `functions/auth/check.ts` |
| GET /api/auth/current | `functions/auth/current.ts` |
| GET /api/category/all | `functions/category/get_all.ts` |
| POST /api/category | `functions/category/create.ts` |
| GET /api/account/all/{categoryId} | `functions/account/get_all_by_category.ts` |
| POST /api/account | `functions/account/create.ts` |

Each handler:
1. Parses `event.body` with `JSON.parse`, wrapped so malformed JSON → 400.
2. Reads `event.pathParameters` for path params (e.g. `categoryId`).
3. Calls `getUserId(event)` for protected routes.
4. Calls the existing service function (unchanged).
5. Returns a response via `lambda_response.utils`, all wrapped in `withHandler`.

Once all 8 are done, delete: `*.router.ts`, `*.controller.ts` files,
`src/index.ts`, `src/middleware/auth.middleware.ts`.

## 5. Build (esbuild, multi-entry)

Replace the single-entry `build` script with a small `esbuild.config.js` that globs
`src/functions/**/*.ts` and calls `esbuild.build()` with:
- `entryPoints`: every function file
- `outdir: dist/functions` (mirrors the `{module}/{action}` subfolder structure)
- `bundle: true`, `platform: 'node'`, `target: 'node20'`, `format: 'cjs'`,
  `sourcemap: true`

Since esbuild bundles all dependencies, each output `.js` is self-contained — no
`node_modules` needed in the deployment artifact.

Add a `package` script that zips each `dist/functions/{module}/{action}.js`
individually (e.g. `functions/auth/signup.js` → `signup.zip`), ready for manual
upload through the console.

## 6. Local testing (serverless-offline only, no deploy)

Add a minimal `serverless.yml` whose only job is driving `serverless-offline`:
- `provider.name: aws`, `provider.runtime: nodejs20.x`
- `httpApi.cors: true`
- One `functions:` entry per route, pointing at the built
  `dist/functions/{module}/{action}.js` handler, with `httpApi.path` / `method`
  events matching the route table above.

`npm run build && npx serverless offline` becomes the new local dev workflow,
replacing `start:dev`.

## 7. package.json scripts (end state)

```json
"build": "node esbuild.config.js",
"offline": "npm run build && serverless offline",
"package": "node scripts/zip-functions.js"
```

## Open items to confirm before/while implementing

- Whether to keep `modules/*/dtos` and `row_types` structure exactly as-is
  (default: yes, untouched).
- Exact zip naming / output directory convention for console uploads.
- Whether `AppError` status codes need any adjustment now that there's no
  Express `req.method` / `req.originalUrl` for logging — replace with
  `event.requestContext.http.method` / `event.rawPath`.
