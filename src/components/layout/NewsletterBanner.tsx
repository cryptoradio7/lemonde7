"use client";

import { useState } from "react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setMessage("Merci ! Vous êtes inscrit à notre newsletter.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error || "Une erreur est survenue.");
    }
  }

  return (
    <div className="bg-lm-blue text-white rounded-lg px-6 py-8 my-8 text-center">
      <h2 className="text-xl font-serif font-bold mb-2">
        La newsletter du Monde 7
      </h2>
      <p className="text-sm text-blue-200 mb-4">
        Chaque matin, l'essentiel de l'actualité directement dans votre boîte mail.
      </p>

      {status === "success" ? (
        <p className="text-green-300 font-medium">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.fr"
            className="flex-1 px-4 py-2 rounded text-lm-text focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-white text-lm-blue px-6 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "..." : "S'inscrire"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-300 text-sm mt-2">{message}</p>
      )}

      <p className="text-xs text-blue-300 mt-3">
        En vous inscrivant, vous acceptez notre politique de confidentialité. Désinscription en un clic.
      </p>
    </div>
  );
}
