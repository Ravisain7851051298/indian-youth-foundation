import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "Services Management | Yuva Kranti Dal Dashboard",
  description: "Create, edit, organize, and manage foundation social services, welfare projects, and relief operations.",
};

export default function DashboardServicesPage() {
  return <ContentCollection resource="services" />;
}
