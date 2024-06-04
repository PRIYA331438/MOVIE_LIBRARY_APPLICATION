document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');
    const authForms = document.getElementById('auth-forms');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const appContent = document.getElementById('app-content');
    const searchQuery = document.getElementById('search-query');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const movieLists = document.getElementById('movie-lists');
  
    const API_URL = 'http://localhost:5000/api';
    let currentUser = null;
  
    const toggleAuthForms = () => {
      authForms.style.display = authForms.style.display === 'none' ? 'block' : 'none';
      appContent.style.display = appContent.style.display === 'none' ? 'block' : 'none';
    };
  
    const checkAuth = () => {
      currentUser = localStorage.getItem('userId');
      if (currentUser) {
        authLinks.style.display = 'none';
        logoutButton.style.display = 'block';
        appContent.style.display = 'block';
        loadMovieLists();
      } else {
        authLinks.style.display = 'block';
        logoutButton.style.display = 'none';
        appContent.style.display = 'none';
      }
    };
  
    loginLink.addEventListener('click', () => {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      toggleAuthForms();
    });
  
    registerLink.addEventListener('click', () => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      toggleAuthForms();
    });
  
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('userId');
      checkAuth();
    });
  
    loginButton.addEventListener('click', async () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        checkAuth();
      } else {
        alert('Invalid credentials');
      }
    });
  
    registerButton.addEventListener('click', async () => {
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        alert('User registered successfully');
        loginLink.click();
      } else {
        alert('User already exists');
      }
    });
  
    searchButton.addEventListener('click', async () => {
      const query = searchQuery.value;
      const response = await fetch(`${API_URL}/movies?query=${query}`);
      const movies = await response.json();
      searchResults.innerHTML = '';
      movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
          <img src="${movie.posterUrl}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>${movie.description}</p>
          <button onclick="addToMovieList(${movie.id})">Add to List</button>
        `;
        searchResults.appendChild(movieCard);
      });
    });
  
    window.addToMovieList = async (movieId) => {
      const listName = prompt('Enter list name:');
      if (!listName) return;
      const response = await fetch(`${API_URL}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser, listName, movieId }),
      });
      if (response.ok) {
        alert('Movie added to list');
        loadMovieLists();
      }
    };
  
    const loadMovieLists = async () => {
      const response = await fetch(`${API_URL}/lists/${currentUser}`);
      const lists = await response.json();
      movieLists.innerHTML = '';
      lists.forEach(list => {
        const listDiv = document.createElement('div');
        listDiv.innerHTML = `
          <h3>${list.listName}</h3>
          <p>Movies: ${list.movies.join(', ')}</p>
        `;
        movieLists.appendChild(listDiv);
      });
    };
  
    checkAuth();
  });
  