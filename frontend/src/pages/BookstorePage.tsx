import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookList from "../components/BookList";
import CategoryFilter from "../components/CategoryFilter";
import Header from "../components/Header";
import { BOOKS_API_URL } from "../api/BooksAPI";

type LocationResume = {
  resume?: {
    categories: string[];
    page: number;
    pageSize: number;
  };
};

function BookstorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = (location.state as LocationResume | null)?.resume;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    () => resume?.categories ?? []
  );
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BOOKS_API_URL}/GetBookCategories`);
        const data: string[] = await res.json();
        setCategoryOptions(data);
      } catch {
        setCategoryOptions([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if ((location.state as LocationResume | null)?.resume) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      <Header />
      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>

        <div className="row g-4 align-items-start">
          <aside className="col-lg-3">
            {/* Sticky sidebar on lg+: filters stay visible while scrolling the catalog */}
            <div
              className="sticky-lg-top align-self-start z-2"
              style={{ top: "1rem" }}
            >
            <div
              className="offcanvas-lg offcanvas-start border rounded-3 shadow-sm bg-body-tertiary"
              tabIndex={-1}
              id="shopFilters"
              aria-labelledby="shopFiltersLabel"
            >
              <div className="offcanvas-header border-bottom d-lg-none">
                <h2 className="h5 offcanvas-title" id="shopFiltersLabel">
                  Filter by category
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  data-bs-target="#shopFilters"
                  aria-label="Close"
                />
              </div>
              <div className="offcanvas-body p-lg-4">
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  setSelectedcategories={setSelectedCategories}
                  categories={categoryOptions}
                />
              </div>
            </div>
            </div>
          </aside>

          <main className="col-lg-9">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h1 className="h3 mb-0">Books</h1>
              <button
                className="btn btn-outline-dark d-lg-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#shopFilters"
                aria-controls="shopFilters"
              >
                Categories
              </button>
            </div>
            <BookList
              selectedCategories={selectedCategories}
              initialPage={resume?.page}
              initialPageSize={resume?.pageSize}
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default BookstorePage;
