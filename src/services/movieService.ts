import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_API_KEY as string;

if (!TOKEN) {
  console.warn('VITE_API_KEY is not defined in environment variables.');
}

export interface TmdbSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, page: number): Promise<TmdbSearchResponse> {
  const url = `${BASE_URL}/search/movie`;

  const config = {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
    },
    headers: {
      Authorization: `Bearer ${TOKEN ?? ''}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
  };

  const response = await axios.get<TmdbSearchResponse>(url, config);
  return response.data;
}