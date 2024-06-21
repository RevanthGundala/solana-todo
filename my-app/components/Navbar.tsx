"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSignedIn(data.session ? true : false);
      } catch (error) {
        console.error(error);
      }
    };
    getSession();
  }, []);

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-gray-900 px-4 md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-white"
        prefetch={false}
      >
        <ClipboardListIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">Todo App</span>
      </Link>
      <div className="flex items-center gap-2">
        {signedIn === null ? (
          // Render a placeholder or loading state initially
          <div className="text-white">Loading...</div>
        ) : signedIn ? (
          <Button onClick={logOut} variant="ghost" className="text-white">
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            variant="ghost"
            className="text-white"
          >
            Sign In
          </Button>
        )}
        <WalletMultiButton />
      </div>
    </header>
  );
}

function ClipboardListIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
