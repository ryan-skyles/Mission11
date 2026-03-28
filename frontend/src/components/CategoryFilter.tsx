import { useEffect, useState } from "react";

type CategoryFilterProps = {
  selectedCategories: string[];
  setSelectedcategories: (categories: string[]) => void;
  /** When provided, skips internal fetch (e.g. shared with offcanvas + sidebar). */
  categories?: string[];
};

function CategoryFilter({
  selectedCategories,
  setSelectedcategories,
  categories: categoriesFromParent,
}: CategoryFilterProps) {
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  const categories =
    categoriesFromParent !== undefined ? categoriesFromParent : localCategories;

  useEffect(() => {
    if (categoriesFromParent !== undefined) {
      return;
    }
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:5000/Book/GetBookCategories"
        );
        const data = await response.json();
        setLocalCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, [categoriesFromParent]);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedcategories(updatedCategories);
  }

  return (
    <div>
      <h2 className="h6 text-uppercase text-muted mb-3">Categories</h2>
      {categories.length === 0 ? (
        <p className="small text-muted mb-0">Loading categories…</p>
      ) : null}
      <ul className="list-group list-group-flush border rounded-2">
        {categories.map((c) => {
          const checkboxId = `category-${encodeURIComponent(c)}`;
          return (
            <li key={c} className="list-group-item">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={checkboxId}
                  value={c}
                  checked={selectedCategories.includes(c)}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor={checkboxId}>
                  {c}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategoryFilter;
