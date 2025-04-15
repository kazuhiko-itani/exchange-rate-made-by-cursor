import { describe, expect, it, vi } from "vitest";
import { createClient } from "../client";
import { createBrowserClient } from "@supabase/ssr";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn().mockReturnValue({ mockSupabaseClient: true }),
}));

vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test-url.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

describe("Supabase client", () => {
  it("should create a browser client with correct parameters", () => {
    const client = createClient();
    
    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://test-url.supabase.co",
      "test-anon-key"
    );
    
    expect(client).toEqual({ mockSupabaseClient: true });
  });
});
