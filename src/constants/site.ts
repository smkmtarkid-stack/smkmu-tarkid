export const siteConfig = {
  name: "SMK Muhammadiyah Tarogong Kidul",
  shortName: "SMK Muhammadiyah",
  description:
    "Website resmi SMK Muhammadiyah Tarogong Kidul - Sekolah Menengah Kejuruan unggulan yang mencetak lulusan berkompeten, berakhlak mulia, dan siap bersaing di dunia kerja maupun perguruan tinggi.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://smkmutarkid.sch.id",
  ogImage: "/og-image.jpg",
  logo: "/logo.png",
  keywords: [
    "SMK Muhammadiyah Tarogong Kidul",
    "SMK Muhammadiyah Garut",
    "Sekolah Menengah Kejuruan",
    "SMK Garut",
    "Pendidikan Garut",
    "PPDB Garut",
    "SMK Muhammadiyah",
    "Tarogong Kidul",
  ],
  contact: {
    address:
      "Jl. Tarogong, Kec. Tarogong Kidul, Kab. Garut, Jawa Barat, Indonesia",
    phone: "(0262) 123-4567",
    email: "info@smkmutarkid.sch.id",
    whatsapp: "6281234567890",
  },
  social: {
    facebook: "https://facebook.com/smkmutarkid",
    instagram: "https://instagram.com/smkmutarkid",
    youtube: "https://youtube.com/@smkmutarkid",
    tiktok: "https://tiktok.com/@smkmutarkid",
  },
  maps: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.123456789!2d107.123456789!3d-7.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSMK+Muhammadiyah+Tarogong+Kidul!5e0!3m2!1sid!2sid!4v1234567890",
    lat: -7.2167,
    lng: 107.9,
  },
  school: {
    npsn: "12345678",
    accreditation: "A",
    foundedYear: 1970,
    headmaster: "Drs. H. Ahmad Fauzi, M.Pd.",
    headmasterPhoto: "/images/headmaster.jpg",
  },
} as const;

export type SiteConfig = typeof siteConfig;
