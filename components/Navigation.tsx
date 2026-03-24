"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/claims", label: "Claims" },
  { href: "/claims/new-claim", label: "New Claim" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px 24px",
        borderBottom: "1px solid #ddd",
        background: "#fff",
      }}
    >
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: isActive ? "#fff" : "#111",
              background: isActive ? "#111" : "#f3f3f3",
              fontWeight: 500,
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}