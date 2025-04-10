import { describe, it, expect, beforeEach, vi } from "vitest";
import { calculateSimulation } from "./actions";
import { readFile } from "node:fs/promises";

// モックデータ
const mockCsvData = `date,bitcoin,dollar
2025-01-01,100000,150
2025-01-02,101000,151
2025-01-03,102000,152`;

vi.mock("node:fs/promises");

describe("calculateSimulation", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  it("should calculate JPY amount correctly", async () => {
    vi.mocked(readFile).mockResolvedValueOnce(mockCsvData);

    const result = await calculateSimulation("2025-01-01", 1000);
    expect(result).toEqual({ jpyAmount: 150000 });
  });

  it("should return error when date is not found", async () => {
    vi.mocked(readFile).mockResolvedValueOnce(mockCsvData);

    const result = await calculateSimulation("2025-01-04", 1000);
    expect(result).toEqual({ error: "指定された日付のデータが見つかりません" });
  });

  it("should return error when file read fails", async () => {
    vi.mocked(readFile).mockRejectedValueOnce(new Error("File read error"));

    const result = await calculateSimulation("2025-01-01", 1000);
    expect(result).toEqual({ error: "計算中にエラーが発生しました" });
  });
});
