import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tish’s Nesting Party',
  description: 'Sign up for a time and task to help prepare the nest for baby.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
