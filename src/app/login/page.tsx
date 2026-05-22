import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1a1a2e]">
            🐻 <span className="text-[#d4a373]">DataBear</span>
          </h1>
          <p className="text-gray-500 mt-2">Data management dashboard</p>
        </div>

        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  );
}

async function LoginForm({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  
  return (
    <form
      action="/api/auth/login"
      method="POST"
      className="bg-white border border-[#e8e6e1] rounded-xl p-8 space-y-5"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Adgangskode
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#1a1a2e] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#2d2d4a] transition"
      >
        Log ind
      </button>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      <p className="text-center text-sm text-gray-400">
        Har du ikke en konto?{" "}
        <Link href="/signup" className="text-[#d4a373] hover:underline">
          Opret
        </Link>
      </p>
    </form>
  );
}
