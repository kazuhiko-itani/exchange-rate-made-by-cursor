import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useYearlyBitcoinPrice } from "./useBitcoinPrice";
import useSWR from "swr";

// SWRをモック
vi.mock("swr");

describe("useBitcoinPrice", () => {
  it("should return loading state correctly", () => {
    // SWRのモック実装
    (useSWR as any).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    // フックをレンダリング
    const { result } = renderHook(() => useYearlyBitcoinPrice());

    // 結果の検証
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBeUndefined();
    expect(result.current.data).toBeUndefined();
  });

  it("should return error state correctly", () => {
    // SWRのモック実装
    (useSWR as any).mockReturnValue({
      data: undefined,
      error: new Error("Test error"),
      isLoading: false,
    });

    // フックをレンダリング
    const { result } = renderHook(() => useYearlyBitcoinPrice());

    // 結果の検証
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });

  it("should return data correctly", () => {
    const mockData = [
      { date: "2023-01-01", rate: 42500.75 },
      { date: "2023-01-02", rate: 43100.2 },
    ];

    // SWRのモック実装
    (useSWR as any).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    // フックをレンダリング
    const { result } = renderHook(() => useYearlyBitcoinPrice());

    // 結果の検証
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeUndefined();
    expect(result.current.data).toEqual(mockData);
  });

  it("should call SWR with correct parameters", () => {
    // SWRのモック実装
    (useSWR as any).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    });

    // フックをレンダリング
    renderHook(() => useYearlyBitcoinPrice());

    // SWRが正しいキーで呼ばれたか確認
    expect(useSWR).toHaveBeenCalledWith(
      "yearly-bitcoin-jpy",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      })
    );
  });
});
