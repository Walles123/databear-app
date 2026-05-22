import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return redirect("/dashboard");
}
