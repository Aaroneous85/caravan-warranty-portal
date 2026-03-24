"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type EditClaimPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditClaimPage({ params }: EditClaimPageProps) {
  const router = useRouter();

  const [claimId, setClaimId] = useState("");
  const [customer, setCustomer] = useState("");
  const [dealer, setDealer] = useState("");
  const [vin, setVin] = useState("");
  const [concern, setConcern] = useState("");
  const [status, setStatus] = useState("New");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadClaim() {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      setClaimId(id);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErrorMessage(error?.message || "Failed to load claim.");
        setLoading(false);
        return;
      }

      setCustomer(data.customer || "");
      setDealer(data.dealer || "");
      setVin(data.vin || "");
      setConcern(data.concern || "");
      setStatus(data.status || "New");
      setLoading(false);
    }

    loadClaim();
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!claimId) return;

    setSaving(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("claims")
      .update({
        customer: customer.trim(),
        dealer: dealer.trim(),
        vin: vin.trim(),
        concern: concern.trim(),
        status: status.trim(),
      })
      .eq("id", claimId);

    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push(`/claims/${claimId}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Edit Claim</h1>
        <p style={{ color: "#555" }}>Loading claim...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Link href={claimId ? `/claims/${claimId}` : "/claims"} style={backLinkStyle}>
          ← Back to Claim
        </Link>
      </div>

      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Edit Claim</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Update claim details and save changes.
      </p>

      {errorMessage && (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      )}

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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button type="submit" style={buttonStyle} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href={claimId ? `/claims/${claimId}` : "/claims"}
            style={secondaryButtonStyle}
          >
            Cancel
          </Link>
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

const secondaryButtonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#f3f3f3",
  color: "#111",
  textDecoration: "none",
};

const backLinkStyle = {
  textDecoration: "none",
  color: "#111",
};

const errorBoxStyle = {
  border: "1px solid #e0b4b4",
  background: "#fff6f6",
  color: "#9f3a38",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
};