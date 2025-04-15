import { describe, expect, it, vi } from "vitest";
import { getUserProfile } from "../profile";
import { createClient } from "../server";

vi.mock("../server", () => ({
  createClient: vi.fn(),
}));

describe("User profile utility", () => {
  it("should return profile data when Supabase query succeeds", async () => {
    const mockProfile = {
      id: "test-user-id",
      name: "Test User",
      avatar_url: "https://example.com/avatar.jpg",
      updated_at: "2025-04-15T00:00:00Z",
    };
    
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      }),
    };
    
    (createClient as any).mockReturnValue(mockSupabase);
    
    const result = await getUserProfile("test-user-id");
    
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-user-id");
    expect(mockSupabase.single).toHaveBeenCalled();
    expect(result).toEqual(mockProfile);
  });
  
  it("should return null when Supabase query fails", async () => {
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
    
    const result = await getUserProfile("test-user-id");
    
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-user-id");
    expect(mockSupabase.single).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBeNull();
    
    consoleSpy.mockRestore();
  });
});
