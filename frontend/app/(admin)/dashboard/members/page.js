import MembershipManagement from "@/components/dashboard/MembershipManagement";

export const metadata = {
  title: "Members Management | Indian Youth Foundation Dashboard",
  description: "Audit membership applications, verify payment proofs, and issue dual-sided ID cards.",
};

export default function DashboardMembersPage() {
  return <MembershipManagement />;
}
