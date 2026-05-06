import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import UserMenu from "@/app/components/ui/UserMenu";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanban",
  description: "Organize your work with a Kanban board",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-dvh antialiased`}
      suppressHydrationWarning
    >
      <body className="flex h-dvh flex-col overflow-hidden">
        {session && (
          <header className="h-header shrink-0 flex items-center justify-between border-b border-edge bg-surface px-6">
            <span className="text-sm font-semibold text-primary">Kanban</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu name={session.user?.name} image={session.user?.image} />
            </div>
          </header>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
