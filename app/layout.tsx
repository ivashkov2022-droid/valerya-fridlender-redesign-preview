import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://valerya-fridlender.ru"),
  title: "Психолог онлайн — Валерия Фридлендер",
  description:
    "Онлайн-консультации психолога: работа с тревогой, травматическим опытом, самооценкой и внутренними конфликтами. Валерия Фридлендер.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Психолог Валерия Фридлендер",
    title: "Психолог онлайн — Валерия Фридлендер",
    description:
      "Онлайн-консультации психолога: работа с тревогой, травматическим опытом, самооценкой и внутренними конфликтами. Валерия Фридлендер.",
    images: [{ url: "/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Психолог онлайн — Валерия Фридлендер",
    description:
      "Онлайн-консультации психолога: работа с тревогой, травматическим опытом, самооценкой и внутренними конфликтами. Валерия Фридлендер.",
    images: ["/og.png"],
  },
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
