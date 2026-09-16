import './globals.css';
import '@fontsource/open-runde/500.css';
import type { Metadata } from 'next';

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
    <html lang="en">
      <body className="antialiased font-sans font-medium">
        <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 bg-background text-body">
          <main className="max-w-[60ch] mx-auto w-full space-y-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Footer() {
  const links = [
    { name: 'email', url: 'mailto:ronell129k@gmail.com' },
    { name: 'github', url: 'https://github.com/ronellsalunke' },
    { name: 'linkedin', url: 'https://linkedin.com/in/ronellsalunke' },
    { name: 'telegram', url: 'https://t.me/ronell1292k' },
    { name: 'resume', url: 'https://s3.ronellsalunke.dev/resume.pdf' }
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sub hover:text-brand no-underline transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}
