import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fetchYearlyUsdJpyRate } from "./exchangeRate";
import dayjs from "dayjs";

// グローバルなfetch関数をモックする
global.fetch = vi.fn();

describe("exchangeRate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch exchange rate data correctly", async () => {
    // mockデータを設定
    const mockResponse = {
      ok: true,
      json: async () => ({
        rates: {
          JPY: 140.5,
        },
      }),
    };

    // fetchのモック実装
    (global.fetch as any).mockResolvedValue(mockResponse);

    // 関数の実行
    const result = await fetchYearlyUsdJpyRate();

    // 結果の検証
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // 結果は過去1年分のデータを含むはず（365日分前後）
    const expectedDaysCount =
      dayjs().diff(dayjs().subtract(1, "year"), "day") + 1;
    expect(result.length).toBe(expectedDaysCount);

    // 各項目が適切なプロパティを持っているか確認
    result.forEach((item) => {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("rate");
      expect(typeof item.date).toBe("string");
      expect(typeof item.rate).toBe("number");
    });

    // APIが正しく呼ばれたか確認
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("open.er-api.com/v6/latest/USD")
    );
  });

  it("should handle API errors correctly", async () => {
    // エラー発生時のモック
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    // エラーをスローするはず
    await expect(fetchYearlyUsdJpyRate()).rejects.toThrow("API request failed");
  });
});
