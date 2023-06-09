"use client";
import { useEffect } from "react";
import axios from "axios";
import Login from "./Login/page";

export default function Page() {
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
  return <Login />;
}
