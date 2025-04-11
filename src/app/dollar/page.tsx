import { getYearlyUsdJpyRate } from "../lib/exchangeRate";
import Link from "next/link";
import { ExchangeRateChart } from "../components/ExchangeRateChart";
import { ExchangeRateTable } from "../components/ExchangeRateTable";

export default async function DollarPage() {
  const data = await getYearlyUsdJpyRate();

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">過去1年間のドル円為替レート</h1>
          <Link
            href="/bitcoin"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ビットコイン価格を見る
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <ExchangeRateChart data={data} />
        <div className="border-t border-gray-200 mt-4"></div>
        <ExchangeRateTable data={data} />
      </div>

      <footer className="mt-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 為替レート表示アプリ</p>
      </footer>
    </main>
  );
}
