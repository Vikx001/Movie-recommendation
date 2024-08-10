import React from 'react';

function MovieDetails({ movie }) {
  const trailerSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title)}+trailer`;

  
  const compositeScore = movie.compositeScore !== undefined ? movie.compositeScore.toFixed(2) : 'N/A';

  return (
    <div className="movie-details">
      <h2>{movie.Title}</h2>
      <img src={movie.Poster} alt={`${movie.Title} Poster`} style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} />
      <p><strong>Year:</strong> {movie.Year}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
      <p><strong>Rotten Tomatoes:</strong> {movie.Ratings.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'}</p>
      <p><strong>Metascore:</strong> {movie.Metascore}</p>
      <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
      <p><strong>Composite Score:</strong> {compositeScore}</p>
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <a href={trailerSearchUrl} target="_blank" rel="noopener noreferrer">Watch Trailer on YouTube</a>
    </div>
  );
}

export default MovieDetails;
