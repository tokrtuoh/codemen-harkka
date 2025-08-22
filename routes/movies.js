const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         genre:
 *           type: string
 *         releaseYear:
 *           type: integer
 *         director:
 *           type: string
 *         rating:
 *           type: integer
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies (filter, sort, paginate)
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by property, use '-' for descending (e.g. -rating)
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: releaseYear
 *         schema:
 *           type: integer
 *         description: Filter by release year
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *         description: Filter by director
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *         description: Filter by rating
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Movies per page
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get('/', async (req, res) => {
  try {
    let sort = {};
    if (req.query.sort) {
      const field = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort;
      const direction = req.query.sort.startsWith('-') ? -1 : 1;
      sort[field] = direction;
    }

    // Build filter object from query parameters
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.releaseYear) filter.releaseYear = Number(req.query.releaseYear);
    if (req.query.director) filter.director = req.query.director;
    if (req.query.rating) filter.rating = Number(req.query.rating);

    // Pagination
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter).sort(sort).skip(skip).limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      movies
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies by genre, releaseYear, or rating
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: releaseYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of movies matching criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/search', async (req, res) => {
  try {
    const query = {};
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.releaseYear) query.releaseYear = Number(req.query.releaseYear);
    if (req.query.rating) query.rating = Number(req.query.rating);

    const movies = await Movie.find(query);
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Add a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.delete('/:id', async (req, res) => {  
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted', movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;