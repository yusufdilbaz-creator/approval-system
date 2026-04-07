import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

type RequestRow = {
  id: string;
  description: string | null;
  amount: number | null;
  status: string | null;
  created_at: string | null;
};

export default function App() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading requests: " + error.message);
      setLoading(false);
      return;
    }

    setRequests(data || []);
    setLoading(false);
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
    loadRequests();
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <h1>Approval System 🚀</h1>
      <p>This version is connected to Supabase.</p>

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
      {loading ? <p>Loading...</p> : null}

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
