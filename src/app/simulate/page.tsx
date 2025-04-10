"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { calculateSimulation } from "./actions";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function SimulatePage() {
  const [date, setDate] = useState<Value>(new Date());
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!date || !amount) {
      setError("日付と金額を入力してください");
      return;
    }

    const selectedDate = date instanceof Date ? date : date[0];
    if (!selectedDate) {
      setError("有効な日付を選択してください");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const usdAmount = Number(amount);

    const response = await calculateSimulation(formattedDate, usdAmount);
    if ("error" in response) {
      setError(response.error);
    } else {
      setResult(response.jpyAmount);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        ビットコイン購入シミュレーション
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              購入日時
            </label>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full"
              locale="ja-JP"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              購入金額（USD）
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="1000"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            計算する
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {result !== null && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
            日本円評価額: {result.toLocaleString()}円
          </div>
        )}
      </div>
    </div>
  );
}
