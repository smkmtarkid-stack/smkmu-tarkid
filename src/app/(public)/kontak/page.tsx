import { SectionTitle } from "@/components/common/section-title";
import { siteConfig } from "@/constants/site";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kontak | SMK Muhammadiyah Tarogong Kidul",
  description: "Hubungi SMK Muhammadiyah Tarogong Kidul",
};

export default function KontakPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/30">
      <div className="container-custom max-w-5xl">
        <SectionTitle 
          title="Hubungi Kami" 
          subtitle="Kami siap membantu Anda. Silakan hubungi kami melalui salah satu kanal di bawah ini."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info Cards */}
          <div className="space-y-5">
            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Alamat</h3>
                <p className="text-muted-foreground">{siteConfig.contact.address}</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Telepon</h3>
                <p className="text-muted-foreground">{siteConfig.contact.phone}</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">{siteConfig.contact.email}</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Jam Operasional</h3>
                <p className="text-muted-foreground">Senin - Jumat: 07.00 - 15.00 WIB</p>
                <p className="text-muted-foreground">Sabtu: 07.00 - 12.00 WIB</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-background rounded-2xl border shadow-sm overflow-hidden">
            <iframe
              src={siteConfig.maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi SMK Muhammadiyah Tarogong Kidul"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
