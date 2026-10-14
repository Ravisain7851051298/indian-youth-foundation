import VolunteerManagement from "@/components/dashboard/VolunteerManagement";

export const metadata = {
  title: "Volunteer Applications | Indian Youth Foundation Dashboard",
  description: "Review volunteer applications, verify ID proofs, and issue volunteer appointment letters.",
};

export default function DashboardVolunteersPage() {
  return <VolunteerManagement />;
}
