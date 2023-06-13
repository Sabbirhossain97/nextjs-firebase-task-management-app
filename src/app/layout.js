"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./common/header";
import { useEffect } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    try {
      const connectToDB = async () => {
        await axios.get("/api/connect");
      };
      connectToDB();
    } catch (err) {
      console.log("cant connect to database!");
    }
  }, []);
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title> Todo</title>
        <Header />
        {children}
      </body>
    </html>
  );
}
