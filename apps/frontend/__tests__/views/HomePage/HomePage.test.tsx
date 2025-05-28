import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "@/views/HomePage/HomePage";
import { useFetch } from "../../../__mocks__/features/dateidea/hooks.mock";

// Mock it outside to track calls
jest.mock("@/features/dateidea/hooks");

describe("HomePage - useFetch behavior", () => {
  it("calls useFetch again when parameters `page` or `limit` changes", () => {
    const mockUseFetch = useFetch as jest.Mock;

    // First render
    mockUseFetch.mockReturnValueOnce({
      data: null,
      error: null,
      loading: true,
    });

    const { rerender } = render(<HomePage />);

    // Rerender with updated state (simulate prop or state change)
    mockUseFetch.mockReturnValueOnce({
      data: null,
      error: null,
      loading: true,
    });

    // Simulate rerender with new page/limit
    rerender(<HomePage />);

    expect(mockUseFetch).toHaveBeenCalledTimes(2);
    expect(mockUseFetch).toHaveBeenNthCalledWith(1, 1, 10);
    expect(mockUseFetch).toHaveBeenNthCalledWith(2, 2, 10);
  });
});
