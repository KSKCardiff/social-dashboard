import "./globals.css";

export const metadata = {
  title: "TrendAgency Dashboard",
  description: "Sosyal medya performans takip uygulamasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
