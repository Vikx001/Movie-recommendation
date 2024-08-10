import React, { useState } from 'react';
import MovieForm from './MovieForm';
import MovieDetails from './MovieDetails';
import './App.css';

function App() {
  const [rankedMovies, setRankedMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);

  const handleMoviesFetched = (movies) => {
    const ranked = rankMovies(movies);
    setRankedMovies(ranked);
    setRandomMovie(null);  // Clear the random movie when showing ranked movies
  };

  const handleRandomMovieSelected = (movie) => {
    setRandomMovie(movie);
    setRankedMovies([]);  // Clear the ranked movies when showing a random movie
  };

  const rankMovies = (movies) => {
    const maxBoxOffice = Math.max(...movies.map(movie => parseFloat(movie.BoxOffice.replace(/[^0-9.-]+/g,"")) || 0));
    const maxPopularity = 100; // assuming a scale of 0-100 for popularity
    const maxHype = 100; // assuming a scale of 0-100 for hype

    return movies.map(movie => {
      const compositeScore = calculateCompositeScore(
        parseFloat(movie.imdbRating),
        parseFloat(movie.Ratings.find(r => r.Source === 'Rotten Tomatoes')?.Value.replace('%', '') || 0),
        parseFloat(movie.Metascore),
        parseFloat(movie.BoxOffice.replace(/[^0-9.-]+/g,"")) || 0,
        Math.random() * 100, // Random popularity for demo, replace with real data
        Math.random() * 100  // Random hype for demo, replace with real data
      );
      return { ...movie, compositeScore };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  };

  const calculateCompositeScore = (imdbRating, rtScore, audienceScore, boxOffice, popularity, hype) => {
    const normalizedImdbRating = imdbRating / 10;
    const normalizedRtScore = rtScore / 100;
    const normalizedAudienceScore = audienceScore / 100;
    const normalizedBoxOffice = boxOffice / 1_000_000_000; // Assuming a 1 billion cap
    const normalizedPopularity = popularity / 100;
    const normalizedHype = hype / 100;

    const weightImdb = 0.3;
    const weightRt = 0.25;
    const weightAudience = 0.2;
    const weightBoxOffice = 0.1;
    const weightPopularity = 0.1;
    const weightHype = 0.05;

    return (
      weightImdb * normalizedImdbRating +
      weightRt * normalizedRtScore +
      weightAudience * normalizedAudienceScore +
      weightBoxOffice * normalizedBoxOffice +
      weightPopularity * normalizedPopularity +
      weightHype * normalizedHype
    );
  };

  return (
    <div className="App">
      <h1>Movie Recommendation</h1>
      <MovieForm
        onMoviesFetched={handleMoviesFetched}
        onRandomMovieSelected={handleRandomMovieSelected}
      />
      {rankedMovies.length > 0 && (
        <div className="movie-list">
          <h2>Ranked Movies</h2>
          {rankedMovies.map((movie, index) => (
            <MovieDetails key={index} movie={movie} />
          ))}
        </div>
      )}
      {randomMovie && (
        <div className="random-movie">
          <h2>Random Movie Recommendation</h2>
          <MovieDetails movie={randomMovie} />
        </div>
      )}
    </div>
  );
}

export default App;
