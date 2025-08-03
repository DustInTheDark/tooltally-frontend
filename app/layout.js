import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationProvider } from '@/components/NavigationContext';
import { ThemeProvider } from '@/components/ThemeContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Header from '@/components/Header';

/**
 * RootLayout defines the global HTML structure for every page.
 * Metadata has been updated to reflect the ToolTally brand.
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'ToolTally – Compare Tools & Materials',
  description: 'Find the best price for tools and materials from top UK suppliers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/hero.png')]`}>
        <ThemeProvider>
          <NavigationProvider>
            {/* Allows the user to toggle between light, dark and contrast themes */}
            <ThemeSwitcher />
            <Header />
            {children}
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
