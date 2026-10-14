import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "Crowdfunding Campaigns Management | Indian Youth Foundation Dashboard",
  description: "Create, edit, manage, and upload banner photos for donation drives and welfare campaigns.",
};

export default function DashboardCampaignsPage() {
  return <ContentCollection resource="campaigns" />;
}
