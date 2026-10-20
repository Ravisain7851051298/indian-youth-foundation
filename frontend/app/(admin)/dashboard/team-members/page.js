import TeamMembersManagement from "@/components/dashboard/TeamMembersManagement";

export const metadata = {
  title: "Team & Board Directory | Yuva Kranti Dal Dashboard",
  description: "Manage leadership, department leads, and operations officers.",
};

export default function DashboardTeamMembersPage() {
  return <TeamMembersManagement />;
}
