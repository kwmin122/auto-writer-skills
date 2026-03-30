import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Source-Aware Personal Writing Agent",
  description:
    "A personal writing agent that reconstructs notes and links into source-aware drafts."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-frame">
          <header className="site-header">
            <Link className="brand" href="/">
              Source-Aware Personal Writing Agent
            </Link>
            <nav className="site-nav">
              <Link href="/">Start</Link>
              <Link href="/profile">Profile</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
