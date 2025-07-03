/**
 * The shape of the backend API response.
 * @property {"success" | "error"} status - The status of procedure initiated by the API call.
 * @property {string} message - The message on the process.
 * @property {T} data - The shape of the payload object returned from the backend.
 * @property {string} error - The error message, if any. * @property {
 */
export type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T | null;
  error: string;
};

export type ApiCursorResponse<T> = {
  data: T;
  next_cursor: string;
};

export type ApiClientCursorResponse<T> = {
  data: T;
  nextCursor: string;
};
