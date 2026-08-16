import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Валерия Фридлендер — психолог | Онлайн консультация, психологическая помощь",
  description:
    "Психолог онлайн: профессиональная помощь, поддержка и консультации. Сайт психолога, онлайн запись на прием — начните свой путь к гармонии прямо сейчас.",
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
