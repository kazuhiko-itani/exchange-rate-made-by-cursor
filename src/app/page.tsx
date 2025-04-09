"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">
          為替・暗号資産レート表示アプリ
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">ドル円為替レート</h2>
            <p className="text-gray-600 mb-6">
              過去1年間のドル円為替レート（USD/JPY）の推移を確認できます。
            </p>
            <Link
              href="/dollar"
              className="block w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
            >
              ドル円レートを表示する
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">ビットコイン価格</h2>
            <p className="text-gray-600 mb-6">
              過去1年間のビットコイン（BTC/USD）価格推移を確認できます。
            </p>
            <Link
              href="/bitcoin"
              className="block w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
            >
              ビットコイン価格を表示する
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 為替・暗号資産レート表示アプリ</p>
      </footer>
    </main>
  );
}
