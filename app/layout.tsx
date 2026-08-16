import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Валерия Фридлендер — психолог онлайн",
  description:
    "Психологическая помощь для тех, кто устал быть сильным за всех. Онлайн-сессии с Валерией Фридлендер.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
