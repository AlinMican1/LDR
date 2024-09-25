"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false }); // Disable full-page redirect
    router.push("/login"); // Manually redirect to login page
  };
  return (
    <div>
      <Link href={`/login`}>
        <button>Go to login please</button>
      </Link>
      <button onClick={() => logout()}> Logout </button>
    </div>
  );
}
