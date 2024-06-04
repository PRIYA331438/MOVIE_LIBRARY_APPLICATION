const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const movies = JSON.parse(fs.readFileSync(path.join(__dirname, 'movies.json')));

let users = [];
let lists = [];

// User Authentication
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(user => user.email === email)) {
    return res.status(400).send('User already exists');
  }
  users.push({ username, email, password });
  res.status(201).send('User registered successfully');
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }
  res.status(200).json({ userId: user.email });
});

// Search Movies
app.get('/api/movies', (req, res) => {
  const { query } = req.query;
  const results = movies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()));
  res.status(200).json(results);
});

// Get Movie Details
app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(movie => movie.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).send('Movie not found');
  }
  res.status(200).json(movie);
});

// Manage Movie Lists
app.get('/api/lists/:userId', (req, res) => {
  const userLists = lists.filter(list => list.userId === req.params.userId);
  res.status(200).json(userLists);
});

app.post('/api/lists', (req, res) => {
  const { userId, listName, movieId } = req.body;
  const list = lists.find(list => list.userId === userId && list.listName === listName);
  if (list) {
    list.movies.push(movieId);
  } else {
    lists.push({ userId, listName, movies: [movieId] });
  }
  res.status(201).send('Movie added to list');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
