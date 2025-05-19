import { use, useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://imdb236.p.rapidapi.com/api/imdb/'
const API_KEY = import.meta.env.VITE_IMDB_API_KEY;

const API_OPTIONS ={
	method: 'GET',
	headers: {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': 'imdb236.p.rapidapi.com'
	}
};


const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');
    setQuotaExceeded(false);

    try {
      const endpoint = query
      ? `${API_BASE_URL}search?originalTitleAutocomplete=${encodeURI(query)}&type=movie&sortOrder=DESC&sortField=numVotes` 
      : `${API_BASE_URL}most-popular-movies`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (response.status === 429) {
        setQuotaExceeded(true);
        throw new Error('API quota exceeded');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      let movies = [];

    if (Array.isArray(data)) {
      movies = data;
    } else if (Array.isArray(data.results)) {
      movies = data.results;
    } else {
      throw new Error('Unexpected API response format');
    }
      setMoviesList(movies);
       if (query && data.results.length > 0) {
        const movie = data.results[0];
        await updateSearchCount(query, movie);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (!quotaExceeded) {
        setErrorMessage('Failed to fetch movies. Please try again later.');
      }
      setMoviesList([]);
    } finally {
      setLoading(false);
    }
};

const loadTrendingMovies = async () => {
  try {
    const movies = await getTrendingMovies();
    setTrendingMovies(movies);  
  } catch (error) {
    console.error('Error fetching trending movies:', error);
  }
};

useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='./logo.png' alt='Logo' className="w-12 h-12" />  
          <img src='./hero.png' alt='Hero banner'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {quotaExceeded && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mt-4 text-center font-semibold shadow">
            Monthly API quota has been exceeded. Please try again later.
          </div>
        )}
        {trendingMovies.length > 0 && !searchTerm && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <a a href={movie.url} target='_blank' rel='noopener noreferrer'>
                    <img src={movie.posterUrl} alt={movie.title} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>Popular</h2>

          {loading ? (
            <Spinner />
          ) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p> 
          ) :  moviesList.length > 0 ? (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No movies found. Try a different search term.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default App