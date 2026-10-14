import TeamMembersManagement from "@/components/dashboard/TeamMembersManagement";

export const metadata = {
  title: "Team & Board Directory | Indian Youth Foundation Dashboard",
  description: "Manage leadership, department leads, and operations officers.",
};

export default function DashboardTeamMembersPage() {
  return <TeamMembersManagement />;
}
