import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "News & Press Management | Indian Youth Foundation Dashboard",
  description: "Publish news announcements, articles, press releases, and editorial blogs.",
};

export default function DashboardBlogsPage() {
  return <ContentCollection resource="blogs" />;
}
