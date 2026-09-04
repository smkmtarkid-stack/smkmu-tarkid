import { SectionTitle } from "@/components/common/section-title";
import { siteConfig } from "@/constants/site";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Kontak | SMK Muhammadiyah Tarogong Kidul",
  description: "Hubungi SMK Muhammadiyah Tarogong Kidul",
};

export const revalidate = 60;

export default async function KontakPage() {
  const { data: pengaturan } = await supabase
    .from("pengaturan")
    .select("*")
    .eq("id", 1)
    .single();

  const address = pengaturan?.alamat || siteConfig.contact.address;
  const phone = pengaturan?.telepon || siteConfig.contact.phone;
  const email = pengaturan?.email || siteConfig.contact.email;
  const jamOperasional = pengaturan?.jam_operasional || "Senin - Jumat: 07.00 - 15.00 WIB\nSabtu: 07.00 - 12.00 WIB";
  const mapEmbedUrl = pengaturan?.map_embed || siteConfig.maps.embedUrl;

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
                <p className="text-muted-foreground whitespace-pre-line">{address}</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Telepon</h3>
                <p className="text-muted-foreground">{phone}</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl border shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Jam Operasional</h3>
                <p className="text-muted-foreground whitespace-pre-line">{jamOperasional}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-background rounded-2xl border shadow-sm overflow-hidden">
            <iframe
              src={mapEmbedUrl}
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
