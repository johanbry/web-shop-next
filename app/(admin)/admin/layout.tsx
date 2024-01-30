import AppShellWrapper from "@/app/components/admin/app-shell-wrapper";

export function generateMetadata() {
  return {
    title: "Administrationspanelen",
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShellWrapper>{children}</AppShellWrapper>;
}
