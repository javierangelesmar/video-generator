export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  error: string | null;
}

export type ApiError = {
  error: string;
  code?: string;
};
