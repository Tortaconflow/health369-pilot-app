
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Valky • Fitness Gamificado, Nutrición & Superhéroe RPG',
  description: 'Desarrolla tu superhéroe fitness, accede a planes nutricionales con expertos de Valkiria y supera tus límites con IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider
          defaultTheme="dark"
          defaultThemeVariant="standard"
          storageKey="valky-ui-theme"
          variantStorageKey="valky-ui-theme-variant"
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

