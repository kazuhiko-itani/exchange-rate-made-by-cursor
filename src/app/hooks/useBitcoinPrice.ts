import useSWR from "swr";
import { fetchYearlyBitcoinPrice } from "../lib/bitcoinPrice";
import { ExchangeRateData } from "./useExchangeRate";

export function useYearlyBitcoinPrice() {
  const { data, error, isLoading } = useSWR<ExchangeRateData[]>(
    "yearly-bitcoin-jpy",
    async () => fetchYearlyBitcoinPrice(),
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
