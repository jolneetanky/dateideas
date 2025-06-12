import { Paginated } from "@/features/pagination/types";

export type ApiClientResponse<T> = {
  type: "success" | "error";
  data: T | null;
  error: string;
};

abstract class ApiClient<T> {
  // abstract getAll(): Promise<ApiClientResponse<T[]>>
  //   abstract getById(id: string): Promise<ApiClientResponse<T>>;
  // abstract getPage(page: number, pageSize: number): Promise<ApiClientResponse<Paginated<T>>>
}

export default ApiClient;
