"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Customer = { id: string; name: string };

export default function NyTilbudPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      supabase.from("customers").select("id, name").eq("user_id", user.id).then(({ data }) => {
        setCustomers(data || []);
      });
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error: insertError } = await supabase.from("offers").insert({
      customer_id: form.get("customer_id"),
      title: form.get("title"),
      description: form.get("description"),
      amount: parseFloat(form.get("amount") as string),
      status: "draft",
      user_id: user.id,
    });

    if (insertError) { setError(insertError.message); setLoading(false); }
    else { router.push("/tilbud"); }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        <div className="mb-6">
          <Link href="/tilbud" className="text-sm text-gray-500 hover:text-[#d4a373] transition">&larr; Tilbage til tilbud</Link>
        </div>
        <div className="bg-white border border-[#e8e6e1] rounded-xl p-8">
          <h1 className="text-xl font-bold text-[#1a1a2e] mb-6">Nyt tilbud</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kunde *</label>
              <select name="customer_id" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373] bg-white">
                <option value="">Vælg kunde</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
              <input name="title" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
              <textarea name="description" rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beløb (kr) *</label>
              <input name="amount" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-[#1a1a2e] text-white font-semibold py-3 rounded-lg hover:bg-[#2d2d4a] transition disabled:opacity-50">
              {loading ? "Gemmer..." : "Gem tilbud"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
