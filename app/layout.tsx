import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "Caravan Warranty Portal",
  description: "Warranty management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            background: "#ffffff",
            color: "#111827",
          }}
        >
          <Navigation />

          <main
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "24px",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}