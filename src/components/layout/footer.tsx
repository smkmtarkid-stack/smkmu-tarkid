import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Video,
  ArrowUp,
} from "lucide-react";
import { siteConfig } from "@/constants/site";
import { footerNavigation } from "@/constants/navigation";
import { Separator } from "@/components/ui/separator";
import { BackToTop } from "@/components/common/back-to-top";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              {[
                { icon: Globe, href: siteConfig.social.facebook, label: "Facebook" },
                { icon: MessageCircle, href: siteConfig.social.instagram, label: "Instagram" },
                { icon: Video, href: siteConfig.social.youtube, label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
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
                <span className="text-sm text-white/70 leading-relaxed">
                  {siteConfig.contact.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-secondary" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-secondary" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>

            {/* Maps */}
            <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={siteConfig.maps.embedUrl}
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
