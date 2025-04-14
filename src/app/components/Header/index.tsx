"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-blue-600 font-semibold text-lg">
          為替・暗号資産レート
        </Link>
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            ログアウト
          </button>
        )}
      </div>
    </header>
  );
}
