import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "News & Press Management | Yuva Kranti Dal Dashboard",
  description: "Publish news announcements, articles, press releases, and editorial blogs.",
};

export default function DashboardBlogsPage() {
  return <ContentCollection resource="blogs" />;
}
