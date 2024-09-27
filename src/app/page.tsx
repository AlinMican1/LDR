"use client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadComponent from "@/components/atoms/uploadAvatar";
import { useSession } from "next-auth/react";

// Fetch session on the server side
export default function Home() {
  // Safely access username or fallback
  const { data: session } = useSession();
  return (
    <div>
      <h1>{session?.user?.avatarURL}</h1>
      <Link href="/login">
        <button>Go to login please</button>
      </Link>
      <LogoutButton />
      <UploadComponent />
    </div>
  );
}

// Client component for logout
function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login"); // Manually redirect to login page
  };

  return <button onClick={logout}>Logout</button>;
}
