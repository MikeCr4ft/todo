import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import UserMenu from "@/app/components/ui/UserMenu";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {session && (
          <header className="flex items-center justify-between border-b border-edge bg-surface px-6 py-2.5">
            <span className="text-sm font-semibold text-primary">Kanban</span>
            <UserMenu name={session.user?.name} image={session.user?.image} />
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
