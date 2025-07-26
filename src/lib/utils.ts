import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/supabaseClient" // تأكد إن المسار ده صحيح عندك

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const loginWithDiscord = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: "https://micheal-portfolio.netlify.app/oauth-redirect", // ← المسار اللي هترجعله بعد تسجيل الدخول
    },
  });
};
