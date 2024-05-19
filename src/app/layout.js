"use client";
import "./globals.css";
import Header from "./common/header";
import { Toaster } from "react-hot-toast";
import { inter } from "./fonts";
import Head from "next/head";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" as="image" />
        <title>Todo</title>
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Header />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
