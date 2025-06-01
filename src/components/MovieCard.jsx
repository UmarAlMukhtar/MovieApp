import React from 'react';

const MovieCard = ({
  movie: {
    title,
    url,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
}) => {
  return (
    <a href={url} target='_blank' rel='noopener noreferrer'>
    <div className='movie-card'>
        <img 
            src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`: 'no-movie.png'} 
            alt={title || 'Movie Poster'} 
            onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'no-movie.png'; // Fallback image
              }}
        />
        
        <div className='mt-4'>
            <h3>{title || 'Untitled'}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src="star.svg" alt="Star Icon" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span>•</span>
                <p className="lang">{original_language}</p>
                <span>•</span>
                <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
            </div>
        </div>
    </div>
    </a>
  )
}

export default MovieCard