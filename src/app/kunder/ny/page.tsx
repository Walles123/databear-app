"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NyKundePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase.from("customers").insert({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      company: form.get("company"),
      notes: form.get("notes"),
      user_id: user.id,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/kunder");
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        <div className="mb-6">
          <Link href="/kunder" className="text-sm text-gray-500 hover:text-[#d4a373] transition">&larr; Tilbage til kunder</Link>
        </div>
        <div className="bg-white border border-[#e8e6e1] rounded-xl p-8">
          <h1 className="text-xl font-bold text-[#1a1a2e] mb-6">Ny kunde</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Navn *</label>
              <input name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input name="phone" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Virksomhed</label>
              <input name="company" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Noter</label>
              <textarea name="notes" rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-[#1a1a2e] text-white font-semibold py-3 rounded-lg hover:bg-[#2d2d4a] transition disabled:opacity-50">
              {loading ? "Gemmer..." : "Gem kunde"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
