"use client";

interface Props {
  url: string;
  title: string;
  showLabels?: boolean;
}

export default function ShareButtons({ url, title, showLabels = false }: Props) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shares = [
    {
      name: "Twitter/X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      icon: "𝕏",
      color: "hover:text-black",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: "f",
      color: "hover:text-blue-600",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`,
      icon: "in",
      color: "hover:text-blue-700",
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`,
      icon: "W",
      color: "hover:text-green-500",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex items-center gap-3">
      {shares.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Partager sur ${s.name}`}
          className={`text-lm-muted ${s.color} transition-colors flex items-center gap-1 text-sm`}
        >
          <span className="font-bold">{s.icon}</span>
          {showLabels && <span className="hidden sm:inline text-xs">{s.name}</span>}
        </a>
      ))}
      <button
        onClick={copyLink}
        title="Copier le lien"
        className="text-lm-muted hover:text-lm-blue transition-colors text-sm"
      >
        🔗{showLabels && <span className="hidden sm:inline text-xs ml-1">Copier</span>}
      </button>
    </div>
  );
}
