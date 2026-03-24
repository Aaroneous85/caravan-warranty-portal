"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewClaimPage() {
  const router = useRouter();

  const [customer, setCustomer] = useState("");
  const [dealer, setDealer] = useState("");
  const [vin, setVin] = useState("");
  const [concern, setConcern] = useState("");
  const [status, setStatus] = useState("New");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.from("claims").insert([
      {
        customer: customer.trim(),
        dealer: dealer.trim(),
        vin: vin.trim(),
        concern: concern.trim(),
        status: status.trim(),
      },
    ]);

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/claims");
    router.refresh();
  }

  return (
    <div>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>New Claim</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Create a new warranty claim.
      </p>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldGroupStyle}>
          <label htmlFor="customer" style={labelStyle}>
            Customer
          </label>
          <input
            id="customer"
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="dealer" style={labelStyle}>
            Dealer
          </label>
          <input
            id="dealer"
            type="text"
            value={dealer}
            onChange={(e) => setDealer(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="vin" style={labelStyle}>
            VIN
          </label>
          <input
            id="vin"
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="concern" style={labelStyle}>
            Concern
          </label>
          <textarea
            id="concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            style={textareaStyle}
            rows={5}
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="status" style={labelStyle}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {errorMessage && (
          <div style={errorBoxStyle}>
            Failed to save claim: {errorMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Saving..." : "Save Claim"}
          </button>
        </div>
      </form>
    </div>
  );
}

const formStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "20px",
  background: "#fff",
  display: "grid",
  gap: "16px",
};

const fieldGroupStyle = {
  display: "grid",
  gap: "8px",
};

const labelStyle = {
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const textareaStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  resize: "vertical" as const,
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
};

const errorBoxStyle = {
  border: "1px solid #e0b4b4",
  background: "#fff6f6",
  color: "#9f3a38",
  borderRadius: "12px",
  padding: "12px 16px",
};