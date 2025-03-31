import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import LeftSideBar from "@/components/layout/LeftSideBar";

export const metadata: Metadata = {
  title: "Ecommerce - Admin Dashboard",
  description: "Admin dashboard for ecommerce",
};
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
           className={inter.className}
        >
            <LeftSideBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
