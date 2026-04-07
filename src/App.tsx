import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

type RequestRow = {
  id: string;
  description: string | null;
  amount: number | null;
  status: string | null;
  created_at: string | null;
};

type SessionUser = {
  id: string;
  email?: string;
};

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp() {
    setAuthMessage("");

    if (!email || !password) {
      setAuthMessage("Email and password are required.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthMessage("Signup error: " + error.message);
      return;
    }

    setAuthMessage("Signup successful. You can now sign in.");
  }

  async function signIn() {
    setAuthMessage("");

    if (!email || !password) {
      setAuthMessage("Email and password are required.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthMessage("Login error: " + error.message);
      return;
    }

    setAuthMessage("Login successful.");
    loadRequests();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setRequests([]);
    setMessage("");
  }

  async function loadRequests() {
    setMessage("");

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading requests: " + error.message);
      return;
    }

    setRequests(data || []);
  }

  async function addRequest() {
    if (!text.trim()) {
      setMessage("Please write a description.");
      return;
    }

    const numericAmount = amount ? Number(amount) : null;

    const { error } = await supabase.from("requests").insert({
      description: text.trim(),
      amount: numericAmount,
      status: "Pending",
    });

    if (error) {
      setMessage("Error adding request: " + error.message);
      return;
    }

    setText("");
    setAmount("");
    setMessage("Request added.");
    loadRequests();
  }

  async function deleteRequest(id: string) {
    const { error } = await supabase.from("requests").delete().eq("id", id);

    if (error) {
      setMessage("Error deleting request: " + error.message);
      return;
    }

    setMessage("Request deleted.");
    loadRequests();
  }

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
        <h1>Approval System Login</h1>
        <p>Please sign up or sign in.</p>

        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10 }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10 }}
          />

          <button onClick={signUp} style={{ padding: 10, cursor: "pointer" }}>
            Sign Up
          </button>

          <button onClick={signIn} style={{ padding: 10, cursor: "pointer" }}>
            Sign In
          </button>
        </div>

        {authMessage ? <p style={{ marginTop: 16 }}><strong>{authMessage}</strong></p> : null}
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
        <div>
          <h1>Approval System 🚀</h1>
          <p>Logged in as: {user.email}</p>
        </div>
        <button onClick={signOut} style={{ padding: 10, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 20, marginBottom: 20 }}>
        <input
          placeholder="Request description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: 10 }}
        />

        <button onClick={addRequest} style={{ padding: 10, cursor: "pointer" }}>
          Add Request
        </button>
      </div>

      {message ? <p><strong>{message}</strong></p> : null}

      <h2>Requests</h2>

      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <table width="100%" cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Description</th>
              <th align="left">Amount</th>
              <th align="left">Status</th>
              <th align="left">Created</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #ddd" }}>
                <td>{item.description || "-"}</td>
                <td>{item.amount ?? "-"}</td>
                <td>{item.status || "-"}</td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                <td>
                  <button
                    onClick={() => deleteRequest(item.id)}
                    style={{ padding: "6px 10px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
