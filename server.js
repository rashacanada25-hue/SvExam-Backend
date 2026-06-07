const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { generateObject } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const { z } = require('zod');
const Movie = require('./movie');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Movie Watchlist API' });
});

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/movies/search', async (req, res) => {
  try {
    const { name } = req.query;
    const movies = await Movie.find({
      title: { $regex: name || '', $options: 'i' },
    });
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post('/movies', async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!title?.trim() || !genre?.trim() || !description?.trim()) {
      return res.status(400).json({ error: 'All fields (title, genre, description) are required' });
    }
    if (title.trim().length > 20) {
      return res.status(400).json({ error: 'Title must be at most 20 characters' });
    }
    if (description.trim().length > 200) {
      return res.status(400).json({ error: 'Description must be at most 200 characters' });
    }

    const newMovie = new Movie({
      title: title.trim(),
      genre: genre.trim(),
      description: description.trim(),
    });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

app.delete('/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

app.post('/movies/generate', async (req, res) => {
  try {
    const { title, genre } = req.body;

    const { object } = await generateObject({
      model: openai('openai/gpt-4o'),
      schema: z.object({
        description: z.string().describe('Short and interesting movie description'),
      }),
      prompt: `Create a short description for a movie titled "${title}" in the ${genre} genre.`,
    });

    res.status(200).json(object);
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SvExam';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
