import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: offerCount } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <nav className="bg-white border-b border-[#e8e6e1] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-[#1a1a2e]">
            🐻 <span className="text-[#d4a373]">DataBear</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500">{user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button className="text-sm text-gray-500 hover:text-red-500 transition">
                Log ud
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/kunder">
            <div className="bg-white border border-[#e8e6e1] rounded-xl p-6 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Kunder</p>
              <p className="text-3xl font-bold text-[#1a1a2e]">{customerCount ?? 0}</p>
            </div>
          </Link>
          <Link href="/tilbud">
            <div className="bg-white border border-[#e8e6e1] rounded-xl p-6 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Tilbud</p>
              <p className="text-3xl font-bold text-[#1a1a2e]">{offerCount ?? 0}</p>
            </div>
          </Link>
          <Link href="/ordrer">
            <div className="bg-white border border-[#e8e6e1] rounded-xl p-6 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Ordrer</p>
              <p className="text-3xl font-bold text-[#1a1a2e]">{orderCount ?? 0}</p>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-[#e8e6e1] rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Seneste aktivitet</h2>
          </div>
          <LatestActivity userId={user.id} />
        </div>
      </div>
    </div>
  );
}

async function LatestActivity({ userId }: { userId: string }) {
  const supabase = await createServerSupabase();
  const { data: recentOffers } = await supabase
    .from("offers")
    .select("*, customers(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!recentOffers || recentOffers.length === 0) {
    return <p className="text-gray-400 text-sm">Ingen aktivitet endnu. Opret din første kunde eller tilbud.</p>;
  }

  return (
    <div className="space-y-3">
      {recentOffers.map((offer) => (
        <div key={offer.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
          <div>
            <p className="font-medium text-[#1a1a2e]">{offer.title}</p>
            <p className="text-sm text-gray-500">{offer.customers?.name || "Ukendt kunde"}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-[#1a1a2e]">{offer.amount.toLocaleString("da-DK")} kr</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              offer.status === "accepted" ? "bg-green-100 text-green-700" :
              offer.status === "sent" ? "bg-blue-100 text-blue-700" :
              offer.status === "rejected" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-500"
            }`}>
              {offer.status === "draft" ? "Kladde" :
               offer.status === "sent" ? "Sendt" :
               offer.status === "accepted" ? "Accepteret" :
               offer.status === "rejected" ? "Afvist" : offer.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
