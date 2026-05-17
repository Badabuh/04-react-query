import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast from "react-hot-toast";
import { fetchMovies, isRequestCanceled } from "../../services/movieService";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const { movies: data, totalPages: pages } = await fetchMovies(
          query,
          page,
          controller.signal,
        );
        setMovies(data);
        setTotalPages(pages);
        if (data.length === 0) {
          toast.error("No movies found for your request.");
        }
      } catch (error) {
        if (isRequestCanceled(error)) {
          return;
        }
        setError(true);
        toast.error("There was an error fetching movies, please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [query, page]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
