import { Container } from "@mantine/core";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container component="main" fluid py="lg">
        {children}
      </Container>
      <Footer />
    </>
  );
}
