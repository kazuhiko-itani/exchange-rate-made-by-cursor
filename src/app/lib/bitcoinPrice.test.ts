import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fetchYearlyBitcoinPrice } from "./bitcoinPrice";
import dayjs from "dayjs";

// グローバルなfetch関数をモックする
global.fetch = vi.fn();

describe("bitcoinPrice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch bitcoin price data correctly", async () => {
    // APIレスポンスの構造に合わせたmockデータを設定
    const mockPrices: [number, number][] = [];
    const startDate = dayjs().subtract(1, "year");
    const endDate = dayjs();
    let currentDate = startDate;

    // 1年分の日付とビットコイン価格データを生成
    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      mockPrices.push([
        currentDate.valueOf(), // タイムスタンプ（ミリ秒）
        40000 + Math.random() * 4000, // 価格（ランダム変動を持たせる）
      ]);
      currentDate = currentDate.add(1, "day");
    }

    const mockResponse = {
      ok: true,
      json: async () => ({
        prices: mockPrices,
      }),
    };

    // fetchのモック実装
    (global.fetch as any).mockResolvedValue(mockResponse);

    // 関数の実行
    const result = await fetchYearlyBitcoinPrice();

    // 結果の検証
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // 日付の重複を除いたデータ件数を確認（CoinGeckoのAPIはより詳細なデータを返すため、
    // 関数内で1日1件に集約される）
    const expectedDaysCount =
      dayjs().diff(dayjs().subtract(1, "year"), "day") + 1;
    expect(result.length).toBeLessThanOrEqual(expectedDaysCount);

    // 各項目が適切なプロパティを持っているか確認
    result.forEach((item) => {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("rate");
      expect(typeof item.date).toBe("string");
      expect(typeof item.rate).toBe("number");
      // 日付形式の確認
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    // APIが正しく呼ばれたか確認
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "api.coingecko.com/api/v3/coins/bitcoin/market_chart/range"
      )
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("vs_currency=usd")
    );
  });

  it("should handle API errors correctly and return mock data", async () => {
    // エラー発生時のモック
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    // 通常はエラーをスローするが、このメソッドではモックデータを返す設計のため、
    // エラーにならずにモックデータが返される
    const result = await fetchYearlyBitcoinPrice();

    // 結果の検証
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // モックデータが正しい形式で返されるか確認
    const expectedDaysCount =
      dayjs().diff(dayjs().subtract(1, "year"), "day") + 1;
    expect(result.length).toBe(expectedDaysCount);

    result.forEach((item) => {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("rate");
      expect(typeof item.date).toBe("string");
      expect(typeof item.rate).toBe("number");
    });
  });

  it("should handle network errors and return mock data", async () => {
    // ネットワークエラーのモック
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    // 通常はエラーをスローするが、このメソッドではモックデータを返す設計のため、
    // エラーにならずにモックデータが返される
    const result = await fetchYearlyBitcoinPrice();

    // 結果の検証
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // モックデータが正しい形式で返されるか確認
    const expectedDaysCount =
      dayjs().diff(dayjs().subtract(1, "year"), "day") + 1;
    expect(result.length).toBe(expectedDaysCount);
  });
});
