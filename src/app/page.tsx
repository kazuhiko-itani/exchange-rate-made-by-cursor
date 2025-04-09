"use client";

import { Suspense } from "react";
import { useYearlyUsdJpyRate } from "./hooks/useExchangeRate";
import ExchangeRateChart from "./components/ExchangeRateChart";
import ExchangeRateTable from "./components/ExchangeRateTable";

export default function Home() {
  const { data, isLoading, isError } = useYearlyUsdJpyRate();

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">
        過去1年間のドル円為替レート
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-4">データを読み込み中...</p>
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-red-500">
            <p>エラーが発生しました。再度お試しください。</p>
          </div>
        ) : (
          <div>
            <Suspense
              fallback={
                <div className="p-4 text-center">グラフを読み込み中...</div>
              }
            >
              <ExchangeRateChart data={data || []} />
            </Suspense>

            <div className="border-t border-gray-200 mt-4"></div>

            <Suspense
              fallback={
                <div className="p-4 text-center">テーブルを読み込み中...</div>
              }
            >
              <ExchangeRateTable data={data || []} />
            </Suspense>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 為替レート表示アプリ</p>
      </footer>
    </main>
  );
}
