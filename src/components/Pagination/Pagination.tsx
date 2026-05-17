import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className={css.pagination}>
      <button
        className={css.button}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        &larr; Prev
      </button>
      <span className={css.info}>
        {page} / {totalPages}
      </span>
      <button
        className={css.button}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
}
