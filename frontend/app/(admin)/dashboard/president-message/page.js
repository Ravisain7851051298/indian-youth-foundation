import PresidentMessageManagement from "@/components/dashboard/PresidentMessageManagement";

export const metadata = {
  title: "President Message & Portrait | SSP Admin Dashboard",
  description: "Manage President message, executive letter, title, and official photo.",
};

export default function DashboardPresidentMessagePage() {
  return <PresidentMessageManagement />;
}
