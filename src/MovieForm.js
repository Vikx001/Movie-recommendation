import React, { useState } from 'react';
import axios from 'axios';

function MovieForm({ onMoviesFetched, onRandomMovieSelected }) {
  const [movies, setMovies] = useState(['']);
  const [error, setError] = useState('');

  const addMovieField = () => {
    if (movies.length < 5) {
      setMovies([...movies, '']);
    }
  };

  const handleInputChange = (index, value) => {
    const newMovies = [...movies];
    newMovies[index] = value;
    setMovies(newMovies);
  };

  const fetchMovieData = async (movie) => {
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;
    const response = await axios.get(`https://www.omdbapi.com/?t=${movie}&apikey=${apiKey}`);
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  };

  const handleRankMovies = async (e) => {
    e.preventDefault();
    try {
      const nonEmptyMovies = movies.filter((movie) => movie.trim() !== '');
      if (nonEmptyMovies.length === 0) {
        setError('Please enter at least one movie.');
        return;
      }

      const movieData = await Promise.all(nonEmptyMovies.map(fetchMovieData));
      const validMovies = movieData.filter((data) => data !== null);

      if (validMovies.length === 0) {
        setError('No valid movies found. Please try again.');
        return;
      }

      onMoviesFetched(validMovies);
      setError('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleRandomMovie = async (e) => {
    e.preventDefault();
    try {
      const nonEmptyMovies = movies.filter((movie) => movie.trim() !== '');
      if (nonEmptyMovies.length === 0) {
        setError('Please enter at least one movie.');
        return;
      }

      const randomMovie = nonEmptyMovies[Math.floor(Math.random() * nonEmptyMovies.length)];
      const movieData = await fetchMovieData(randomMovie);

      if (movieData) {
        onRandomMovieSelected(movieData);
        setError('');
      } else {
        setError('Movie not found. Please try another.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form>
      {movies.map((movie, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Movie ${index + 1}`}
          value={movie}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
      {movies.length < 5 && (
        <button type="button" onClick={addMovieField}>
          Add Another Movie
        </button>
      )}
      <div className="button-group">
        <button type="button" onClick={handleRankMovies}>
          Rank Movies
        </button>
        <button type="button" onClick={handleRandomMovie}>
          Get Random Recommendation
        </button>
      </div>
      {error && <p>{error}</p>}
    </form>
  );
}

export default MovieForm;
