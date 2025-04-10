"use server";

import {
  ExchangeRateData,
  SimulationResult,
  SimulationError,
} from "../lib/types";
import { readFile } from "node:fs/promises";
import path from "path";

export async function calculateSimulation(
  date: string,
  usdAmount: number
): Promise<SimulationResult | SimulationError> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "rate.csv");
    const fileContent = await readFile(filePath, "utf-8");
    const lines = fileContent.split("\n");
    const headers = lines[0].split(",");
    const data: ExchangeRateData[] = lines.slice(1).map((line) => {
      const [date, bitcoin, dollar] = line.split(",");
      return {
        date,
        bitcoin: Number(bitcoin),
        dollar: Number(dollar),
      };
    });

    const targetData = data.find((item) => item.date === date);
    if (!targetData) {
      return { error: "指定された日付のデータが見つかりません" };
    }

    const jpyAmount = usdAmount * targetData.dollar;
    return { jpyAmount };
  } catch (error) {
    return { error: "計算中にエラーが発生しました" };
  }
}
