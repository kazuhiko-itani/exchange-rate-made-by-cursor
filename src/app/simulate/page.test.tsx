import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SimulatePage from "./page";
import { calculateSimulation } from "./actions";

// actionsモジュールをモック
vi.mock("./actions", () => ({
  calculateSimulation: vi.fn(),
}));

describe("SimulatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form correctly", () => {
    render(<SimulatePage />);

    expect(
      screen.getByText("ビットコイン購入シミュレーション")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("購入金額（USD）")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "計算する" })
    ).toBeInTheDocument();
  });

  it("should show error message when submitting without amount", async () => {
    render(<SimulatePage />);

    const submitButton = screen.getByRole("button", { name: "計算する" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("日付と金額を入力してください")
      ).toBeInTheDocument();
    });
  });

  it("should show calculation result when submitting with valid data", async () => {
    const mockResult = { jpyAmount: 150000 };
    vi.mocked(calculateSimulation).mockResolvedValue(mockResult);

    render(<SimulatePage />);

    const amountInput = screen.getByLabelText("購入金額（USD）");
    const submitButton = screen.getByRole("button", { name: "計算する" });

    fireEvent.change(amountInput, { target: { value: "1000" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("日本円評価額: 150,000円")).toBeInTheDocument();
    });
  });

  it("should show error message when calculation fails", async () => {
    const mockError = { error: "指定された日付のデータが見つかりません" };
    vi.mocked(calculateSimulation).mockResolvedValue(mockError);

    render(<SimulatePage />);

    const amountInput = screen.getByLabelText("購入金額（USD）");
    const submitButton = screen.getByRole("button", { name: "計算する" });

    fireEvent.change(amountInput, { target: { value: "1000" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("指定された日付のデータが見つかりません")
      ).toBeInTheDocument();
    });
  });
});
