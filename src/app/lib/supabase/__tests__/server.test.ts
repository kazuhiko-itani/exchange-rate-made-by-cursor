import { describe, expect, it, vi } from "vitest";
import { createClient } from "../server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const mockedCreateServerClient = createServerClient as any;

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn().mockReturnValue({ mockSupabaseClient: true }),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn().mockImplementation((name) => ({ value: `mock-${name}-value` })),
  }),
}));

vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test-url.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

describe("Supabase server client", () => {
  it("should create a server client with correct parameters", () => {
    const client = createClient();
    
    expect(cookies).toHaveBeenCalled();
    expect(mockedCreateServerClient).toHaveBeenCalledWith(
      "https://test-url.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          get: expect.any(Function),
        }),
      })
    );
    
    expect(client).toEqual({ mockSupabaseClient: true });
  });
  
  it("should correctly retrieve cookie values", () => {
    const cookieStore = cookies();
    createClient();
    
    const cookiesObj = mockedCreateServerClient.mock.calls[0][2].cookies;
    const cookieGetter = cookiesObj.get;
    
    const result = cookieGetter("test-cookie");
    
    expect(cookieStore.get).toHaveBeenCalledWith("test-cookie");
    expect(result).toBe("mock-test-cookie-value");
  });
});
