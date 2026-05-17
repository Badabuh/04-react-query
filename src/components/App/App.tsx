import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { useEffect, useState, type ComponentType } from "react";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginateImport from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const ReactPaginate =
  (
    ReactPaginateImport as unknown as {
      default?: ComponentType<React.ComponentProps<typeof ReactPaginateImport>>;
    }
  ).default ?? ReactPaginateImport;

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const controller = new AbortController();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page, controller.signal),
  });

  const shouldShowNoResultsToast =
    !isLoading &&
    !isError &&
    query.trim() !== "" &&
    (data?.movies.length ?? 0) === 0;

  useEffect(() => {
    if (shouldShowNoResultsToast) {
      iziToast.error({
        title: "No results found",
        message: "Please try a different search query.",
        position: "topCenter",
      });
    }
  }, [shouldShowNoResultsToast]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.movies.length > 0 && (
        <>
          <MovieGrid movies={data.movies} onSelect={setSelectedMovie} />
          <ReactPaginate
            pageCount={data.totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={() => handlePageChange(page + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
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
