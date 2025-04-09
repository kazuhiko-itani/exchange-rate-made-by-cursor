"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { ExchangeRateData } from "../hooks/useExchangeRate";

type ExchangeRateChartProps = {
  data: ExchangeRateData[];
};

export default function ExchangeRateChart({ data }: ExchangeRateChartProps) {
  // データが存在しない場合
  if (!data || data.length === 0) {
    return <div className="p-4 text-center">データが存在しません</div>;
  }

  // Y軸の最小値と最大値を計算
  const rates = data.map((item) => item.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const yAxisMin = Math.floor(minRate * 0.99); // 少し余裕を持たせる
  const yAxisMax = Math.ceil(maxRate * 1.01); // 少し余裕を持たせる

  // 日付のフォーマッターを設定
  const formatDate = (date: string) => {
    return dayjs(date).format("MM/DD");
  };

  // レートのフォーマッターを設定
  const formatRate = (rate: number) => {
    return rate.toFixed(2);
  };

  return (
    <div className="w-full h-[500px] p-4">
      <h2 className="text-xl font-bold mb-4">過去1年間のドル円為替レート</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis domain={[yAxisMin, yAxisMax]} tickFormatter={formatRate} />
          <Tooltip
            labelFormatter={(label) =>
              `日付: ${dayjs(label).format("YYYY-MM-DD")}`
            }
            formatter={(value: any) => [`${value.toFixed(2)}円`, "レート"]}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={false}
            name="USD/JPY"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
