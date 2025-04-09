"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { ExchangeRateData } from "../hooks/useExchangeRate";

type ExchangeRateTableProps = {
  data: ExchangeRateData[];
  title?: string;
  unitLabel?: string;
};

export default function ExchangeRateTable({
  data,
  title = "過去1年間のドル円為替レート（日別）",
  unitLabel = "レート（円/ドル）",
}: ExchangeRateTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (!data || data.length === 0) {
    return <div className="p-4 text-center">データが存在しません</div>;
  }

  // 日付でソート（新しい順）
  const sortedData = [...data].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  // 現在のページのデータを取得
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // 総ページ数を計算
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // ページ変更ハンドラー
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">日付</th>
              <th className="py-2 px-4 border-b text-right">{unitLabel}</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.date} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {dayjs(item.date).format("YYYY-MM-DD")}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  {item.rate.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="flex justify-between items-center mt-4">
        <div>
          表示: {startIndex + 1} -{" "}
          {Math.min(startIndex + itemsPerPage, sortedData.length)} /{" "}
          {sortedData.length} 件
        </div>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            前へ
          </button>
          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
