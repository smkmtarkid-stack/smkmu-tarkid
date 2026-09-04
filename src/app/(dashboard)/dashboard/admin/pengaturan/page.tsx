"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

export default function PengaturanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [formData, setFormData] = useState({
    alamat: "",
    telepon: "",
    email: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    map_embed: "",
    jam_operasional: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("pengaturan")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error(error);
        toast.error("Gagal memuat pengaturan");
      } else if (data) {
        setFormData({
          alamat: data.alamat || "",
          telepon: data.telepon || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
          tiktok: data.tiktok || "",
          map_embed: data.map_embed || "",
          jam_operasional: data.jam_operasional || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Check if row exists
      const { data: existing } = await supabase
        .from("pengaturan")
        .select("id")
        .eq("id", 1)
        .single();

      let error;
      if (existing) {
        const res = await supabase
          .from("pengaturan")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", 1);
        error = res.error;
      } else {
        const res = await supabase
          .from("pengaturan")
          .insert([{ id: 1, ...formData }]);
        error = res.error;
      }

      if (error) throw error;
      toast.success("Pengaturan berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menyimpan pengaturan: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
        setFormData((prev) => ({ ...prev, map_embed: embedUrl }));
        toast.success("Lokasi berhasil didapatkan!");
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error(error);
        toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Website</h1>
        <p className="text-muted-foreground">
          Kelola informasi kontak, alamat, tautan sosial media, dan peta lokasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kontak Utama */}
        <div className="bg-background rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2 mb-4">Informasi Kontak</h2>
          
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat Lengkap</Label>
            <Textarea
              id="alamat"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Jl. Tarogong, Kec. Tarogong Kidul, Kab. Garut..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telepon">Telepon</Label>
              <Input
                id="telepon"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="(0262) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (Nomor)</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="6281234567890"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@smkmutarkid.sch.id"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jam_operasional">Jam Operasional</Label>
            <Textarea
              id="jam_operasional"
              value={formData.jam_operasional}
              onChange={(e) => setFormData({ ...formData, jam_operasional: e.target.value })}
              placeholder="Senin - Jumat: 07.00 - 15.00 WIB"
            />
          </div>
        </div>

        {/* Maps & Sosial Media */}
        <div className="space-y-6">
          <div className="bg-background rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Peta Lokasi (Google Maps)</h2>
            
            <div className="space-y-2">
              <Label htmlFor="map_embed">URL Embed Maps / URL Iframe</Label>
              <Textarea
                id="map_embed"
                value={formData.map_embed}
                onChange={(e) => setFormData({ ...formData, map_embed: e.target.value })}
                placeholder="https://www.google.com/maps/embed?..."
                className="h-24 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Anda bisa menempelkan link embed langsung dari Google Maps, atau gunakan tombol di bawah untuk mendeteksi koordinat lokasi saat ini secara otomatis.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={getLocation}
              disabled={isFetchingLocation}
              className="w-full gap-2"
            >
              {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {isFetchingLocation ? "Mendeteksi..." : "Gunakan Lokasi Saat Ini (GPS)"}
            </Button>
            
            {formData.map_embed && (
              <div className="mt-4 rounded-xl overflow-hidden border">
                <iframe
                  src={formData.map_embed}
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="bg-background rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Sosial Media</h2>
            
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input
                id="youtube"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok URL</Label>
              <Input
                id="tiktok"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading} className="gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white px-8">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
