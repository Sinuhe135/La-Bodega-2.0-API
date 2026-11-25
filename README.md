# La Bodega API

[placeholder]

## Features

[placeholder]

## Tech Stack

[placeholder]

## Prerequisites

- Java 27
- Docker Desktop (or Docker Engine with the Compose plugin)

## Getting Started

### 1. Configure environment variables

Copy the example file and fill in the values:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

| Variable      | Description                  |
| ------------- | ---------------------------- |
| `DB_NAME`     | Name of the Postgres database |
| `DB_USER`     | Postgres user                |
| `DB_PASSWORD` | Password for `DB_USER`       |

> Postgres only applies these values when the database is first created. If you change them later, recreate the volume with `docker compose down -v` (this deletes all data).

### 2. Start the database

```bash
docker compose up -d
```

Check that the container is running:

```bash
docker compose ps
```

Postgres is available at `localhost:5432`.

### 3. Start the API server

```bash
# macOS / Linux
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

The API runs at `http://localhost:8080`.

### Stopping

Stop the API with `Ctrl+C`, then stop the database:

```bash
docker compose down
```

Your data is kept in the `pgdata` volume. To delete it as well, run `docker compose down -v`.

## Running Tests

```bash
# macOS / Linux
./mvnw test

# Windows
mvnw.cmd test
```

## Project Structure

[placeholder]

## API Endpoints

[placeholder]

## Contributing

[placeholder]

## License

[placeholder]
