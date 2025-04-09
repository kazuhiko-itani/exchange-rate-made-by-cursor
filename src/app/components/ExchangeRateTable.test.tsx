import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExchangeRateTable } from "./ExchangeRateTable";

describe("ExchangeRateTable", () => {
  // データが存在しない場合に適切なメッセージを表示するかテスト
  it("should display no data message when data is empty", () => {
    render(<ExchangeRateTable data={[]} />);
    expect(screen.getByText("データが存在しません")).toBeInTheDocument();
  });

  // データがある場合にテーブルが表示されるかテスト
  it("should render table when data exists", () => {
    const mockData = [
      { date: "2023-01-01", rate: 135.5 },
      { date: "2023-01-02", rate: 136.2 },
      { date: "2023-01-03", rate: 134.8 },
    ];

    render(<ExchangeRateTable data={mockData} />);
    expect(
      screen.getByText("過去1年間のドル円為替レート（日別）")
    ).toBeInTheDocument();

    // テーブルのヘッダーが表示されているか確認
    expect(screen.getByText("日付")).toBeInTheDocument();
    expect(screen.getByText("レート（円/ドル）")).toBeInTheDocument();

    // データの行が表示されているか確認（新しい日付順に並び替えられるため、最新の日付から表示される）
    expect(screen.getByText("2023-01-03")).toBeInTheDocument();
    expect(screen.getByText("134.80")).toBeInTheDocument();
  });

  // ページネーションのテスト
  it("should handle pagination correctly", () => {
    // ページネーションをテストするための十分なデータを作成
    const mockData = Array.from({ length: 25 }, (_, i) => ({
      date: `2023-01-${String(i + 1).padStart(2, "0")}`,
      rate: 135 + i * 0.1,
    }));

    render(<ExchangeRateTable data={mockData} />);

    // テーブルが表示されていることを確認
    expect(
      screen.getByText("過去1年間のドル円為替レート（日別）")
    ).toBeInTheDocument();

    // 日付は新しい順に並び替えられるため、最初に表示されるのは最新の日付
    expect(screen.getByText("2023-01-25")).toBeInTheDocument();

    // 「次へ」ボタンをクリック
    fireEvent.click(screen.getByText("次へ"));

    // 2ページ目のデータが表示されるはず（古い日付）
    expect(screen.getByText("2023-01-05")).toBeInTheDocument();

    // 「前へ」ボタンをクリック
    fireEvent.click(screen.getByText("前へ"));

    // 再び1ページ目のデータが表示されるはず
    expect(screen.getByText("2023-01-25")).toBeInTheDocument();
  });
});
