import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdrerPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, customers(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Nav userEmail={user.email!} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Ordrer</h1>
          <Link href="/ordrer/ny" className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2d2d4a] transition">
            + Ny ordre
          </Link>
        </div>

        <div className="bg-white border border-[#e8e6e1] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e8e6e1]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Titel</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Kunde</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Beløb</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Dato</th>
              </tr>
            </thead>
            <tbody>
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Ingen ordrer endnu</td></tr>
              )}
              {orders?.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-[#1a1a2e]">{o.title}</td>
                  <td className="px-6 py-4 text-gray-600">{o.customers?.name || "—"}</td>
                  <td className="px-6 py-4 font-semibold">{o.amount.toLocaleString("da-DK")} kr</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      o.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                      o.status === "completed" ? "bg-green-100 text-green-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {o.status === "pending" ? "Afventer" :
                       o.status === "in_progress" ? "I gang" :
                       o.status === "completed" ? "Afsluttet" :
                       o.status === "cancelled" ? "Annulleret" : o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(o.created_at).toLocaleDateString("da-DK")}
                  </td>
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
          <Link href="/kunder" className="text-sm text-gray-500 hover:text-[#d4a373] transition">Kunder</Link>
          <Link href="/tilbud" className="text-sm text-gray-500 hover:text-[#d4a373] transition">Tilbud</Link>
          <span className="text-sm text-gray-500">{userEmail}</span>
          <form action="/api/auth/logout" method="POST">
            <button className="text-sm text-gray-500 hover:text-red-500 transition">Log ud</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
