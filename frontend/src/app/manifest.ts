import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Docodo - Clinic & Doctor Practice Management",
    short_name: "Docodo OPD Clinic",
    description: "Appointment & Patient-Communication Software for Outpatient Clinics & Doctors",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#000000",
    orientation: "any",
    scope: "/",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["medical", "business", "productivity"],
  };
}
