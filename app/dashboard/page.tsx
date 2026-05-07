"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("advisors")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!data || data.status !== "approved") {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-bsbi-dark">BSBI Portal</h1>
            <p className="text-xs text-gray-500">Advisor Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {profile?.full_name || profile?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-bsbi-blue"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-bsbi-dark mb-2">
            Welcome, {profile?.full_name?.split(" ")[0] || "Advisor"} 👋
          </h2>
          <p className="text-gray-600 mb-6">
            Tools and resources will appear here soon.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-gray-400">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold">Eligibility Calculator</div>
              <div className="text-xs mt-1">Coming soon</div>
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-gray-400">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-semibold">Offer Sheet Generator</div>
              <div className="text-xs mt-1">Coming soon</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
