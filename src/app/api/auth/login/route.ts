import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/dashboard");
}
