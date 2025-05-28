export type Pagination<T> = {
    data: T[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}