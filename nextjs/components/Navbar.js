"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isReady, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Simple Blog
        </Link>
      </div>
      <div className="flex-none">
        {!isReady ? null : user ? (
          <ul className="menu menu-horizontal px-1 items-center gap-4">
            <li>
              <Link href="/posts">Posts</Link>
            </li>
            <li>
              <details>
                <summary className="p-0">
                  <div className="avatar avatar-placeholder">
                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
                      <span className="text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                </summary>
                <ul className="bg-base-100 rounded-t-none p-2 right-0 z-10 shadow-md">
                  <li><span className="text-sm font-semibold">{user.name}</span></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
              </details>
            </li>
          </ul>
        ) : (
          <div className="flex items-center gap-2 px-2">
            <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}
