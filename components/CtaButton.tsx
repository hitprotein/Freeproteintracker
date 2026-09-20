import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function CtaButton({
  href,
  children,
  size = "md",
  className = "",
  onClick,
}: CtaButtonProps) {
  const sizeClasses = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";

  function handleClick() {
    // Auto-fire the right conversion event based on destination, so every
    // HitProtein/App Store link is tracked without remembering to wire it
    // up per-instance.
    if (href.includes("/download") || href.includes("apps.apple.com")) {
      trackEvent("app_store_clicked", { destination: href });
    } else if (href.includes("hitprotein.com.au")) {
      trackEvent("hitprotein_cta_clicked", { destination: href });
    }
    onClick?.();
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 rounded-full bg-fpt-green font-heading font-extrabold uppercase tracking-wide text-fpt-black shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${sizeClasses} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}
