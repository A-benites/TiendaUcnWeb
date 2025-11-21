export interface PagedResult<T> {
  data: T[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
}
