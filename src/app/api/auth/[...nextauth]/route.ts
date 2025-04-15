import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/app/lib/supabase/server";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      try {
        const supabase = createClient();
        
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();
        
        if (!existingProfile) {
          await supabase.from('profiles').insert({
            id: user.id,
            name: user.name,
            avatar_url: user.image,
          });
        } else {
          await supabase.from('profiles').update({
            name: user.name,
            avatar_url: user.image,
          }).eq('id', user.id);
        }
        
        return true;
      } catch (error) {
        console.error('Error saving user to Supabase:', error);
        return true; // Still allow sign in even if saving to Supabase fails
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
