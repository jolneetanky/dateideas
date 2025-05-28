export type UseFetchResponse<T> = {
    data: T | null,
    error: string,
    loading: boolean,
}