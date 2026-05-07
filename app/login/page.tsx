"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Check approval status
    const { data: profile, error: profileError } = await supabase
      .from("advisors")
      .select("status, role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      setError("Could not load your profile. Contact admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.status === "pending") {
      setError("Your account is pending approval. Please wait for admin approval.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.status === "rejected") {
      setError("Your account has been rejected. Contact admin for details.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-bsbi-dark">BSBI Portal</h1>
          <p className="text-sm text-gray-600 mt-2">
            Advisor & Agent Login
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bsbi-blue focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bsbi-blue focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bsbi-dark text-white py-2.5 rounded-lg font-semibold hover:bg-bsbi-blue transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Need an account?{" "}
            <Link href="/signup" className="text-bsbi-blue font-semibold hover:underline">
              Request access
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          For internal use by United Education advisors and agents
        </p>
      </div>
    </div>
  );
}
