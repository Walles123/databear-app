import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function KunderPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Nav userEmail={user.email!} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Kunder</h1>
          <Link href="/kunder/ny" className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2d2d4a] transition">
            + Ny kunde
          </Link>
        </div>

        <div className="bg-white border border-[#e8e6e1] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e8e6e1]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Navn</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Telefon</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Virksomhed</th>
              </tr>
            </thead>
            <tbody>
              {(!customers || customers.length === 0) && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Ingen kunder endnu</td></tr>
              )}
              {customers?.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-[#1a1a2e]">{c.name}</td>
                  <td className="px-6 py-4 text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{c.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Nav({ userEmail }: { userEmail: string }) {
  return (
    <nav className="bg-white border-b border-[#e8e6e1] px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-[#1a1a2e]">
          🐻 <span className="text-[#d4a373]">DataBear</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#d4a373] transition">Dashboard</Link>
          <Link href="/tilbud" className="text-sm text-gray-500 hover:text-[#d4a373] transition">Tilbud</Link>
          <Link href="/ordrer" className="text-sm text-gray-500 hover:text-[#d4a373] transition">Ordrer</Link>
          <span className="text-sm text-gray-500">{userEmail}</span>
          <form action="/api/auth/logout" method="POST">
            <button className="text-sm text-gray-500 hover:text-red-500 transition">Log ud</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
