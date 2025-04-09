import useSWR from "swr";
import { fetchYearlyUsdJpyRate } from "../lib/exchangeRate";

export type ExchangeRateData = {
  date: string;
  rate: number;
};

export function useYearlyUsdJpyRate() {
  const { data, error, isLoading } = useSWR<ExchangeRateData[]>(
    "yearly-usd-jpy",
    async () => fetchYearlyUsdJpyRate(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0, // 必要に応じて更新間隔を設定（ミリ秒）
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
