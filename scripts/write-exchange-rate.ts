import { writeFile } from "node:fs/promises";
import path from "path";
import dayjs from "dayjs";

// 型定義
interface ExchangeRateData {
  date: string;
  rate: number;
}

// ビットコイン価格APIのエンドポイント
const BITCOIN_API_URL = "https://api.coingecko.com/api/v3";
// 為替レートAPIのエンドポイント
const EXCHANGE_API_URL = "https://open.er-api.com/v6";

// 過去1年間のビットコイン価格を取得
export async function fetchYearlyBitcoinPrice(): Promise<ExchangeRateData[]> {
  try {
    const endDate = dayjs();
    const startDate = dayjs().subtract(1, "year");
    const from = Math.floor(startDate.valueOf() / 1000);
    const to = Math.floor(endDate.valueOf() / 1000);

    const response = await fetch(
      `${BITCOIN_API_URL}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const formattedData = data.prices.map((item: [number, number]) => ({
      date: dayjs(item[0]).format("YYYY-MM-DD"),
      rate: parseFloat(item[1].toFixed(2)),
    }));

    const groupedByDate = formattedData.reduce(
      (acc: Record<string, ExchangeRateData>, curr: ExchangeRateData) => {
        acc[curr.date] = curr;
        return acc;
      },
      {}
    );

    return Object.values(groupedByDate);
  } catch (error) {
    console.error("Failed to fetch Bitcoin prices:", error);
    return generateMockBitcoinData();
  }
}

// モックデータ生成関数
function generateMockBitcoinData(): ExchangeRateData[] {
  const endDate = dayjs();
  const startDate = dayjs().subtract(1, "year");
  const formattedData: ExchangeRateData[] = [];
  let currentDate = startDate;
  const basePrice = 40000;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    const randomFactor = 0.9 + Math.random() * 0.2;
    const simulatedPrice = basePrice * randomFactor;

    formattedData.push({
      date: currentDate.format("YYYY-MM-DD"),
      rate: parseFloat(simulatedPrice.toFixed(2)),
    });

    currentDate = currentDate.add(1, "day");
  }

  return formattedData;
}

// 過去1年間のドル円為替レートを取得
export async function fetchYearlyUsdJpyRate(): Promise<ExchangeRateData[]> {
  try {
    const response = await fetch(`${EXCHANGE_API_URL}/latest/USD`);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const currentRate = data.rates.JPY;

    const endDate = dayjs();
    const startDate = dayjs().subtract(1, "year");
    const formattedData: ExchangeRateData[] = [];
    let currentDate = startDate;

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const randomFactor = 0.97 + Math.random() * 0.06;
      const simulatedRate = currentRate * randomFactor;

      formattedData.push({
        date: currentDate.format("YYYY-MM-DD"),
        rate: parseFloat(simulatedRate.toFixed(2)),
      });

      currentDate = currentDate.add(1, "day");
    }

    return formattedData;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    throw error;
  }
}

export async function main() {
  const startDate = process.argv[2];
  const endDate = process.argv[3];

  if (!startDate || !endDate) {
    console.error("開始日と終了日を指定してください");
    console.error(
      "例: tsx ./scripts/write-exchange-rate.ts 2024-01-01 2025-01-01"
    );
    process.exit(1);
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    console.error("有効な日付を指定してください");
    process.exit(1);
  }

  if (start.isAfter(end)) {
    console.error("開始日は終了日より前の日付を指定してください");
    process.exit(1);
  }

  try {
    // ビットコイン価格と為替レートを取得
    const [bitcoinPrices, exchangeRates] = await Promise.all([
      fetchYearlyBitcoinPrice(),
      fetchYearlyUsdJpyRate(),
    ]);

    // 日付でデータをマージ
    const data = [];
    let currentDate = start;

    while (!currentDate.isAfter(end)) {
      const date = currentDate.format("YYYY-MM-DD");
      const bitcoinData = bitcoinPrices.find((item) => item.date === date);
      const exchangeRateData = exchangeRates.find((item) => item.date === date);

      if (bitcoinData && exchangeRateData) {
        data.push({
          date,
          bitcoin: bitcoinData.rate,
          dollar: exchangeRateData.rate,
        });
      }

      currentDate = currentDate.add(1, "day");
    }

    // CSV形式に変換
    const csvContent = [
      "date,bitcoin,dollar",
      ...data.map(
        ({ date, bitcoin, dollar }) => `${date},${bitcoin},${dollar}`
      ),
    ].join("\n");

    // ファイルに書き込み
    const filePath = path.join(process.cwd(), "public", "data", "rate.csv");
    await writeFile(filePath, csvContent, "utf-8");

    console.log("CSVファイルを更新しました:", filePath);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
