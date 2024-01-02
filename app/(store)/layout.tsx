export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>Header store</div>
      <main>{children}</main>
      <div>Footer store</div>
    </>
  );
}
