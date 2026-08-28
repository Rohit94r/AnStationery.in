import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BENEFITS, SITE } from "@/lib/constants";

export const metadata = {
  title: "Contact & Help",
  description: "Get in touch with Crayon2Couture.",
};

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Orders are usually delivered within 3-6 business days across India.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return policy on unused products.",
  },
  {
    q: "Do you offer free shipping?",
    a: `Yes, free delivery on all orders above \u20b9${SITE.freeShippingThreshold}.`,
  },
  {
    q: "How can I track my order?",
    a: "Once shipped, you will receive a tracking number via WhatsApp/SMS.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-accent text-2xl font-bold text-yellow-deep">
        we&rsquo;re here to help
      </p>
      <h1 className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">
        Contact &amp; Care
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ContactCard
          icon={MessageCircle}
          title="WhatsApp"
          value="Chat with us"
          href={`https://wa.me/${SITE.whatsapp}`}
        />
        <ContactCard icon={Phone} title="Call" value={SITE.phone} href={`tel:${SITE.phone.replace(/\s/g, "")}`} />
        <ContactCard icon={Mail} title="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-xl font-black">Send a Message</h2>
        <form className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            placeholder="Your name"
            className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-yellow-deep"
          />
          <input
            placeholder="Email or phone"
            className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-yellow-deep"
          />
          <textarea
            placeholder="How can we help?"
            rows={4}
            className="sm:col-span-2 rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-yellow-deep"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-full bg-ink py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-black">FAQs</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-line bg-cream p-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q}
                <span className="text-yellow-deep transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-line bg-white p-4 text-center"
          >
            <div className="text-2xl">{b.emoji}</div>
            <div className="mt-1 text-sm font-bold">{b.title}</div>
            <div className="text-xs text-muted">{b.text}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-muted">
        <MapPin className="h-4 w-4" /> {SITE.address}
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 font-semibold text-ink hover:text-yellow-deep"
        >
          <Camera className="h-4 w-4" /> {SITE.instagramHandle}
        </a>
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-md"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream">
        <Icon className="h-6 w-6 text-yellow-deep" />
      </span>
      <span className="font-display font-black">{title}</span>
      <span className="text-sm text-muted">{value}</span>
    </a>
  );
}
