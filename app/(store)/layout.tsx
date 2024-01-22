import { Container } from "@mantine/core";

import { convertCategoriesToTree, getAllCategories } from "@/lib/category";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import connectToDB from "@/utils/db";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToDB();
  const categories = await getAllCategories();
  const categoriesTree = convertCategoriesToTree(categories);

  return (
    <>
      <Header categories={categoriesTree} />
      <Container
        component="main"
        fluid
        py="lg"
        bg="var(--mantine-color-gray-0)"
      >
        {children}
      </Container>
      <Footer />
    </>
  );
}
