import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
        "Hi Crayon2Couture! I have a question about your products.",
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-pastel-mint px-4 py-3 font-semibold text-ink shadow-lg transition hover:scale-105 hover:bg-mint"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm sm:inline">Chat with us</span>
    </a>
  );
}
