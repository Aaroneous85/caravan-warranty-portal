"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function loadClaims() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setClaims([]);
        setLoading(false);
        return;
      }

      setClaims((data as Claim[]) || []);
      setLoading(false);
    }

    loadClaims();
  }, []);

  const filteredClaims = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return claims.filter((claim) => {
      const matchesStatus =
        statusFilter === "All" ? true : claim.status === statusFilter;

      const matchesSearch =
        search === ""
          ? true
          : (claim.customer || "").toLowerCase().includes(search) ||
            (claim.dealer || "").toLowerCase().includes(search) ||
            (claim.vin || "").toLowerCase().includes(search) ||
            (claim.concern || "").toLowerCase().includes(search) ||
            String(claim.id).toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [claims, searchTerm, statusFilter]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Claims</h1>
          <p style={{ color: "#555" }}>View and manage warranty claims.</p>
        </div>

        <Link href="/claims/new-claim" style={buttonStyle}>
          New Claim
        </Link>
      </div>

      <div style={filterBarStyle}>
        <div style={fieldGroupStyle}>
          <label htmlFor="search" style={labelStyle}>
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by customer, dealer, VIN, concern, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="statusFilter" style={labelStyle}>
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "16px", color: "#555" }}>
        Showing {filteredClaims.length} of {claims.length} claims
      </div>

      {loading && (
        <div style={emptyBoxStyle}>
          <p style={{ margin: 0 }}>Loading claims...</p>
        </div>
      )}

      {!loading && errorMessage && (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>
            Failed to load claims from Supabase: {errorMessage}
          </p>
        </div>
      )}

      {!loading && !errorMessage && filteredClaims.length === 0 && (
        <div style={emptyBoxStyle}>
          <p style={{ margin: 0 }}>No claims match your search/filter.</p>
        </div>
      )}

      {!loading && !errorMessage && filteredClaims.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredClaims.map((claim) => (
            <Link
              key={claim.id}
              href={`/claims/${claim.id}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
                    Claim #{claim.id}
                  </h2>
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Customer:</strong> {claim.customer || "—"}
                  </p>
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Dealer:</strong> {claim.dealer || "—"}
                  </p>
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>VIN:</strong> {claim.vin || "—"}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Concern:</strong> {claim.concern || "—"}
                  </p>
                </div>

                <div style={{ minWidth: "160px", textAlign: "right" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={getStatusBadgeStyle(claim.status || "")}>
                      {claim.status || "—"}
                    </span>
                  </div>
                  <p style={{ margin: 0 }}>
                    <strong>Created:</strong>{" "}
                    {claim.created_at
                      ? new Date(claim.created_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
};

const filterBarStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "16px",
  marginBottom: "16px",
  padding: "16px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
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

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  background: "#fff",
};

const errorBoxStyle = {
  border: "1px solid #e0b4b4",
  background: "#fff6f6",
  color: "#9f3a38",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
};

const emptyBoxStyle = {
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: "12px",
  padding: "16px",
};