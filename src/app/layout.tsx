
import type { Metadata } from 'next';
import { Roboto, Montserrat } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider'; // Importado

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Health369 Piloto',
  description: 'Revolucionando las metas de salud y fitness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${roboto.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider
          defaultTheme="light"
          defaultThemeVariant="standard"
          storageKey="health369-ui-theme"
          variantStorageKey="health369-ui-theme-variant"
        >
          <QueryProvider>
            <SidebarProvider defaultOpen={true}>
              <AppShell>
                {children}
              </AppShell>
            </SidebarProvider>
          </QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
