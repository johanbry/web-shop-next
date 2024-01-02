export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>Header admin</div>
      <main>{children}</main>
      <div>Footer admin</div>
    </>
  );
}
