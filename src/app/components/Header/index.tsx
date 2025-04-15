"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { Profile } from "@/app/lib/supabase/types";

export function Header() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
        }
        
        setLoading(false);
      }
    }
    
    if (session?.user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-blue-600 font-semibold text-lg">
          為替・暗号資産レート
        </Link>
        {session?.user && (
          <div className="flex items-center gap-4">
            {!loading && profile && (
              <div className="flex items-center gap-2">
                {profile.avatar_url && (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.name || "ユーザー"}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-gray-700">{profile.name}</span>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
