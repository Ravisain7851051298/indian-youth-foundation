import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "Events Management | Yuva Kranti Dal Dashboard",
  description: "Create, edit, and organize foundation drives, camps, youth workshops, and disaster relief events.",
};

export default function DashboardEventsPage() {
  return <ContentCollection resource="events" />;
}
