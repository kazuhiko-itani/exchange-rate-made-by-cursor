import { createClient } from "../../../lib/supabase/server";

export async function signInCallback({ user, account, profile }: any) {
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
}

export async function sessionCallback({ session, token }: any) {
  if (session.user && token.sub) {
    session.user.id = token.sub;
  }
  return session;
}
