import DonationManagement from "@/components/dashboard/DonationManagement";

export const metadata = {
  title: "80G Donations Management | Indian Youth Foundation Dashboard",
  description: "Audit donations, approve 80G tax certificates, and manage banking credentials.",
};

export default function DashboardDonationsPage() {
  return <DonationManagement />;
}
