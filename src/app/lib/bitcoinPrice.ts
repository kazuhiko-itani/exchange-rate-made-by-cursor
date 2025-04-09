import dayjs from "dayjs";
import { ExchangeRateData } from "../hooks/useExchangeRate";

// ビットコイン価格APIのエンドポイント
// CoinGeckoの無料APIを使用
const API_URL = "https://api.coingecko.com/api/v3";

// 過去1年間のビットコイン価格を取得
// CoinGeckoのAPIを使用しますが、API制限に配慮
export async function fetchYearlyBitcoinPrice(): Promise<ExchangeRateData[]> {
  try {
    // 現在の日付から1年前までの日付を計算
    const endDate = dayjs();
    const startDate = dayjs().subtract(1, "year");

    // CoinGeckoのAPIでは、from, toをUNIXタイムスタンプ（秒）で指定
    const from = Math.floor(startDate.valueOf() / 1000);
    const to = Math.floor(endDate.valueOf() / 1000);

    // APIリクエスト
    // 日次データを取得するエンドポイント - 通貨をUSDに変更
    const response = await fetch(
      `${API_URL}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    // APIレスポンスのpricesは[timestamp, price]の配列形式
    // 日付文字列とレートに変換する
    const formattedData = data.prices.map((item: [number, number]) => {
      return {
        date: dayjs(item[0]).format("YYYY-MM-DD"),
        rate: parseFloat(item[1].toFixed(2)),
      };
    });

    // 日付でグループ化して1日1件のデータにする
    // 同じ日のデータがある場合は最後のデータを使用
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

    // API制限などの理由で失敗した場合のフォールバック
    // 疑似データを生成
    return generateMockBitcoinData();
  }
}

// APIが失敗した場合のモックデータ生成関数
function generateMockBitcoinData(): ExchangeRateData[] {
  const endDate = dayjs();
  const startDate = dayjs().subtract(1, "year");
  const formattedData: ExchangeRateData[] = [];
  let currentDate = startDate;

  // 基準価格（約4万ドル）
  const basePrice = 40000;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    // 疑似的な変動を加える（±10%程度のランダム変動）
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
