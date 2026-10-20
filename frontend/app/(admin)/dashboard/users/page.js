import UsersManagement from "@/components/dashboard/UsersManagement";

export const metadata = {
  title: "User Accounts & Access Control | Yuva Kranti Dal Dashboard",
  description: "Comprehensive management of all registered users, volunteers, members, and administrators.",
};

export default function DashboardUsersPage() {
  return <UsersManagement />;
}
