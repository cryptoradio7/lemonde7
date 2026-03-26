"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/connexion" className="hover:underline">
          Se connecter
        </Link>
        <Link href="/auth/inscription" className="bg-white text-lm-blue px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
          S'inscrire
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:inline">{session.user?.name}</span>
      {(session.user as { role?: string })?.role === "admin" && (
        <Link href="/admin" className="hover:underline">Admin</Link>
      )}
      <button onClick={() => signOut({ callbackUrl: "/" })} className="hover:underline">
        Déconnexion
      </button>
    </div>
  );
}
