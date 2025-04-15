import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Header } from "../index";
import { useSession } from "next-auth/react";

import { createClient } from "../../../lib/supabase/client";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("../../../lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="user-avatar" />
  ),
}));

describe("Header", () => {
  it("should not display user info when not logged in", () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    
    render(<Header />);
    
    expect(screen.getByText("為替・暗号資産レート")).toBeInTheDocument();
    
    expect(screen.queryByText("ログアウト")).not.toBeInTheDocument();
    
    expect(screen.queryByTestId("user-avatar")).not.toBeInTheDocument();
  });
  
  it("should display user info and logout button when logged in", async () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          image: "https://example.com/avatar.jpg",
        },
      },
      status: "authenticated",
    });
    
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: "test-user-id",
          name: "Test User from Supabase",
          avatar_url: "https://example.com/supabase-avatar.jpg",
          updated_at: "2025-04-15T00:00:00Z",
        },
        error: null,
      }),
    };
    
    (createClient as any).mockReturnValue(mockSupabase);
    
    render(<Header />);
    
    expect(screen.getByText("為替・暗号資産レート")).toBeInTheDocument();
    
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Test User from Supabase")).toBeInTheDocument();
    });
    
    expect(screen.getByTestId("user-avatar")).toHaveAttribute(
      "src",
      "https://example.com/supabase-avatar.jpg"
    );
    
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-user-id");
    expect(mockSupabase.single).toHaveBeenCalled();
  });
  
  it("should handle errors when fetching profile data", async () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          image: "https://example.com/avatar.jpg",
        },
      },
      status: "authenticated",
    });
    
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: new Error("Test error"),
      }),
    };
    
    (createClient as any).mockReturnValue(mockSupabase);
    
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    render(<Header />);
    
    expect(screen.getByText("為替・暗号資産レート")).toBeInTheDocument();
    
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-user-id");
    expect(mockSupabase.single).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
