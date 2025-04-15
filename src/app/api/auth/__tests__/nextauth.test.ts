import { describe, expect, it, vi, beforeEach } from "vitest";
import NextAuth from "next-auth";
import { createClient } from "../../../lib/supabase/server";

vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("../../../lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("NextAuth configuration", () => {
  let authOptions: any;
  let mockSupabase: any;
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    };
    
    (createClient as any).mockReturnValue(mockSupabase);
    
    (NextAuth as any).mockImplementation((options: any) => {
      authOptions = options;
      return { GET: vi.fn(), POST: vi.fn() };
    });
    
    require("../[...nextauth]/route");
  });
  
  it("should have Google provider configured", () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].id).toBe("google");
  });
  
  it("should have custom sign-in page configured", () => {
    expect(authOptions.pages.signIn).toBe("/auth/signin");
  });
  
  it("should save user data to Supabase on sign-in when user doesn't exist", async () => {
    const user = {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.jpg",
    };
    
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: null,
    });
    
    mockSupabase.insert.mockResolvedValueOnce({
      data: { id: user.id },
      error: null,
    });
    
    const result = await authOptions.callbacks.signIn({ user, account: {}, profile: {} });
    
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSupabase.select).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", user.id);
    expect(mockSupabase.single).toHaveBeenCalled();
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      id: user.id,
      name: user.name,
      avatar_url: user.image,
    });
    expect(result).toBe(true);
  });
  
  it("should update user data in Supabase on sign-in when user exists", async () => {
    const user = {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.jpg",
    };
    
    mockSupabase.single.mockResolvedValueOnce({
      data: { id: user.id, name: "Old Name", avatar_url: "old-avatar.jpg" },
      error: null,
    });
    
    mockSupabase.update.mockResolvedValueOnce({
      data: { id: user.id },
      error: null,
    });
    
    const result = await authOptions.callbacks.signIn({ user, account: {}, profile: {} });
    
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSupabase.select).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", user.id);
    expect(mockSupabase.single).toHaveBeenCalled();
    expect(mockSupabase.update).toHaveBeenCalledWith({
      name: user.name,
      avatar_url: user.image,
    });
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", user.id);
    expect(result).toBe(true);
  });
  
  it("should handle errors when saving to Supabase", async () => {
    const user = {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.jpg",
    };
    
    mockSupabase.single.mockRejectedValueOnce(new Error("Database error"));
    
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    const result = await authOptions.callbacks.signIn({ user, account: {}, profile: {} });
    
    expect(createClient).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBe(true); // Should still allow sign in even if Supabase fails
    
    consoleSpy.mockRestore();
  });
  
  it("should add user ID to session", async () => {
    const session = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.jpg",
      },
    };
    
    const token = {
      sub: "test-user-id",
    };
    
    const result = await authOptions.callbacks.session({ session, token });
    
    expect(result.user.id).toBe("test-user-id");
  });
});
