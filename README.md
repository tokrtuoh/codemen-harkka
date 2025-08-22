# Codemen Harkka

A simple REST API for managing movies, built with Node.js, Express, MongoDB, and Docker.  
Supports filtering, sorting, and pagination.  
Swagger documentation available at `/api-docs`.

## Features

- Add, update, delete, and fetch movies
- Filter by genre, release year, director, and rating
- Sort by any property
- Pagination support
- API documentation with Swagger

## How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tokrtuoh/codemen-harkka.git
   cd codemen-harkka
   ```

2. a) **Start with Docker Compose (Requires Docker / Docker Desktop):**
   ```bash
   docker-compose up --build
   ```
   OR

   b) **Use Docker CLI directly (Requires Docker / Docker Desktop)**
   ```bash
   docker build -t codemen-harkka .
   docker run --name mongo -p 27017:27017 mongo
   docker run --name api-server --link mongo -p 3000:3000 codemen-harkka
   ```

3. **Access the API:**
   - API root: [http://localhost:3000](http://localhost:3000)
   - Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Example Endpoints & cURL Commands

### Get all movies (with filtering, sorting, pagination)
```bash
curl "http://localhost:3000/movies?genre=Sci-Fi&sort=-rating&page=1&limit=5"
```

### Search movies (alternative endpoint)
```bash
curl "http://localhost:3000/movies/search?genre=Drama&releaseYear=2020"
```

### Get a movie by ID
```bash
curl "http://localhost:3000/movies/<movie_id>"
```

### Add a new movie
```bash
curl -X POST "http://localhost:3000/movies" \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","genre":"Sci-Fi","releaseYear":2010,"director":"Christopher Nolan","rating":9}'
```

### Update a movie by ID
```bash
curl -X PUT "http://localhost:3000/movies/<movie_id>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","genre":"Sci-Fi","releaseYear":2010,"director":"Christopher Nolan","rating":10}'
```

### Delete a movie by ID
```bash
curl -X DELETE "http://localhost:3000/movies/<movie_id>"
```
