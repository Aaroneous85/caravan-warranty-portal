import "./globals.css";

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
      <body className="bg-white text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}