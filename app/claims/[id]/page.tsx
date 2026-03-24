"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Claim = {
  id: string;
  created_at: string;
  vin: string;
  dealer: string;
  customer: string;
  concern: string;
  status: string;
};

type ClaimDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusBadgeStyle(status: string) {
  const baseStyle = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
  };

  switch (status) {
    case "Approved":
      return {
        ...baseStyle,
        background: "#e8f7ee",
        color: "#1f7a3d",
      };
    case "Rejected":
      return {
        ...baseStyle,
        background: "#fdecec",
        color: "#b42318",
      };
    case "In Review":
      return {
        ...baseStyle,
        background: "#fff4e5",
        color: "#b26a00",
      };
    case "New":
      return {
        ...baseStyle,
        background: "#eaf2ff",
        color: "#1d4ed8",
      };
    default:
      return {
        ...baseStyle,
        background: "#f3f3f3",
        color: "#333",
      };
  }
}

export default function ClaimDetailPage({ params }: ClaimDetailPageProps) {
  const router = useRouter();

  const [claimId, setClaimId] = useState("");
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadClaim() {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      setClaimId(id);
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErrorMessage(error?.message || "Failed to load claim.");
        setClaim(null);
        setLoading(false);
        return;
      }

      setClaim(data as Claim);
      setLoading(false);
    }

    loadClaim();
  }, [params]);

  async function updateStatus(newStatus: string) {
    if (!claimId) return;

    setSavingStatus(newStatus);
    setErrorMessage("");

    const { error } = await supabase
      .from("claims")
      .update({ status: newStatus })
      .eq("id", claimId);

    if (error) {
      setErrorMessage(error.message);
      setSavingStatus("");
      return;
    }

    setClaim((current) =>
      current ? { ...current, status: newStatus } : current
    );
    setSavingStatus("");
    router.refresh();
  }

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Claim</h1>
        <p style={{ color: "#555" }}>Loading claim...</p>
      </div>
    );
  }

  if (!claim) {
    return (
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>Claim not found</h1>
        <p style={{ marginBottom: "20px", color: "#555" }}>
          No claim was found for id: {claimId || "unknown"}
        </p>
        {errorMessage && (
          <p style={{ marginBottom: "20px", color: "#9f3a38" }}>
            {errorMessage}
          </p>
        )}
        <Link href="/claims" style={buttonStyle}>
          Back to Claims
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/claims" style={backLinkStyle}>
          ← Back to Claims
        </Link>

        <Link href={`/claims/${claim.id}/edit`} style={buttonStyle}>
          Edit Claim
        </Link>
      </div>

      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
        Claim #{claim.id}
      </h1>

      {errorMessage && (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      )}

      <div style={actionBarStyle}>
        <button
          type="button"
          style={approveButtonStyle}
          onClick={() => updateStatus("Approved")}
          disabled={savingStatus !== ""}
        >
          {savingStatus === "Approved" ? "Saving..." : "Approve"}
        </button>

        <button
          type="button"
          style={reviewButtonStyle}
          onClick={() => updateStatus("In Review")}
          disabled={savingStatus !== ""}
        >
          {savingStatus === "In Review" ? "Saving..." : "Mark In Review"}
        </button>

        <button
          type="button"
          style={rejectButtonStyle}
          onClick={() => updateStatus("Rejected")}
          disabled={savingStatus !== ""}
        >
          {savingStatus === "Rejected" ? "Saving..." : "Reject"}
        </button>
      </div>

      <div style={cardStyle}>
        <p>
          <strong>Customer:</strong> {claim.customer || "—"}
        </p>
        <p>
          <strong>Dealer:</strong> {claim.dealer || "—"}
        </p>
        <p>
          <strong>VIN:</strong> {claim.vin || "—"}
        </p>
        <p>
          <strong>Concern:</strong> {claim.concern || "—"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={getStatusBadgeStyle(claim.status || "")}>
            {claim.status || "—"}
          </span>
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Date Created:</strong>{" "}
          {claim.created_at
            ? new Date(claim.created_at).toLocaleString()
            : "—"}
        </p>
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

const actionBarStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap" as const,
  marginBottom: "20px",
};

const backLinkStyle = {
  textDecoration: "none",
  color: "#111",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
};

const approveButtonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#1f7a3d",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const reviewButtonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#b26a00",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const rejectButtonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#b42318",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const errorBoxStyle = {
  border: "1px solid #e0b4b4",
  background: "#fff6f6",
  color: "#9f3a38",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
};