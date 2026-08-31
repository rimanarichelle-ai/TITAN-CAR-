import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TITAN CARS | Location de Véhicules Récents & Mercedes Classe G à Alger & Boufarik',
  description: 'Location de véhicules récents, citadines, berlines, SUV et SUV de prestige chez TITAN CARS. Prise en charge 24/7 à l\'Aéroport d\'Alger Houari Boumediene.',
  icons: {
    icon: '/logo-mark.svg',
    shortcut: '/logo-mark.svg',
    apple: '/logo-mark.svg',
  },
  keywords: [
    'TITAN CARS',
    'TITAN CAR',
    'Location voiture Alger',
    'Location Mercedes Classe G Alger',
    'Location voiture Aeroport Alger',
    'Location voiture Boufarik',
    'Aéroport Houari Boumediene location'
  ],
  authors: [{ name: 'TITAN CARS' }],
  openGraph: {
    title: 'TITAN CARS | Location Automobile Premium à Alger & Boufarik',
    description: 'Location de véhicules récents avec livraison express 24h/7j à l\'Aéroport d\'Alger Houari Boumediene.',
    type: 'website',
    locale: 'fr_DZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TITAN CARS | Location Automobile Premium à Alger & Boufarik',
    description: 'Location de véhicules récents avec livraison express 24h/7j à l\'Aéroport d\'Alger.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-[#F5F5F2] text-[#151515] antialiased">
        {children}
      </body>
    </html>
  );
}
