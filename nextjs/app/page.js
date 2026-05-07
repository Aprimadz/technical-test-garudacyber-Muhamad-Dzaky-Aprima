"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font bold">Selamat Datang di Web Post.</h1>
          {user ? (
            <Link href="/posts" className="btn btn-primary my-6">
              lihat Posts
            </Link>
          ) : (
            <>
              <p className="py-6">Silahkan Login</p>
              <div className="flex gap-4 justify-center my-2">
                <Link href="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link href="/register" className="btn btn-outline">
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
