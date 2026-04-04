import type { ReactNode } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  titleSortAsc: boolean;
  onToggleSort: () => void;
};

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  titleSortAsc,
  onToggleSort,
}: PaginationProps): ReactNode {
  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    onPageChange(clamped);
  };

  const handlePageSizeChange = (n: number) => {
    onPageSizeChange(n);
  };

  return (
    <>
      <div className="row g-3 align-items-end mb-4">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <label
            htmlFor="pageSize"
            className="form-label mb-1 small text-muted"
          >
            Books per page
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-6 col-md-auto">
          <label className="form-label mb-1 small text-muted d-block invisible d-sm-none">
            &nbsp;
          </label>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm w-100 w-sm-auto"
            onClick={onToggleSort}
          >
            Sort: {titleSortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      <nav aria-label="Book pagination">
        <ul className="pagination pagination-sm justify-content-center flex-wrap mb-0">
          <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>
          <li
            className={`page-item ${
              currentPage >= totalPages ? "disabled" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Pagination;

