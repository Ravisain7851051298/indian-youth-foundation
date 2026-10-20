import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "Photo & Video Gallery Management | Yuva Kranti Dal Dashboard",
  description: "Upload and manage visual archives, field photos, relief drives, and YouTube videos.",
};

export default function DashboardGalleryPage() {
  return <ContentCollection resource="gallery" />;
}
