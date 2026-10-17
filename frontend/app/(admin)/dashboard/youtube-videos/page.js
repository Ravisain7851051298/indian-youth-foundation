import YoutubeVideosManagement from "@/components/dashboard/YoutubeVideosManagement";

export const metadata = {
  title: "YouTube Videos Management | SSP Admin Dashboard",
  description: "Upload and manage featured YouTube videos displayed on the homepage.",
};

export default function DashboardYoutubeVideosPage() {
  return <YoutubeVideosManagement />;
}
