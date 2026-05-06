import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Becafy — Tu Match de Becas Perfecto",
  description:
    "La primera plataforma inteligente que conecta tus estudios con las becas más prestigiosas del mundo. Rápido, fácil y 100% móvil.",
  keywords: ["becas", "scholarships", "Colombia", "estudios", "educación", "universidad"],
  openGraph: {
    title: "Becafy — Tu Match de Becas Perfecto",
    description: "Encuentra becas que se ajusten a tu perfil académico.",
    type: "website",
    locale: "es_CO",
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
