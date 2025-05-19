import React from 'react';

const MovieCard = ({
  movie: {
    originalTitle,
    url,
    averageRating,
    primaryImage,
    releaseDate,
    spokenLanguages,
  },
}) => {
  return (
    <a href={url} target='_blank' rel='noopener noreferrer'>
    <div className='movie-card'>
        <img 
            src={primaryImage ? primaryImage: 'no-movie.png'} 
            alt={originalTitle || 'Movie Poster'} 
            onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'no-movie.png'; // Fallback image
              }}
        />
        
        <div className='mt-4'>
            <h3>{originalTitle || 'Untitled'}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src="star.svg" alt="Star Icon" />
                    <p>{averageRating ? averageRating.toFixed(1) : 'N/A'}</p>
                </div>
                <span>•</span>
                <p className='lang'>{Array.isArray(spokenLanguages) && spokenLanguages.length > 0
                ? spokenLanguages[0]
                : 'N/A'}</p>
                <span>•</span>
                <p className='year'>{releaseDate ? releaseDate.split('-')[0] : 'N/A'}</p>
            </div>
        </div>
    </div>
    </a>
  )
}

export default MovieCard