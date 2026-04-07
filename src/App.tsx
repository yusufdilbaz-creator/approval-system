import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

type User = {
  email?: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthMessage(error.message);
    else setAuthMessage("Signup successful");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthMessage(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, width: "100%", marginBottom: 10 }}
        />

        <button onClick={signUp} style={{ width: "100%", padding: 10 }}>
          Sign Up
        </button>

        <button
          onClick={signIn}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        >
          Sign In
        </button>

        <p>{authMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 220,
          background: "#1e293b",
          color: "white",
          padding: 20,
        }}
      >
        <h3>Approval System</h3>

        <p style={{ fontSize: 12 }}>{user.email}</p>

        <hr />

        {[
          "dashboard",
          "search",
          "new",
          "status",
          "approvals",
          "projects",
          "users",
          "budgets",
          "matrix",
        ].map((item) => (
          <div
            key={item}
            onClick={() => setActivePage(item)}
            style={{
              padding: 10,
              cursor: "pointer",
              background:
                activePage === item ? "#334155" : "transparent",
            }}
          >
            {item.toUpperCase()}
          </div>
        ))}

        <button
          onClick={signOut}
          style={{ marginTop: 20, padding: 10, width: "100%" }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 40 }}>
        <h1>{activePage.toUpperCase()}</h1>

        {activePage === "dashboard" && <p>Dashboard overview coming soon</p>}

        {activePage === "search" && <p>Search screen coming soon</p>}

        {activePage === "new" && <p>New Entry form coming soon</p>}

        {activePage === "status" && <p>Status tracking coming soon</p>}

        {activePage === "approvals" && <p>Pending approvals coming soon</p>}

        {activePage === "projects" && <p>Project setup coming soon</p>}

        {activePage === "users" && <p>User management coming soon</p>}

        {activePage === "budgets" && <p>Budget system coming soon</p>}

        {activePage === "matrix" && <p>Approval matrix coming soon</p>}
      </div>
    </div>
  );
}
