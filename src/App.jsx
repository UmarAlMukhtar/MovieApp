import { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';

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
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
      ? `${API_BASE_URL}search?originalTitleAutocomplete=${encodeURI(query)}&type=movie&sortOrder=DESC&sortField=numVotes` 
      : `${API_BASE_URL}most-popular-movies`;
      const response = await fetch(endpoint, API_OPTIONS);
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
      setErrorMessage('Failed to fetch movies. Please try again later.');
      setMoviesList([]);
    } finally {
      setLoading(false);
    }
  }


useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero banner'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

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