// Passed in router state when going to cart / back to shop so filters and pagination restore.
export type BookstoreResumeState = {
  categories: string[];
  page: number;
  pageSize: number;
};
