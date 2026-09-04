import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUp,
} from "lucide-react";
import { siteConfig } from "@/constants/site";
import { footerNavigation } from "@/constants/navigation";
import { Separator } from "@/components/ui/separator";
import { BackToTop } from "@/components/common/back-to-top";
import { supabase } from "@/lib/supabase";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export async function Footer() {
  const currentYear = new Date().getFullYear();

  const { data: pengaturan } = await supabase
    .from("pengaturan")
    .select("*")
    .eq("id", 1)
    .single();

  const address = pengaturan?.alamat || siteConfig.contact.address;
  const phone = pengaturan?.telepon || siteConfig.contact.phone;
  const email = pengaturan?.email || siteConfig.contact.email;
  const facebookUrl = pengaturan?.facebook || siteConfig.social.facebook;
  const instagramUrl = pengaturan?.instagram || siteConfig.social.instagram;
  const youtubeUrl = pengaturan?.youtube || siteConfig.social.youtube;
  const mapEmbedUrl = pengaturan?.map_embed || siteConfig.maps.embedUrl;

  const socialLinks = [
    { icon: FacebookIcon, href: facebookUrl, label: "Facebook" },
    { icon: InstagramIcon, href: instagramUrl, label: "Instagram" },
    { icon: YoutubeIcon, href: youtubeUrl, label: "YouTube" },
  ];

  return (
    <footer className="relative bg-brand-accent text-white">
      {/* Wave separator */}
      <div className="absolute -top-px left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-12"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V16C1200 0 960 32 720 32S240 0 0 16v32z"
            fill="currentColor"
            className="text-brand-accent"
          />
        </svg>
      </div>

      <div className="container-custom pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 bg-white rounded-xl p-1">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="font-bold text-white">SMK Muhammadiyah</p>
                <p className="text-sm text-white/70">Tarogong Kidul</p>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Mencetak lulusan berkompeten, berakhlak mulia, dan siap bersaing
              di dunia kerja maupun perguruan tinggi.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Tentang */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-brand-secondary">
              Tentang Kami
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.tentang.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akademik */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-brand-secondary">
              Akademik
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.akademik.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-base mt-6 mb-4 text-brand-secondary">
              Informasi
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.informasi.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-brand-secondary">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-brand-secondary" />
                <span className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                  {address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-secondary" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-secondary" />
                  {email}
                </a>
              </li>
            </ul>

            {/* Maps */}
            <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi SMK Muhammadiyah Tarogong Kidul"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Built with ❤️ for pendidikan Indonesia
          </p>
        </div>
      </div>

      {/* Back to Top */}
      <BackToTop />
    </footer>
  );
}
