import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Claim = {
  id: string;
  status: string;
};

export default async function DashboardPage() {
  const { data: claims, error } = await supabase.from("claims").select("id, status");

  const totalClaims = claims?.length ?? 0;
  const newClaims = claims?.filter((claim: Claim) => claim.status === "New").length ?? 0;
  const inReview =
    claims?.filter((claim: Claim) => claim.status === "In Review").length ?? 0;
  const approved =
    claims?.filter((claim: Claim) => claim.status === "Approved").length ?? 0;
  const rejected =
    claims?.filter((claim: Claim) => claim.status === "Rejected").length ?? 0;

  return (
    <div>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Welcome to the Caravan Warranty Portal.
      </p>

      {error && (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>Failed to load dashboard data: {error.message}</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Total Claims</h2>
          <p style={cardValueStyle}>{totalClaims}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>New</h2>
          <p style={cardValueStyle}>{newClaims}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>In Review</h2>
          <p style={cardValueStyle}>{inReview}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Approved</h2>
          <p style={cardValueStyle}>{approved}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Rejected</h2>
          <p style={cardValueStyle}>{rejected}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link href="/claims" style={buttonStyle}>
          View Claims
        </Link>
        <Link href="/claims/new-claim" style={buttonStyle}>
          Create New Claim
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "20px",
  background: "#fff",
};

const cardTitleStyle = {
  fontSize: "16px",
  marginBottom: "10px",
};

const cardValueStyle = {
  fontSize: "28px",
  fontWeight: 700,
  margin: 0,
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
};

const errorBoxStyle = {
  border: "1px solid #e0b4b4",
  background: "#fff6f6",
  color: "#9f3a38",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
};