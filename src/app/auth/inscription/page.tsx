"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
    } else {
      router.push("/auth/connexion?registered=1");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="section-divider" />
        <h1 className="text-2xl font-bold mb-8 text-center">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-lm-border px-4 py-2 rounded focus:outline-none focus:border-lm-blue"
              placeholder="Marie Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-lm-border px-4 py-2 rounded focus:outline-none focus:border-lm-blue"
              placeholder="vous@exemple.fr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-lm-border px-4 py-2 rounded focus:outline-none focus:border-lm-blue"
              placeholder="Minimum 8 caractères"
            />
          </div>

          <p className="text-xs text-lm-muted">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/mentions-legales" className="underline">conditions d'utilisation</Link>{" "}
            et notre{" "}
            <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lm-blue text-white py-2 rounded font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-lm-muted mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/connexion" className="text-lm-blue hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
