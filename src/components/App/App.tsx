
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import Pagination from '../Pagination/Pagination';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import styles from './App.module.css';
import Loader from '../Loader/Loader';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.results.length > 0 && (
        <>
          <Pagination
            totalPages={data.total_pages}
            currentPage={page}
            onPageChange={setPage}
          />
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
