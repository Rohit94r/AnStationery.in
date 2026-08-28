import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  FOOTER_CARE,
  FOOTER_COMPANY,
  FOOTER_SHOP,
  SITE,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-yellow font-display text-lg font-black text-ink">
                C
              </span>
              <span className="font-display text-xl font-black tracking-tight">
                Crayon<span className="text-yellow-deep">2</span>Couture
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-yellow"
                aria-label="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-pastel-mint"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <FooterCol title="Shop" links={FOOTER_SHOP} />

          {/* Customer care */}
          <FooterCol title="Customer Care" links={FOOTER_CARE} />

          {/* Company */}
          <FooterCol title="Company" links={FOOTER_COMPANY} />

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide">
              Stay Cute
            </h4>
            <p className="mt-3 text-sm text-muted">
              Join for new drops, offers & gift ideas.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-yellow-deep"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft"
              >
                Join
              </button>
            </form>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {SITE.email}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {SITE.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. Made with {"\u2728"} in
            India.
          </p>
          <p>Free delivery over {`\u20b9${SITE.freeShippingThreshold}`} &middot; 7-day returns</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-wide">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted transition hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
