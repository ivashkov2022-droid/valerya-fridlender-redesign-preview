import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = new URL("/og.png", `${protocol}://${host}`).toString();

  return {
    title: "Валерия Фридлендер — психолог онлайн",
    description:
      "Психологическая помощь для тех, кто устал быть сильным за всех. Онлайн-сессии с Валерией Фридлендер.",
    openGraph: {
      title: "Валерия Фридлендер — психолог онлайн",
      description: "Для тех, кто устал быть сильным за всех.",
      type: "website",
      locale: "ru_RU",
      images: [{ url: imageUrl, width: 1792, height: 940, alt: "Валерия Фридлендер — психолог онлайн" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Валерия Фридлендер — психолог онлайн",
      description: "Для тех, кто устал быть сильным за всех.",
      images: [imageUrl],
    },
  };
}

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
