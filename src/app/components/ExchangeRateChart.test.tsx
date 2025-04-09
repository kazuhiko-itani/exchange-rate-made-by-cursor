import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExchangeRateChart } from "./ExchangeRateChart";

// Rechartsのサイズ計算に関するエラーを抑制
vi.mock("recharts", () => {
  const LineChart = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  );
  const ResponsiveContainer = ({ children }: { children: React.ReactNode }) =>
    children;

  return {
    LineChart,
    ResponsiveContainer,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
  };
});

describe("ExchangeRateChart", () => {
  // データが存在しない場合に適切なメッセージを表示するかテスト
  it("should display no data message when data is empty", () => {
    render(<ExchangeRateChart data={[]} />);
    expect(screen.getByText("データが存在しません")).toBeInTheDocument();
  });

  // データがある場合にグラフが描画されることを確認するテスト
  it("should render chart when data exists", () => {
    const mockData = [
      { date: "2023-01-01", rate: 135.5 },
      { date: "2023-01-02", rate: 136.2 },
      { date: "2023-01-03", rate: 134.8 },
    ];

    render(<ExchangeRateChart data={mockData} />);
    expect(screen.getByText("過去1年間のドル円為替レート")).toBeInTheDocument();
    // LineChart要素が存在することを確認
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
