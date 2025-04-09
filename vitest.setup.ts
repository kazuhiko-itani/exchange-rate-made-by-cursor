import "@testing-library/jest-dom";
import { vi } from "vitest";

// グローバルオブジェクトにモック用のオブジェクトを追加
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// SWRモックのセットアップ
vi.mock("swr", () => ({
  default: vi.fn(),
}));

// Next.js環境のモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));
