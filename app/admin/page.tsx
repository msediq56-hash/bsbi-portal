"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Advisor {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
  approved_at: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: myProfile } = await supabase
      .from("advisors")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!myProfile || myProfile.role !== "admin" || myProfile.status !== "approved") {
      await supabase.auth.signOut();
      router.push("/login");
      return;
    }

    setProfile(myProfile);

    const { data: allAdvisors } = await supabase
      .from("advisors")
      .select("*")
      .order("created_at", { ascending: false });

    if (allAdvisors) setAdvisors(allAdvisors);
    setLoading(false);
  }

  async function updateStatus(advisorId: string, newStatus: "approved" | "rejected") {
    const { error } = await supabase
      .from("advisors")
      .update({
        status: newStatus,
        approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        approved_by: profile.id,
      })
      .eq("id", advisorId);

    if (error) {
      alert("Failed to update: " + error.message);
      return;
    }
    loadData();
  }

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

  const filteredAdvisors = filter === "all"
    ? advisors
    : advisors.filter((a) => a.status === filter);

  const pendingCount = advisors.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-bsbi-dark">BSBI Portal · Admin</h1>
            <p className="text-xs text-gray-500">Manage advisor accounts</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{profile?.email}</span>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-bsbi-blue">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === f
                  ? "bg-bsbi-dark text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-bsbi-blue"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredAdvisors.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No advisors in this category.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Requested</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdvisors.map((advisor) => (
                  <tr key={advisor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {advisor.full_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{advisor.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          advisor.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : advisor.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {advisor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{advisor.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(advisor.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {advisor.role === "admin" ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : advisor.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(advisor.id, "approved")}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(advisor.id, "rejected")}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : advisor.status === "rejected" ? (
                        <button
                          onClick={() => updateStatus(advisor.id, "approved")}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(advisor.id, "rejected")}
                          className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded hover:bg-gray-700"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
