import "./globals.css";
import Navigation from "@/components/Navigation";
import type { ReactNode } from "react";

export const metadata = {
  title: "Caravan Warranty Portal",
  description: "CRM portal for caravan warranty claims",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}