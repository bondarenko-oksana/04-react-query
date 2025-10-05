import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';


import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,

  });

  useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

   return (
    <div className={css.app}>
       <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

     
      {query && (isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data && data.results.length > 0 && (
       <>
         <ReactPaginate
             pageCount={data.total_pages}
             pageRangeDisplayed={5}
             marginPagesDisplayed={1}
             onPageChange={({ selected }) => setPage(selected + 1)}
             forcePage={page - 1}
             containerClassName={css.pagination}
             activeClassName={css.active}
             nextLabel="→"
             previousLabel="←"
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


