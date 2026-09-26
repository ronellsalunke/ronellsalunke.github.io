import './globals.css';
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ronellsalunke.dev'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Ronell Salunke',
    template: '%s | Ronell Salunke'
  },
  description:
    'Software engineer writing about Flutter, Android, software, and the occasional rabbit hole.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased font-sans">
        <div className="min-h-screen flex flex-col pt-0 md:pt-8 p-8 bg-background text-body">
          <main className="max-w-[60ch] mx-auto w-full space-y-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
